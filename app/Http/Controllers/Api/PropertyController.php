<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Http\Traits\HasApiResponse;
use App\Models\Booking;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PropertyController extends Controller
{
    use HasApiResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Optimize query with eager loading to prevent N+1
            $query = Property::with([
                'neighborhood:id,name',
                'agent:id,name,photo,phone,role',
            ])->select([
                'id', 'uuid', 'slug', 'title', 'description', 'price', 'currency',
                'type', 'neighborhood_id', 'agent_id', 'reference_id',
                'bedrooms', 'bathrooms', 'area_sqm', 'is_verified', 'is_featured',
                'amenities', 'images', 'status', 'created_at', 'updated_at',
            ]);

            // Filter by type
            if ($request->filled('type')) {
                $query->where('type', $request->type);
            }

            // Filter by price range
            if ($request->filled('min_price')) {
                $query->where('price', '>=', (float) $request->min_price);
            }
            if ($request->filled('max_price')) {
                $query->where('price', '<=', (float) $request->max_price);
            }

            // Filter by neighborhood
            if ($request->filled('neighborhood_id')) {
                $query->where('neighborhood_id', (int) $request->neighborhood_id);
            }

            // Filter by bedrooms
            if ($request->filled('bedrooms')) {
                $bedrooms = (int) $request->bedrooms;
                if ($bedrooms >= 4) {
                    $query->where('bedrooms', '>=', 4);
                } else {
                    $query->where('bedrooms', $bedrooms);
                }
            }

            // Filter by bathrooms
            if ($request->filled('bathrooms')) {
                $bathrooms = (int) $request->bathrooms;
                if ($bathrooms >= 3) {
                    $query->where('bathrooms', '>=', 3);
                } else {
                    $query->where('bathrooms', $bathrooms);
                }
            }

            // Filter by featured
            if ($request->boolean('featured')) {
                $query->where('is_featured', true);
            }

            // Filter by verified
            if ($request->boolean('verified')) {
                $query->where('is_verified', true);
            }

            // Filter by status (default: active)
            $status = $request->get('status', 'active');
            if (in_array($status, ['active', 'sold', 'rented'])) {
                $query->where('status', $status);
            }

            // Search in title and description
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->whereRaw('JSON_EXTRACT(title, "$.en") LIKE ?', ["%{$search}%"])
                      ->orWhereRaw('JSON_EXTRACT(title, "$.ar") LIKE ?', ["%{$search}%"])
                      ->orWhereRaw('JSON_EXTRACT(description, "$.en") LIKE ?', ["%{$search}%"])
                      ->orWhereRaw('JSON_EXTRACT(description, "$.ar") LIKE ?', ["%{$search}%"]);
                });
            }

            // Order by featured first, then created_at desc
            $query->orderBy('is_featured', 'desc')
                  ->orderBy('created_at', 'desc');

            // Paginate results
            $perPage = min((int) $request->get('per_page', 15), 100); // Max 100 per page
            $properties = $query->paginate($perPage);

            return PropertyResource::collection($properties)->response();
        } catch (\Exception $e) {
            Log::error('PropertyController@index error: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch properties. Please try again later.',
                500
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $identifier)
    {
        try {
            // Optimize query with eager loading to prevent N+1
            $property = Property::with([
                'neighborhood:id,name',
                'agent:id,name,photo,role,phone,languages,license_no',
            ])->select([
                'id', 'uuid', 'slug', 'title', 'description', 'price', 'currency',
                'type', 'neighborhood_id', 'agent_id', 'reference_id',
                'bedrooms', 'bathrooms', 'area_sqm', 'is_verified', 'is_featured',
                'amenities', 'images', 'video_url', 'owner_contact', 'status',
                'wifi_password', 'door_code', 'house_rules', 'full_address',
                'created_at', 'updated_at',
            ])->where(function ($query) use ($identifier) {
                $query->where('uuid', $identifier)
                      ->orWhere('slug', $identifier);
            })->first();

            if (!$property) {
                return $this->notFoundResponse('Property not found');
            }

            // Only show tenant details if user has active booking
            $showTenantDetails = false;
            if (Auth::check()) {
                $activeBooking = Booking::where('property_id', $property->id)
                    ->where('user_id', Auth::id())
                    ->where('booking_status', 'confirmed')
                    ->where('check_out', '>=', now())
                    ->exists();
                $showTenantDetails = $activeBooking;
            }

            // Hide tenant details if not authorized
            if (!$showTenantDetails) {
                $property->makeHidden(['wifi_password', 'door_code', 'house_rules', 'full_address']);
            }

            $resource = new PropertyResource($property);
            return $resource->response();
        } catch (\Exception $e) {
            Log::error('PropertyController@show error: ' . $e->getMessage(), [
                'identifier' => $identifier,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch property. Please try again later.',
                500
            );
        }
    }

    /**
     * Get property availability (blocked dates).
     */
    public function availability(Request $request, string $identifier)
    {
        try {
            $property = Property::select('id')
                ->where(function ($query) use ($identifier) {
                    $query->where('uuid', $identifier)
                          ->orWhere('slug', $identifier);
                })->first();

            if (!$property) {
                return $this->notFoundResponse('Property not found');
            }

            // Get all confirmed bookings (exclude cancelled)
            $bookings = Booking::where('property_id', $property->id)
                ->where('booking_status', '!=', 'cancelled')
                ->where('check_out', '>=', now())
                ->select('check_in', 'check_out')
                ->get();

            // Format blocked dates
            $blockedDates = [];
            foreach ($bookings as $booking) {
                $start = Carbon::parse($booking->check_in);
                $end = Carbon::parse($booking->check_out);
                
                $current = $start->copy();
                while ($current < $end) {
                    $blockedDates[] = $current->format('Y-m-d');
                    $current->addDay();
                }
            }

            return $this->successResponse([
                'property_id' => $property->id,
                'blocked_dates' => array_unique($blockedDates),
                'available' => count($blockedDates) === 0,
            ], 'Availability retrieved successfully');
        } catch (\Exception $e) {
            Log::error('PropertyController@availability error: ' . $e->getMessage(), [
                'identifier' => $identifier,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch availability. Please try again later.',
                500
            );
        }
    }
}
