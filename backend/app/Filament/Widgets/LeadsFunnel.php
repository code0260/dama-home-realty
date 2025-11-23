<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Widgets\ChartWidget;

class LeadsFunnel extends ChartWidget
{
    protected static ?string $heading = 'Leads Sales Funnel';
    
    protected static ?int $sort = 12;

    protected function getData(): array
    {
        $funnel = [
            'New' => Lead::where('status', 'new')->count(),
            'Contacted' => Lead::where('status', 'contacted')->count(),
            'Qualified' => Lead::where('status', 'qualified')->count(),
            'Closed' => Lead::where('status', 'closed')->count(),
        ];

        $labels = array_keys($funnel);
        $data = array_values($funnel);

        // Calculate conversion rates
        $total = $funnel['New'];
        $conversionRates = [];
        foreach ($funnel as $stage => $count) {
            $conversionRates[] = $total > 0 ? round(($count / $total) * 100, 1) : 0;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Leads Count',
                    'data' => $data,
                    'backgroundColor' => [
                        'rgba(180, 145, 98, 0.9)', // Bronze - New
                        'rgba(15, 23, 42, 0.9)', // Navy - Contacted
                        'rgba(59, 130, 246, 0.9)', // Blue - Qualified
                        'rgba(34, 197, 94, 0.9)', // Green - Closed
                    ],
                    'borderColor' => [
                        '#B49162',
                        '#0F172A',
                        '#3B82F6',
                        '#22C55E',
                    ],
                    'borderWidth' => 2,
                ],
                [
                    'label' => 'Conversion Rate (%)',
                    'data' => $conversionRates,
                    'type' => 'line',
                    'borderColor' => '#EF4444',
                    'borderWidth' => 2,
                    'fill' => false,
                    'yAxisID' => 'y1',
                ],
            ],
            'labels' => $labels,
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
                'tooltip' => [
                    'enabled' => true,
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'position' => 'left',
                ],
                'y1' => [
                    'beginAtZero' => true,
                    'position' => 'right',
                    'grid' => [
                        'drawOnChartArea' => false,
                    ],
                ],
            ],
        ];
    }
}

