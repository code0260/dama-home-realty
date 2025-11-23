<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class BookingsAnalytics extends ChartWidget
{
    protected static ?string $heading = 'Bookings Analytics';
    
    protected static ?int $sort = 10;

    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        // Bookings per month (last 12 months)
        $months = [];
        $bookings = [];
        $confirmedBookings = [];
        $cancelledBookings = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months[] = $date->format('M Y');
            
            $monthBookings = Booking::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            $bookings[] = $monthBookings;
            
            $monthConfirmed = Booking::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->where('booking_status', 'confirmed')
                ->count();
            $confirmedBookings[] = $monthConfirmed;
            
            $monthCancelled = Booking::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->where('booking_status', 'cancelled')
                ->count();
            $cancelledBookings[] = $monthCancelled;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Bookings',
                    'data' => $bookings,
                    'backgroundColor' => 'rgba(15, 23, 42, 0.7)',
                    'borderColor' => '#0F172A',
                    'borderWidth' => 2,
                ],
                [
                    'label' => 'Confirmed',
                    'data' => $confirmedBookings,
                    'backgroundColor' => 'rgba(34, 197, 94, 0.7)',
                    'borderColor' => '#22C55E',
                    'borderWidth' => 2,
                ],
                [
                    'label' => 'Cancelled',
                    'data' => $cancelledBookings,
                    'backgroundColor' => 'rgba(239, 68, 68, 0.7)',
                    'borderColor' => '#EF4444',
                    'borderWidth' => 2,
                ],
            ],
            'labels' => $months,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'top',
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                ],
            ],
        ];
    }
}

