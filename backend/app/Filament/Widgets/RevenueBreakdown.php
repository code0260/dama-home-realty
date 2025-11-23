<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class RevenueBreakdown extends ChartWidget
{
    protected static ?string $heading = 'Revenue Breakdown by Source';
    
    protected static ?int $sort = 6;

    protected function getData(): array
    {
        // Get revenue by property type
        $revenueByType = Booking::where('payment_status', 'paid')
            ->join('properties', 'bookings.property_id', '=', 'properties.id')
            ->select('properties.type', DB::raw('SUM(bookings.amount_paid) as total'))
            ->groupBy('properties.type')
            ->get();

        $labels = [];
        $data = [];
        $colors = [
            'rgba(180, 145, 98, 0.9)', // Bronze
            'rgba(15, 23, 42, 0.9)', // Navy Blue
            'rgba(30, 41, 59, 0.9)', // Slate
            'rgba(180, 145, 98, 0.7)', // Lighter Bronze
            'rgba(15, 23, 42, 0.7)', // Lighter Navy
        ];

        $totalRevenue = $revenueByType->sum('total');

        foreach ($revenueByType as $index => $item) {
            $labels[] = ucfirst($item->type ?? 'Other');
            $percentage = $totalRevenue > 0 ? ($item->total / $totalRevenue) * 100 : 0;
            $data[] = round($percentage, 2);
        }

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (%)',
                    'data' => $data,
                    'backgroundColor' => array_slice($colors, 0, count($data)),
                    'borderColor' => '#ffffff',
                    'borderWidth' => 2,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'right',
                ],
                'tooltip' => [
                    'enabled' => true,
                    'callbacks' => [
                        'label' => 'function(context) { 
                            return context.label + ": " + context.parsed + "%"; 
                        }',
                    ],
                ],
            ],
        ];
    }
}

