<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Lead;
use App\Models\Property;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Generate revenue report
     */
    public function generateRevenueReport(Carbon $startDate, Carbon $endDate, array $filters = []): array
    {
        $query = Booking::whereBetween('created_at', [$startDate, $endDate])
            ->where('payment_status', 'paid');

        if (isset($filters['property_id'])) {
            $query->where('property_id', $filters['property_id']);
        }

        $totalRevenue = $query->sum('amount_paid');
        $bookingCount = $query->count();
        $averageBookingValue = $bookingCount > 0 ? $totalRevenue / $bookingCount : 0;

        // Daily breakdown
        $dailyBreakdown = $query->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(amount_paid) as revenue'),
            DB::raw('COUNT(*) as bookings')
        )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'period' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'summary' => [
                'total_revenue' => $totalRevenue,
                'booking_count' => $bookingCount,
                'average_booking_value' => $averageBookingValue,
            ],
            'daily_breakdown' => $dailyBreakdown,
        ];
    }

    /**
     * Generate leads report
     */
    public function generateLeadsReport(Carbon $startDate, Carbon $endDate, array $filters = []): array
    {
        $query = Lead::whereBetween('created_at', [$startDate, $endDate]);

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $totalLeads = $query->count();
        $convertedLeads = (clone $query)->where('status', 'closed')->count();
        $conversionRate = $totalLeads > 0 ? ($convertedLeads / $totalLeads) * 100 : 0;

        // By source
        $bySource = (clone $query)->select(
            'source',
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('source')
            ->get();

        // By type
        $byType = (clone $query)->select(
            'type',
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('type')
            ->get();

        return [
            'period' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'summary' => [
                'total_leads' => $totalLeads,
                'converted_leads' => $convertedLeads,
                'conversion_rate' => round($conversionRate, 2),
            ],
            'by_source' => $bySource,
            'by_type' => $byType,
        ];
    }

    /**
     * Generate properties report
     */
    public function generatePropertiesReport(array $filters = []): array
    {
        $query = Property::query();

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        $totalProperties = $query->count();
        $activeProperties = (clone $query)->where('status', 'active')->count();

        // By status
        $byStatus = Property::select(
            'status',
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('status')
            ->get();

        // By type
        $byType = Property::select(
            'type',
            DB::raw('COUNT(*) as count')
        )
            ->groupBy('type')
            ->get();

        // Top performing properties
        $topProperties = Property::withCount('bookings')
            ->withSum('bookings', 'total_price')
            ->orderByDesc('bookings_sum_total_price')
            ->limit(10)
            ->get();

        return [
            'summary' => [
                'total_properties' => $totalProperties,
                'active_properties' => $activeProperties,
            ],
            'by_status' => $byStatus,
            'by_type' => $byType,
            'top_properties' => $topProperties,
        ];
    }

    /**
     * Generate custom report
     */
    public function generateCustomReport(string $reportType, array $parameters = []): array
    {
        return match ($reportType) {
            'revenue' => $this->generateRevenueReport(
                $parameters['start_date'] ?? Carbon::now()->subMonth(),
                $parameters['end_date'] ?? Carbon::now(),
                $parameters['filters'] ?? []
            ),
            'leads' => $this->generateLeadsReport(
                $parameters['start_date'] ?? Carbon::now()->subMonth(),
                $parameters['end_date'] ?? Carbon::now(),
                $parameters['filters'] ?? []
            ),
            'properties' => $this->generatePropertiesReport($parameters['filters'] ?? []),
            default => [],
        };
    }
}

