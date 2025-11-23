<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\Widget;
use Illuminate\Support\Carbon;

class BookingsTimeline extends Widget
{
    protected static string $view = 'filament.widgets.bookings-timeline';
    
    protected static ?string $heading = 'Bookings Timeline';
    
    protected static ?int $sort = 16;

    protected int | string | array $columnSpan = 'full';

    protected int | string | array $columnSpanTablet = 'full';

    protected int | string | array $columnSpanDesktop = 'full';

    public function getViewData(): array
    {
        // Get bookings for the next 30 days
        $startDate = Carbon::now();
        $endDate = Carbon::now()->addDays(30);

        $bookings = Booking::with(['property', 'user'])
            ->where('booking_status', 'confirmed')
            ->whereBetween('check_in', [$startDate, $endDate])
            ->orderBy('check_in', 'asc')
            ->get()
            ->map(function ($booking) {
                $checkIn = Carbon::parse($booking->check_in);
                $checkOut = Carbon::parse($booking->check_out);
                $duration = $checkIn->diffInDays($checkOut);

                return [
                    'id' => $booking->id,
                    'property_title' => $booking->property ? 
                        ($booking->property->getTranslation('title', 'en') ?? 
                         $booking->property->getTranslation('title', 'ar') ?? 
                         'Unknown') : 'Unknown',
                    'guest_name' => $booking->user->name ?? 'Unknown',
                    'check_in' => $checkIn->format('Y-m-d'),
                    'check_out' => $checkOut->format('Y-m-d'),
                    'duration' => $duration,
                    'status' => $booking->booking_status,
                    'payment_status' => $booking->payment_status,
                    'total_price' => $booking->total_price,
                    'days_from_now' => Carbon::now()->diffInDays($checkIn, false),
                ];
            });

        // Group by date for timeline view
        $timeline = [];
        foreach ($bookings as $booking) {
            $date = $booking['check_in'];
            if (!isset($timeline[$date])) {
                $timeline[$date] = [];
            }
            $timeline[$date][] = $booking;
        }

        return [
            'bookings' => $bookings,
            'timeline' => $timeline,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
        ];
    }
}

