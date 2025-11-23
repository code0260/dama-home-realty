<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use App\Models\Lead;
use App\Models\Property;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 0;

    protected function getStats(): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();

        // Revenue
        $totalRevenue = Booking::where('payment_status', 'paid')->sum('amount_paid');
        $thisMonthRevenue = Booking::where('payment_status', 'paid')
            ->where('created_at', '>=', $thisMonth)
            ->sum('amount_paid');
        $lastMonthRevenue = Booking::where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastMonth, $lastMonthEnd])
            ->sum('amount_paid');
        $revenueGrowth = $lastMonthRevenue > 0 
            ? (($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;

        // Properties
        $totalProperties = Property::count();
        $activeProperties = Property::where('status', 'active')->count();
        $thisMonthProperties = Property::where('created_at', '>=', $thisMonth)->count();
        $lastMonthProperties = Property::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();
        $propertiesGrowth = $lastMonthProperties > 0 
            ? (($thisMonthProperties - $lastMonthProperties) / $lastMonthProperties) * 100 
            : 0;

        // Bookings
        $totalBookings = Booking::count();
        $thisMonthBookings = Booking::where('created_at', '>=', $thisMonth)->count();
        $lastMonthBookings = Booking::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();
        $bookingsGrowth = $lastMonthBookings > 0 
            ? (($thisMonthBookings - $lastMonthBookings) / $lastMonthBookings) * 100 
            : 0;

        // Leads
        $totalLeads = Lead::count();
        $newLeads = Lead::where('status', 'new')->count();
        $thisMonthLeads = Lead::where('created_at', '>=', $thisMonth)->count();
        $lastMonthLeads = Lead::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();
        $leadsGrowth = $lastMonthLeads > 0 
            ? (($thisMonthLeads - $lastMonthLeads) / $lastMonthLeads) * 100 
            : 0;

        return [
            Stat::make('Total Revenue', '$' . number_format($totalRevenue, 2))
                ->description(
                    ($revenueGrowth >= 0 ? '+' : '') . 
                    number_format(abs($revenueGrowth), 1) . '% from last month'
                )
                ->descriptionIcon($revenueGrowth >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenueGrowth >= 0 ? 'success' : 'danger')
                ->chart($this->getRevenueChartData())
                ->icon('heroicon-o-currency-dollar'),
            
            Stat::make('Properties', $totalProperties)
                ->description($activeProperties . ' active')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('info')
                ->chart($this->getPropertiesChartData())
                ->icon('heroicon-o-home-modern'),
            
            Stat::make('Bookings', $totalBookings)
                ->description($thisMonthBookings . ' this month')
                ->descriptionIcon($bookingsGrowth >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($bookingsGrowth >= 0 ? 'success' : 'warning')
                ->chart($this->getBookingsChartData())
                ->icon('heroicon-o-calendar'),
            
            Stat::make('Leads', $totalLeads)
                ->description($newLeads . ' new')
                ->descriptionIcon($leadsGrowth >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($leadsGrowth >= 0 ? 'success' : 'warning')
                ->chart($this->getLeadsChartData())
                ->icon('heroicon-o-user-group'),
        ];
    }

    /**
     * Get revenue chart data (last 7 days)
     */
    protected function getRevenueChartData(): array
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dayRevenue = Booking::where('payment_status', 'paid')
                ->whereDate('created_at', $date)
                ->sum('amount_paid');
            $data[] = round($dayRevenue / 100, 2); // Normalize for chart display
        }
        return $data;
    }

    /**
     * Get properties chart data (last 7 days)
     */
    protected function getPropertiesChartData(): array
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dayProperties = Property::whereDate('created_at', $date)->count();
            $data[] = $dayProperties;
        }
        return $data;
    }

    /**
     * Get bookings chart data (last 7 days)
     */
    protected function getBookingsChartData(): array
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dayBookings = Booking::whereDate('created_at', $date)->count();
            $data[] = $dayBookings;
        }
        return $data;
    }

    /**
     * Get leads chart data (last 7 days)
     */
    protected function getLeadsChartData(): array
    {
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dayLeads = Lead::whereDate('created_at', $date)->count();
            $data[] = $dayLeads;
        }
        return $data;
    }

    /**
     * Polling interval for real-time updates
     */
    protected function getPollingInterval(): ?string
    {
        return '30s'; // Poll every 30 seconds for real-time updates
    }
}

