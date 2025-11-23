<?php

namespace App\Filament\Widgets;

use App\Models\Property;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class PropertiesStatistics extends BaseWidget
{
    protected static ?int $sort = 8;

    protected function getStats(): array
    {
        // Status breakdown
        $statusBreakdown = Property::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        $activeCount = $statusBreakdown->get('active', 0);
        $pendingCount = $statusBreakdown->get('pending', 0);
        $soldCount = $statusBreakdown->get('sold', 0);
        $rentedCount = $statusBreakdown->get('rented', 0);

        // Type breakdown
        $typeBreakdown = Property::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get()
            ->pluck('count', 'type');

        $hotelCount = $typeBreakdown->get('hotel', 0);
        $rentCount = $typeBreakdown->get('rent', 0);
        $saleCount = $typeBreakdown->get('sale', 0);

        // Average price
        $avgPrice = Property::avg('price') ?? 0;

        // Total properties
        $totalProperties = Property::count();

        return [
            Stat::make('Total Properties', $totalProperties)
                ->description($activeCount . ' active')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('info')
                ->icon('heroicon-o-home-modern'),
            
            Stat::make('Active Properties', $activeCount)
                ->description($pendingCount . ' pending')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success')
                ->icon('heroicon-o-check-badge'),
            
            Stat::make('Average Price', '$' . number_format($avgPrice, 2))
                ->description('Across all properties')
                ->descriptionIcon('heroicon-m-currency-dollar')
                ->color('warning')
                ->icon('heroicon-o-currency-dollar'),
            
            Stat::make('By Type', $hotelCount . ' Hotel, ' . $rentCount . ' Rent, ' . $saleCount . ' Sale')
                ->description('Property distribution')
                ->descriptionIcon('heroicon-m-chart-pie')
                ->color('info')
                ->icon('heroicon-o-chart-bar'),
        ];
    }
}

