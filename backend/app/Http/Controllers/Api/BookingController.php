<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Http\Traits\HasApiResponse;
use App\Models\Booking;
use App\Models\Property;
use App\Events\BookingCreated;
use App\Notifications\NewBookingNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

class BookingController extends Controller
{
    use HasApiResponse;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            // Optimize query with eager loading
            $query = Booking::with([
                'property:id,uuid,slug,title,type,price,currency',
                'property.neighborhood:id,name',
                'user:id,name,email',
            ]);

            // Filter by user (for tenants to see their own bookings)
            if ($request->user() && $request->user()->hasRole('Tenant')) {
                $query->where('user_id', $request->user()->id);
            }

            // Filter by property
            if ($request->filled('property_id')) {
                $query->where('property_id', (int) $request->property_id);
            }

            // Filter by status
            if ($request->filled('booking_status')) {
                $query->where('booking_status', $request->booking_status);
            }

            // Filter by payment status
            if ($request->filled('payment_status')) {
                $query->where('payment_status', $request->payment_status);
            }

            // Order by check_in desc
            $query->orderBy('check_in', 'desc');

            // Paginate results
            $perPage = min((int) $request->get('per_page', 15), 100);
            $bookings = $query->paginate($perPage);

            return BookingResource::collection($bookings)->response();
        } catch (\Exception $e) {
            Log::error('BookingController@index error: ' . $e->getMessage(), [
                'request' => $request->except(['password', 'password_confirmation']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch bookings. Please try again later.',
                500
            );
        }
    }

    /**
     * Store a newly created booking.
     */
    public function store(StoreBookingRequest $request)
    {
        try {
            $validated = $request->validated();

            // Get user (tenant) - require authentication
            $user = Auth::user();
            if (!$user) {
                return $this->unauthorizedResponse('You must be logged in to make a booking.');
            }

            $property = Property::findOrFail($validated['property_id']);

            // Only hotel/rent type properties can be booked
            if (!in_array($property->type, ['hotel', 'rent'])) {
                return $this->validationErrorResponse([
                    'property_id' => ['This property type cannot be booked.'],
                ], 'Invalid property type for booking.');
            }

            $checkIn = Carbon::parse($validated['check_in']);
            $checkOut = Carbon::parse($validated['check_out']);

            // Check for date overlaps
            if (Booking::hasOverlap($property->id, $checkIn, $checkOut)) {
                return $this->validationErrorResponse([
                    'check_in' => ['These dates are already booked. Please select different dates.'],
                ], 'Date conflict detected.');
            }

            // Calculate total price (price per night * number of nights)
            $nights = $checkIn->diffInDays($checkOut);
            $totalPrice = $property->price * $nights;

            // Use database transaction for atomicity
            $booking = DB::transaction(function () use ($user, $property, $checkIn, $checkOut, $totalPrice, $validated) {
                // Ensure user has Tenant role
                if (!$user->hasRole('Tenant')) {
                    $user->assignRole('Tenant');
                }

                $booking = Booking::create([
                    'property_id' => $property->id,
                    'user_id' => $user->id,
                    'check_in' => $checkIn,
                    'check_out' => $checkOut,
                    'total_price' => $totalPrice,
                    'amount_paid' => 0,
                    'payment_status' => 'pending',
                    'booking_status' => 'pending',
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Load relationships
                $booking->load(['property', 'user']);

                // Broadcast real-time notification
                event(new BookingCreated($booking));

                // Notify Super Admins (Database + Email) - with eager loading to prevent N+1
                $admins = \App\Models\User::role('Super Admin')->with('roles')->get();
                if ($admins->isNotEmpty()) {
                    Notification::send($admins, new NewBookingNotification($booking));
                }

                return $booking;
            });

            $resource = new BookingResource($booking);
            return $resource->response();
        } catch (\Illuminate\Validation\ValidationException $e) {
            return $this->validationErrorResponse(
                $e->errors(),
                'Validation failed'
            );
        } catch (\Exception $e) {
            Log::error('BookingController@store error: ' . $e->getMessage(), [
                'request' => $request->except(['password', 'password_confirmation']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to create booking. Please try again later.',
                500
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        try {
            $booking = Booking::with([
                'property:id,uuid,slug,title,type,price,currency',
                'property.neighborhood:id,name',
                'user:id,name,email',
            ])->find($id);

            if (!$booking) {
                return $this->notFoundResponse('Booking not found');
            }

            // Tenants can only see their own bookings
            if (Auth::user() && Auth::user()->hasRole('Tenant') && $booking->user_id !== Auth::id()) {
                return $this->forbiddenResponse('You can only view your own bookings.');
            }

            $resource = new BookingResource($booking);
            return $resource->response();
        } catch (\Exception $e) {
            Log::error('BookingController@show error: ' . $e->getMessage(), [
                'id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to fetch booking. Please try again later.',
                500
            );
        }
    }

    /**
     * Update the specified resource.
     */
    public function update(UpdateBookingRequest $request, string $id)
    {
        try {
            $booking = Booking::with([
                'property:id,uuid,slug,title,type,price,currency',
                'property.neighborhood:id,name',
                'user:id,name,email',
            ])->find($id);

            if (!$booking) {
                return $this->notFoundResponse('Booking not found');
            }

            // Authorization check: Tenants can only update their own bookings, Admins can update any
            $user = Auth::user();
            if ($user->hasRole('Tenant') && $booking->user_id !== $user->id) {
                return $this->forbiddenResponse('You can only update your own bookings.');
            }

            $validated = $request->validated();
            $booking->update($validated);

            $resource = new BookingResource($booking->load(['property', 'user']));
            return $resource->response();
        } catch (\Exception $e) {
            Log::error('BookingController@update error: ' . $e->getMessage(), [
                'id' => $id,
                'request' => $request->except(['password', 'password_confirmation']),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to update booking. Please try again later.',
                500
            );
        }
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            // Only admins can delete bookings
            if (!Auth::user() || !Auth::user()->hasRole('Super Admin')) {
                return $this->forbiddenResponse('Only administrators can delete bookings.');
            }

            $booking = Booking::find($id);

            if (!$booking) {
                return $this->notFoundResponse('Booking not found');
            }

            $booking->delete();

            return $this->successResponse(null, 'Booking deleted successfully');
        } catch (\Exception $e) {
            Log::error('BookingController@destroy error: ' . $e->getMessage(), [
                'id' => $id,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to delete booking. Please try again later.',
                500
            );
        }
    }
}
