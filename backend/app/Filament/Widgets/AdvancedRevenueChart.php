<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class AdvancedRevenueChart extends ChartWidget
{

    protected static ?string $heading = 'Advanced Revenue Analytics';
    
    protected static ?int $sort = 5;

    protected int | string | array $columnSpan = 'full';

    public ?string $filter = '12months';

    public function getFilters(): ?array
    {
        return [
            '7days' => 'Last 7 Days',
            '30days' => 'Last 30 Days',
            '3months' => 'Last 3 Months',
            '6months' => 'Last 6 Months',
            '12months' => 'Last 12 Months',
        ];
    }

    protected function getData(): array
    {
        $period = $this->filter ?? '12months';
        $labels = [];
        $totalRevenue = [];
        $bookingRevenue = [];
        $previousPeriodRevenue = [];

        switch ($period) {
            case '7days':
                for ($i = 6; $i >= 0; $i--) {
                    $date = Carbon::now()->subDays($i);
                    $labels[] = $date->format('M d');
                    
                    $dayRevenue = Booking::where('payment_status', 'paid')
                        ->whereDate('created_at', $date)
                        ->sum('amount_paid');
                    $totalRevenue[] = (float) $dayRevenue;
                    
                    $dayBookingRevenue = Booking::where('payment_status', 'paid')
                        ->whereDate('created_at', $date)
                        ->whereHas('property', function ($q) {
                            $q->where('type', 'hotel');
                        })
                        ->sum('amount_paid');
                    $bookingRevenue[] = (float) $dayBookingRevenue;
                    
                    // Previous period for comparison
                    $prevDate = $date->copy()->subDays(7);
                    $prevDayRevenue = Booking::where('payment_status', 'paid')
                        ->whereDate('created_at', $prevDate)
                        ->sum('amount_paid');
                    $previousPeriodRevenue[] = (float) $prevDayRevenue;
                }
                break;
                
            case '30days':
                for ($i = 29; $i >= 0; $i--) {
                    $date = Carbon::now()->subDays($i);
                    $labels[] = $date->format('M d');
                    
                    $dayRevenue = Booking::where('payment_status', 'paid')
                        ->whereDate('created_at', $date)
                        ->sum('amount_paid');
                    $totalRevenue[] = (float) $dayRevenue;
                    
                    $dayBookingRevenue = Booking::where('payment_status', 'paid')
                        ->whereDate('created_at', $date)
                        ->whereHas('property', function ($q) {
                            $q->where('type', 'hotel');
                        })
                        ->sum('amount_paid');
                    $bookingRevenue[] = (float) $dayBookingRevenue;
                }
                break;
                
            case '3months':
                for ($i = 2; $i >= 0; $i--) {
                    $date = Carbon::now()->subMonths($i);
                    $labels[] = $date->format('M Y');
                    
                    $monthRevenue = Booking::where('payment_status', 'paid')
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->sum('amount_paid');
                    $totalRevenue[] = (float) $monthRevenue;
                    
                    $monthBookingRevenue = Booking::where('payment_status', 'paid')
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->whereHas('property', function ($q) {
                            $q->where('type', 'hotel');
                        })
                        ->sum('amount_paid');
                    $bookingRevenue[] = (float) $monthBookingRevenue;
                }
                break;
                
            case '6months':
                for ($i = 5; $i >= 0; $i--) {
                    $date = Carbon::now()->subMonths($i);
                    $labels[] = $date->format('M Y');
                    
                    $monthRevenue = Booking::where('payment_status', 'paid')
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->sum('amount_paid');
                    $totalRevenue[] = (float) $monthRevenue;
                    
                    $monthBookingRevenue = Booking::where('payment_status', 'paid')
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->whereHas('property', function ($q) {
                            $q->where('type', 'hotel');
                        })
                        ->sum('amount_paid');
                    $bookingRevenue[] = (float) $monthBookingRevenue;
                }
                break;
                
            case '12months':
            default:
                for ($i = 11; $i >= 0; $i--) {
                    $date = Carbon::now()->subMonths($i);
                    $labels[] = $date->format('M Y');
                    
                    $monthRevenue = Booking::where('payment_status', 'paid')
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->sum('amount_paid');
                    $totalRevenue[] = (float) $monthRevenue;
                    
                    $monthBookingRevenue = Booking::where('payment_status', 'paid')
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->whereHas('property', function ($q) {
                            $q->where('type', 'hotel');
                        })
                        ->sum('amount_paid');
                    $bookingRevenue[] = (float) $monthBookingRevenue;
                }
                break;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Revenue',
                    'data' => $totalRevenue,
                    'backgroundColor' => 'rgba(180, 145, 98, 0.15)',
                    'borderColor' => '#B49162', // Bronze
                    'borderWidth' => 3,
                    'fill' => true,
                    'tension' => 0.4,
                    'pointBackgroundColor' => '#B49162',
                    'pointBorderColor' => '#ffffff',
                    'pointBorderWidth' => 2,
                    'pointRadius' => 5,
                    'pointHoverRadius' => 7,
                ],
                [
                    'label' => 'Booking Revenue',
                    'data' => $bookingRevenue,
                    'backgroundColor' => 'rgba(15, 23, 42, 0.15)',
                    'borderColor' => '#0F172A', // Navy Blue
                    'borderWidth' => 2,
                    'fill' => true,
                    'tension' => 0.4,
                    'pointBackgroundColor' => '#0F172A',
                    'pointBorderColor' => '#ffffff',
                    'pointBorderWidth' => 2,
                    'pointRadius' => 4,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'top',
                ],
                'tooltip' => [
                    'enabled' => true,
                    'mode' => 'index',
                    'intersect' => false,
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'ticks' => [
                        'callback' => 'function(value) { return "$" + value.toLocaleString(); }',
                    ],
                ],
            ],
            'interaction' => [
                'mode' => 'nearest',
                'axis' => 'x',
                'intersect' => false,
            ],
        ];
    }
}

