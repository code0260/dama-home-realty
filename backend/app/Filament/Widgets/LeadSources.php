<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class LeadSources extends ChartWidget
{
    protected static ?string $heading = 'Lead Sources Distribution';
    
    protected static ?int $sort = 13;

    protected function getData(): array
    {
        // Get leads by source if source column exists
        try {
            $sources = Lead::select('source', DB::raw('count(*) as count'))
                ->whereNotNull('source')
                ->groupBy('source')
                ->get();
        } catch (\Exception $e) {
            // If source column doesn't exist, use type instead
            $sources = Lead::select('type', DB::raw('count(*) as count'))
                ->whereNotNull('type')
                ->groupBy('type')
                ->get();
        }

        $labels = [];
        $data = [];
        $colors = [
            'rgba(180, 145, 98, 0.9)', // Bronze
            'rgba(15, 23, 42, 0.9)', // Navy Blue
            'rgba(59, 130, 246, 0.9)', // Blue
            'rgba(34, 197, 94, 0.9)', // Green
            'rgba(168, 85, 247, 0.9)', // Purple
            'rgba(239, 68, 68, 0.9)', // Red
        ];

        foreach ($sources as $index => $source) {
            $label = $source->source ?? $source->type ?? 'Unknown';
            $labels[] = ucfirst(str_replace('_', ' ', $label));
            $data[] = $source->count;
        }

        // If no sources, show default
        if (empty($labels)) {
            $labels = ['Website', 'Direct Contact', 'Referral'];
            $data = [0, 0, 0];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Leads',
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
        return 'pie';
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
                ],
            ],
        ];
    }
}

