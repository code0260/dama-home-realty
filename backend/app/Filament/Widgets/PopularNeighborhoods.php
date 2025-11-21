<?php

namespace App\Filament\Widgets;

use App\Models\Neighborhood;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class PopularNeighborhoods extends ChartWidget
{
    protected static ?string $heading = 'Popular Neighborhoods';
    
    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $neighborhoods = Neighborhood::withCount('properties')
            ->orderBy('properties_count', 'desc')
            ->limit(5)
            ->get();

        $labels = [];
        $data = [];
        // Enhanced color palette: Bronze, Navy Blue, and complementary luxury colors
        $colors = [
            'rgba(180, 145, 98, 0.9)', // Bronze (primary brand color)
            'rgba(15, 23, 42, 0.9)', // Navy Blue (primary brand color)
            'rgba(180, 145, 98, 0.7)', // Lighter Bronze
            'rgba(30, 41, 59, 0.9)', // Slate (darker gray)
            'rgba(180, 145, 98, 0.6)', // Light Bronze
        ];

        foreach ($neighborhoods as $index => $neighborhood) {
            $name = is_array($neighborhood->name) 
                ? ($neighborhood->name['en'] ?? $neighborhood->name['ar'] ?? 'Unknown')
                : $neighborhood->name;
            $labels[] = $name;
            $data[] = $neighborhood->properties_count;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Properties',
                    'data' => $data,
                    'backgroundColor' => array_slice($colors, 0, count($data)),
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'pie';
    }
}

