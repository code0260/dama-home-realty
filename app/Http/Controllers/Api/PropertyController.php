<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Booking;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Property::with(['neighborhood', 'agent']);

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by price range
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by neighborhood
        if ($request->has('neighborhood_id')) {
            $query->where('neighborhood_id', $request->neighborhood_id);
        }

        // Filter by bedrooms
        if ($request->has('bedrooms')) {
            $bedrooms = (int) $request->bedrooms;
            if ($bedrooms >= 4) {
                $query->where('bedrooms', '>=', 4);
            } else {
                $query->where('bedrooms', $bedrooms);
            }
        }

        // Filter by bathrooms
        if ($request->has('bathrooms')) {
            $bathrooms = (int) $request->bathrooms;
            if ($bathrooms >= 3) {
                $query->where('bathrooms', '>=', 3);
            } else {
                $query->where('bathrooms', $bathrooms);
            }
        }

        // Filter by featured
        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        // Filter by status (default: active)
        $query->where('status', $request->get('status', 'active'));

        // Order by featured first, then created_at desc
        $query->orderBy('is_featured', 'desc')->latest();

        // Paginate results
        $perPage = $request->get('per_page', 15);
        $properties = $query->paginate($perPage);

        return PropertyResource::collection($properties);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $identifier)
    {
        // Support both UUID and slug lookup
        $property = Property::with(['neighborhood', 'agent'])
            ->where(function ($query) use ($identifier) {
                $query->where('uuid', $identifier)
                      ->orWhere('slug', $identifier);
            })
            ->firstOrFail();

        return new PropertyResource($property);
    }

    /**
     * Get property availability (blocked dates).
     */
    public function availability(string $identifier)
    {
        $property = Property::where(function ($query) use ($identifier) {
            $query->where('uuid', $identifier)
                  ->orWhere('slug', $identifier);
        })->firstOrFail();

        // Get all confirmed bookings (exclude cancelled)
        $bookings = Booking::where('property_id', $property->id)
            ->where('booking_status', '!=', 'cancelled')
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

        return response()->json([
            'property_id' => $property->id,
            'blocked_dates' => array_unique($blockedDates),
            'available' => count($blockedDates) === 0,
        ]);
    }
}
