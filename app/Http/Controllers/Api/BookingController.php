<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Booking::with(['property.neighborhood', 'user']);

        // Filter by user (for tenants to see their own bookings)
        if ($request->user() && $request->user()->hasRole('Tenant')) {
            $query->where('user_id', $request->user()->id);
    }

        // Filter by property
        if ($request->has('property_id')) {
            $query->where('property_id', $request->property_id);
        }

        // Filter by status
        if ($request->has('booking_status')) {
            $query->where('booking_status', $request->booking_status);
        }

        $bookings = $query->orderBy('check_in', 'desc')->paginate(15);

        return BookingResource::collection($bookings);
    }

    /**
     * Store a newly created booking.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
            'notes' => 'nullable|string',
        ]);

        $property = Property::findOrFail($validated['property_id']);

        // Only hotel/rent type properties can be booked
        if (!in_array($property->type, ['hotel', 'rent'])) {
            throw ValidationException::withMessages([
                'property_id' => 'This property type cannot be booked.',
            ]);
        }

        $checkIn = Carbon::parse($validated['check_in']);
        $checkOut = Carbon::parse($validated['check_out']);

        // Check for date overlaps
        if (Booking::hasOverlap($property->id, $checkIn, $checkOut)) {
            throw ValidationException::withMessages([
                'check_in' => 'These dates are already booked. Please select different dates.',
            ]);
        }

        // Calculate total price (price per night * number of nights)
        $nights = $checkIn->diffInDays($checkOut);
        $totalPrice = $property->price * $nights;

        // Get user (tenant) - require authentication
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

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

        return new BookingResource($booking->load(['property', 'user']));
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $booking = Booking::with(['property', 'user'])->findOrFail($id);

        // Tenants can only see their own bookings
        if (Auth::user() && Auth::user()->hasRole('Tenant') && $booking->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return new BookingResource($booking);
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);

        // Only admins can update bookings
        if (!Auth::user() || !Auth::user()->hasRole('Super Admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'booking_status' => 'sometimes|in:confirmed,cancelled,completed,pending',
            'payment_status' => 'sometimes|in:pending,paid,partial,refunded',
            'amount_paid' => 'sometimes|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $booking->update($validated);

        return new BookingResource($booking->load(['property', 'user']));
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(string $id)
    {
        $booking = Booking::findOrFail($id);

        // Only admins can delete bookings
        if (!Auth::user() || !Auth::user()->hasRole('Super Admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }
}
