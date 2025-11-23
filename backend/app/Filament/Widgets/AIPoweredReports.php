<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use App\Models\Lead;
use App\Models\Property;
use Filament\Widgets\Widget;
use Illuminate\Support\Facades\DB;

class AIPoweredReports extends Widget
{
    protected static string $view = 'filament.widgets.ai-powered-reports';
    
    protected static ?string $heading = 'AI-Powered Reports';
    
    protected static ?int $sort = 22;

    protected int | string | array $columnSpan = 'full';

    public function getViewData(): array
    {
        // Generate AI-powered insights and predictions
        $reports = [
            'revenue_prediction' => $this->predictRevenue(),
            'lead_scoring' => $this->scoreLeads(),
            'property_recommendations' => $this->recommendProperties(),
            'anomaly_detection' => $this->detectAnomalies(),
        ];

        return [
            'reports' => $reports,
            'generated_at' => now()->format('Y-m-d H:i:s'),
        ];
    }

    protected function predictRevenue(): array
    {
        // Simple prediction based on historical data
        $lastMonthRevenue = Booking::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->sum('total_price');

        $thisMonthRevenue = Booking::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_price');

        $growthRate = $lastMonthRevenue > 0 
            ? (($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
            : 0;

        $predictedNextMonth = $thisMonthRevenue * (1 + ($growthRate / 100));

        return [
            'current_month' => $thisMonthRevenue,
            'last_month' => $lastMonthRevenue,
            'growth_rate' => round($growthRate, 2),
            'predicted_next_month' => round($predictedNextMonth, 2),
            'confidence' => $growthRate > 0 ? 'high' : ($growthRate > -10 ? 'medium' : 'low'),
        ];
    }

    protected function scoreLeads(): array
    {
        // Lead scoring based on various factors
        $leads = Lead::with('property')
            ->where('status', 'new')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($lead) {
                $score = 50; // Base score

                // Property inquiry gets higher score
                if ($lead->property_id) {
                    $score += 20;
                }

                // Recent leads get higher score
                $daysSinceCreated = now()->diffInDays($lead->created_at);
                if ($daysSinceCreated <= 1) {
                    $score += 15;
                } elseif ($daysSinceCreated <= 3) {
                    $score += 10;
                }

                // Service requests get higher score
                if ($lead->type === 'service_request') {
                    $score += 10;
                }

                return [
                    'id' => $lead->id,
                    'name' => $lead->name,
                    'type' => $lead->type,
                    'score' => min($score, 100),
                    'priority' => $score >= 80 ? 'high' : ($score >= 60 ? 'medium' : 'low'),
                ];
            })
            ->sortByDesc('score')
            ->values()
            ->take(5)
            ->toArray();

        return $leads;
    }

    protected function recommendProperties(): array
    {
        // Recommend properties based on performance
        $properties = Property::select('properties.*')
            ->leftJoin('bookings', 'properties.id', '=', 'bookings.property_id')
            ->selectRaw('properties.*, COUNT(bookings.id) as booking_count, COALESCE(SUM(bookings.total_price), 0) as total_revenue')
            ->where('properties.status', 'active')
            ->groupBy('properties.id')
            ->orderByDesc('total_revenue')
            ->orderByDesc('booking_count')
            ->limit(5)
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'title' => $property->getTranslation('title', 'en') ?? 'Unknown',
                    'booking_count' => $property->booking_count ?? 0,
                    'total_revenue' => $property->total_revenue ?? 0,
                    'recommendation' => $property->booking_count > 5 ? 'High Performance' : 'Moderate Performance',
                ];
            })
            ->toArray();

        return $properties;
    }

    protected function detectAnomalies(): array
    {
        $anomalies = [];

        // Check for sudden drop in bookings
        $todayBookings = Booking::whereDate('created_at', today())->count();
        $avgDailyBookings = Booking::whereBetween('created_at', [now()->subDays(7), now()])->count() / 7;

        if ($todayBookings < ($avgDailyBookings * 0.5) && $avgDailyBookings > 0) {
            $anomalies[] = [
                'type' => 'warning',
                'title' => 'Low Booking Activity',
                'message' => "Today's bookings ({$todayBookings}) are significantly below the 7-day average ({$avgDailyBookings}).",
            ];
        }

        // Check for properties with no bookings
        $propertiesWithoutBookings = Property::where('status', 'active')
            ->whereDoesntHave('bookings')
            ->where('created_at', '<', now()->subDays(30))
            ->count();

        if ($propertiesWithoutBookings > 5) {
            $anomalies[] = [
                'type' => 'info',
                'title' => 'Inactive Properties',
                'message' => "{$propertiesWithoutBookings} active properties have no bookings in the last 30 days. Consider reviewing their visibility.",
            ];
        }

        return $anomalies;
    }
}

