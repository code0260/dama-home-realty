<?php

namespace App\Filament\Resources\BookingResource\Pages;

use App\Filament\Resources\BookingResource;
use App\Mail\BookingConfirmed;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EditBooking extends EditRecord
{
    protected static string $resource = BookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->visible(fn () => auth()->user()->hasRole('Super Admin')),
        ];
    }

    protected function afterSave(): void
    {
        $booking = $this->record;
        
        // Load relationships
        $booking->load(['property', 'user']);

        // Send booking confirmation email if booking status changed to confirmed
        $wasConfirmed = $booking->getOriginal('booking_status') === 'confirmed';
        $isNowConfirmed = $booking->booking_status === 'confirmed';
        
        if (!$wasConfirmed && $isNowConfirmed && $booking->user) {
            try {
                Mail::to($booking->user->email)->send(new BookingConfirmed($booking));
                Log::info('Booking confirmation email sent after status update', [
                    'booking_id' => $booking->id,
                    'user_email' => $booking->user->email,
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to send booking confirmation email after status update', [
                    'booking_id' => $booking->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
