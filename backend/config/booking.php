<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Booking Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration options for booking-related features
    | such as deposit percentage, cancellation policies, etc.
    |
    */

    /**
     * Deposit percentage required for booking confirmation
     * Default: 30% (0.30)
     */
    'deposit_percentage' => env('BOOKING_DEPOSIT_PERCENTAGE', 30),

    /**
     * Minimum number of nights for a booking
     * Default: 1
     */
    'min_nights' => env('BOOKING_MIN_NIGHTS', 1),

    /**
     * Maximum number of nights for a booking
     * Default: 365
     */
    'max_nights' => env('BOOKING_MAX_NIGHTS', 365),

    /**
     * Cancellation policy in days before check-in
     * Default: 7 days
     */
    'cancellation_days' => env('BOOKING_CANCELLATION_DAYS', 7),

];

