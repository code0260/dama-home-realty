<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Revenue (Last 12 Months)';
    
    protected static ?int $sort = 1;

    protected function getData(): array
    {
        $months = [];
        $revenue = [];

        for ($i = 11; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $months[] = $date->format('M Y');
            
            $monthRevenue = Booking::where('payment_status', 'paid')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('amount_paid');
            
            $revenue[] = (float) $monthRevenue;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (USD)',
                    'data' => $revenue,
                    'backgroundColor' => 'rgba(180, 145, 98, 0.15)',
                    'borderColor' => '#B49162', // Bronze brand color
                    'borderWidth' => 3,
                    'fill' => true,
                    'tension' => 0.4, // Smooth curve
                    'pointBackgroundColor' => '#B49162',
                    'pointBorderColor' => '#ffffff',
                    'pointBorderWidth' => 2,
                    'pointRadius' => 5,
                    'pointHoverRadius' => 7,
                    'pointHoverBackgroundColor' => '#9A7A4F',
                    'pointHoverBorderColor' => '#ffffff',
                    'pointHoverBorderWidth' => 3,
                ],
            ],
            'labels' => $months,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}

