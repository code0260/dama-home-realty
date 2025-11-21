<?php

namespace App\Filament\Resources\BookingResource\Pages;

use App\Filament\Resources\BookingResource;
use App\Mail\BookingConfirmed;
use App\Notifications\NewBookingNotification;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class CreateBooking extends CreateRecord
{
    protected static string $resource = BookingResource::class;

    protected function afterCreate(): void
    {
        $booking = $this->record;
        
        // Load relationships
        $booking->load(['property', 'user']);

        // Notify Super Admins
        $admins = \App\Models\User::role('Super Admin')->get();
        Notification::send($admins, new NewBookingNotification($booking));

        // Send booking confirmation email if booking is confirmed
        if ($booking->booking_status === 'confirmed' && $booking->user) {
            try {
                Mail::to($booking->user->email)->send(new BookingConfirmed($booking));
                Log::info('Booking confirmation email sent from admin', [
                    'booking_id' => $booking->id,
                    'user_email' => $booking->user->email,
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to send booking confirmation email from admin', [
                    'booking_id' => $booking->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
