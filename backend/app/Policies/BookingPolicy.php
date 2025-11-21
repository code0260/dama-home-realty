<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;

class BookingPolicy
{
    /**
     * Determine if the user can view any bookings.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can view the booking.
     */
    public function view(User $user, Booking $booking): bool
    {
        // Users can view their own bookings, admins and staff can view all
        return $user->id === $booking->user_id || $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can create bookings.
     */
    public function create(User $user): bool
    {
        // Any authenticated user can create a booking
        return true;
    }

    /**
     * Determine if the user can update the booking.
     */
    public function update(User $user, Booking $booking): bool
    {
        // Users can update their own bookings, admins and staff can update any
        return $user->id === $booking->user_id || $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can delete the booking.
     */
    public function delete(User $user, Booking $booking): bool
    {
        // Only Super Admin can delete bookings
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can delete any bookings.
     */
    public function deleteAny(User $user): bool
    {
        // Only Super Admin can delete
        return $user->hasRole('Super Admin');
    }
}

