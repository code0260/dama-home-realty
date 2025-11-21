<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class BookingsChart extends ChartWidget
{
    protected static ?string $heading = 'Bookings per Month (Last 12 Months)';
    
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $months = [];
        $bookings = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months[] = $date->format('M Y');
            
            $monthBookings = Booking::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            
            $bookings[] = $monthBookings;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Number of Bookings',
                    'data' => $bookings,
                    'backgroundColor' => 'rgba(15, 23, 42, 0.7)', // Navy Blue
                    'borderColor' => '#0F172A', // Navy Blue brand color
                    'borderWidth' => 2,
                    'borderRadius' => 6, // Rounded corners
                    'borderSkipped' => false,
                ],
            ],
            'labels' => $months,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}

