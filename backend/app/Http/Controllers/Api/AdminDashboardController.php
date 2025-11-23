<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\HasApiResponse;
use App\Models\Booking;
use App\Models\Lead;
use App\Models\Property;
use App\Services\CacheService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    use HasApiResponse;

    protected CacheService $cacheService;

    public function __construct(CacheService $cacheService)
    {
        $this->cacheService = $cacheService;
    }

    /**
     * Get overall dashboard statistics
     */
    public function getStats(Request $request)
    {
        try {
            $user = $request->user();
            
            // Check permissions
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized. Only admins can access this resource.');
            }

            // Cache for 5 minutes (300 seconds)
            $cacheKey = 'dashboard_stats_' . $user->id;
            $stats = Cache::remember($cacheKey, 300, function () {
                $today = Carbon::today();
                $thisMonth = Carbon::now()->startOfMonth();
                $lastMonth = Carbon::now()->subMonth()->startOfMonth();
                $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();

                // Revenue Stats - Optimized with single query
                $revenueData = DB::table('bookings')
                    ->selectRaw('
                        SUM(CASE WHEN payment_status = "paid" THEN amount_paid ELSE 0 END) as total_revenue,
                        SUM(CASE WHEN payment_status = "paid" AND created_at >= ? THEN amount_paid ELSE 0 END) as this_month_revenue,
                        SUM(CASE WHEN payment_status = "paid" AND created_at >= ? AND created_at <= ? THEN amount_paid ELSE 0 END) as last_month_revenue
                    ')
                    ->setBindings([$thisMonth, $lastMonth, $lastMonthEnd])
                    ->first();

                $totalRevenue = $revenueData->total_revenue ?? 0;
                $thisMonthRevenue = $revenueData->this_month_revenue ?? 0;
                $lastMonthRevenue = $revenueData->last_month_revenue ?? 0;
                
                $revenueGrowth = $lastMonthRevenue > 0 
                    ? (($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 
                    : 0;

                // Properties Stats - Optimized
                $propertiesData = DB::table('properties')
                    ->selectRaw('
                        COUNT(*) as total,
                        SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active,
                        SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as this_month,
                        SUM(CASE WHEN created_at >= ? AND created_at <= ? THEN 1 ELSE 0 END) as last_month
                    ')
                    ->setBindings([$thisMonth, $lastMonth, $lastMonthEnd])
                    ->first();

                $totalProperties = $propertiesData->total ?? 0;
                $activeProperties = $propertiesData->active ?? 0;
                $thisMonthProperties = $propertiesData->this_month ?? 0;
                $lastMonthProperties = $propertiesData->last_month ?? 0;
                
                $propertiesGrowth = $lastMonthProperties > 0 
                    ? (($thisMonthProperties - $lastMonthProperties) / $lastMonthProperties) * 100 
                    : 0;

                // Bookings Stats - Optimized
                $bookingsData = DB::table('bookings')
                    ->selectRaw('
                        COUNT(*) as total,
                        SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as this_month,
                        SUM(CASE WHEN created_at >= ? AND created_at <= ? THEN 1 ELSE 0 END) as last_month
                    ')
                    ->setBindings([$thisMonth, $lastMonth, $lastMonthEnd])
                    ->first();

                $totalBookings = $bookingsData->total ?? 0;
                $thisMonthBookings = $bookingsData->this_month ?? 0;
                $lastMonthBookings = $bookingsData->last_month ?? 0;
                
                $bookingsGrowth = $lastMonthBookings > 0 
                    ? (($thisMonthBookings - $lastMonthBookings) / $lastMonthBookings) * 100 
                    : 0;

                // Leads Stats - Optimized
                $leadsData = DB::table('leads')
                    ->selectRaw('
                        COUNT(*) as total,
                        SUM(CASE WHEN status = "new" THEN 1 ELSE 0 END) as new,
                        SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as this_month,
                        SUM(CASE WHEN created_at >= ? AND created_at <= ? THEN 1 ELSE 0 END) as last_month
                    ')
                    ->setBindings([$thisMonth, $lastMonth, $lastMonthEnd])
                    ->first();

                $totalLeads = $leadsData->total ?? 0;
                $newLeads = $leadsData->new ?? 0;
                $thisMonthLeads = $leadsData->this_month ?? 0;
                $lastMonthLeads = $leadsData->last_month ?? 0;
                
                $leadsGrowth = $lastMonthLeads > 0 
                    ? (($thisMonthLeads - $lastMonthLeads) / $lastMonthLeads) * 100 
                    : 0;

                return [
                    'revenue' => [
                        'total' => round($totalRevenue, 2),
                        'this_month' => round($thisMonthRevenue, 2),
                        'growth' => round($revenueGrowth, 2),
                        'trend' => $revenueGrowth >= 0 ? 'up' : 'down',
                    ],
                    'properties' => [
                        'total' => $totalProperties,
                        'active' => $activeProperties,
                        'this_month' => $thisMonthProperties,
                        'growth' => round($propertiesGrowth, 2),
                        'trend' => $propertiesGrowth >= 0 ? 'up' : 'down',
                    ],
                    'bookings' => [
                        'total' => $totalBookings,
                        'this_month' => $thisMonthBookings,
                        'growth' => round($bookingsGrowth, 2),
                        'trend' => $bookingsGrowth >= 0 ? 'up' : 'down',
                    ],
                    'leads' => [
                        'total' => $totalLeads,
                        'new' => $newLeads,
                        'this_month' => $thisMonthLeads,
                        'growth' => round($leadsGrowth, 2),
                        'trend' => $leadsGrowth >= 0 ? 'up' : 'down',
                    ],
                ];
            });

            return $this->successResponse($stats, 'Dashboard statistics retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminDashboardController@getStats error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch dashboard statistics', 500);
        }
    }

    /**
     * Get revenue data for charts
     */
    public function getRevenue(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $period = $request->get('period', '12months'); // 7days, 30days, 3months, 6months, 12months, custom
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');

            // Cache revenue data for 10 minutes
            $cacheKey = 'dashboard_revenue_' . $period . '_' . ($startDate ?? '') . '_' . ($endDate ?? '');
            $data = Cache::remember($cacheKey, 600, function () use ($period, $startDate, $endDate) {
                return $this->calculateRevenueData($period, $startDate, $endDate);
            });

            return $this->successResponse($data, 'Revenue data retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminDashboardController@getRevenue error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch revenue data', 500);
        }
    }

    /**
     * Get bookings data for charts
     */
    public function getBookings(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $period = $request->get('period', '12months');
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');

            // Cache bookings data for 10 minutes
            $cacheKey = 'dashboard_bookings_' . $period . '_' . ($startDate ?? '') . '_' . ($endDate ?? '');
            $data = Cache::remember($cacheKey, 600, function () use ($period, $startDate, $endDate) {
                return $this->calculateBookingsData($period, $startDate, $endDate);
            });

            return $this->successResponse($data, 'Bookings data retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminDashboardController@getBookings error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch bookings data', 500);
        }
    }

    /**
     * Get leads data for charts
     */
    public function getLeads(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $period = $request->get('period', '12months');
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');

            // Cache leads data for 10 minutes
            $cacheKey = 'dashboard_leads_' . $period . '_' . ($startDate ?? '') . '_' . ($endDate ?? '');
            $data = Cache::remember($cacheKey, 600, function () use ($period, $startDate, $endDate) {
                return $this->calculateLeadsData($period, $startDate, $endDate);
            });

            return $this->successResponse($data, 'Leads data retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminDashboardController@getLeads error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch leads data', 500);
        }
    }

    /**
     * Get properties data for charts
     */
    public function getProperties(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            // Cache properties data for 15 minutes
            $data = Cache::remember('dashboard_properties_stats', 900, function () {
                return [
                    'by_status' => Property::select('status', DB::raw('count(*) as count'))
                        ->groupBy('status')
                        ->get()
                        ->pluck('count', 'status'),
                    'by_type' => Property::select('type', DB::raw('count(*) as count'))
                        ->groupBy('type')
                        ->get()
                        ->pluck('count', 'type'),
                    'by_neighborhood' => Property::with('neighborhood:id,name')
                        ->select('neighborhood_id', DB::raw('count(*) as count'))
                        ->groupBy('neighborhood_id')
                        ->get()
                        ->map(function ($item) {
                            return [
                                'neighborhood' => $item->neighborhood ? 
                                    (is_array($item->neighborhood->name) ? 
                                        ($item->neighborhood->name['en'] ?? $item->neighborhood->name['ar'] ?? 'Unknown') : 
                                        $item->neighborhood->name) : 'Unknown',
                                'count' => $item->count,
                            ];
                        }),
                ];
            });

            return $this->successResponse($data, 'Properties data retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminDashboardController@getProperties error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch properties data', 500);
        }
    }

    /**
     * Get properties map data for Google Maps
     */
    public function getPropertiesMapData(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            // Cache map data for 30 minutes
            $data = Cache::remember('dashboard_properties_map', 1800, function () {
                $properties = Property::with('neighborhood:id,name')
                    ->select('id', 'title', 'latitude', 'longitude', 'type', 'status', 'price', 'neighborhood_id')
                    ->whereNotNull('latitude')
                    ->whereNotNull('longitude')
                    ->get()
                    ->map(function ($property) {
                        return [
                            'id' => $property->id,
                            'title' => $property->getTranslation('title', 'en') ?? 
                                       $property->getTranslation('title', 'ar') ?? 
                                       'Unknown',
                            'latitude' => (float) $property->latitude,
                            'longitude' => (float) $property->longitude,
                            'type' => $property->type,
                            'status' => $property->status,
                            'price' => $property->price,
                            'neighborhood' => $property->neighborhood ? 
                                (is_array($property->neighborhood->name) ? 
                                    ($property->neighborhood->name['en'] ?? $property->neighborhood->name['ar'] ?? 'Unknown') : 
                                    $property->neighborhood->name) : 'Unknown',
                        ];
                    });

                return [
                    'properties' => $properties,
                    'total' => $properties->count(),
                ];
            });

            return $this->successResponse($data, 'Properties map data retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminDashboardController@getPropertiesMapData error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch properties map data', 500);
        }
    }

    /**
     * Calculate revenue data based on period
     */
    private function calculateRevenueData($period, $startDate = null, $endDate = null)
    {
        $labels = [];
        $revenue = [];
        $bookingRevenue = [];

        switch ($period) {
            case '7days':
                for ($i = 6; $i >= 0; $i--) {
                    $date = Carbon::now()->subDays($i);
                    $labels[] = $date->format('M d');
                    
                    $dayRevenue = Booking::where('payment_status', 'paid')
                        ->whereDate('created_at', $date)
                        ->sum('amount_paid');
                    $revenue[] = (float) $dayRevenue;
                    
                    $dayBookingRevenue = Booking::where('payment_status', 'paid')
                        ->whereDate('created_at', $date)
                        ->whereHas('property', function ($q) {
                            $q->where('type', 'hotel');
                        })
                        ->sum('amount_paid');
                    $bookingRevenue[] = (float) $dayBookingRevenue;
                }
                break;
                
            case '30days':
                for ($i = 29; $i >= 0; $i--) {
                    $date = Carbon::now()->subDays($i);
                    $labels[] = $date->format('M d');
                    
                    $dayRevenue = Booking::where('payment_status', 'paid')
                        ->whereDate('created_at', $date)
                        ->sum('amount_paid');
                    $revenue[] = (float) $dayRevenue;
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
                    $revenue[] = (float) $monthRevenue;
                }
                break;
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Total Revenue',
                    'data' => $revenue,
                    'borderColor' => '#B49162', // Bronze
                    'backgroundColor' => 'rgba(180, 145, 98, 0.1)',
                ],
                [
                    'label' => 'Booking Revenue',
                    'data' => $bookingRevenue,
                    'borderColor' => '#0F172A', // Navy Blue
                    'backgroundColor' => 'rgba(15, 23, 42, 0.1)',
                ],
            ],
        ];
    }

    /**
     * Calculate bookings data based on period
     */
    private function calculateBookingsData($period, $startDate = null, $endDate = null)
    {
        $labels = [];
        $bookings = [];

        switch ($period) {
            case '7days':
                for ($i = 6; $i >= 0; $i--) {
                    $date = Carbon::now()->subDays($i);
                    $labels[] = $date->format('M d');
                    
                    $dayBookings = Booking::whereDate('created_at', $date)->count();
                    $bookings[] = $dayBookings;
                }
                break;
                
            case '12months':
            default:
                for ($i = 11; $i >= 0; $i--) {
                    $date = Carbon::now()->subMonths($i);
                    $labels[] = $date->format('M Y');
                    
                    $monthBookings = Booking::whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->count();
                    $bookings[] = $monthBookings;
                }
                break;
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Bookings',
                    'data' => $bookings,
                    'backgroundColor' => 'rgba(15, 23, 42, 0.7)',
                    'borderColor' => '#0F172A',
                ],
            ],
        ];
    }

    /**
     * Calculate leads data based on period
     */
    private function calculateLeadsData($period, $startDate = null, $endDate = null)
    {
        $labels = [];
        $leads = [];

        switch ($period) {
            case '7days':
                for ($i = 6; $i >= 0; $i--) {
                    $date = Carbon::now()->subDays($i);
                    $labels[] = $date->format('M d');
                    
                    $dayLeads = Lead::whereDate('created_at', $date)->count();
                    $leads[] = $dayLeads;
                }
                break;
                
            case '12months':
            default:
                for ($i = 11; $i >= 0; $i--) {
                    $date = Carbon::now()->subMonths($i);
                    $labels[] = $date->format('M Y');
                    
                    $monthLeads = Lead::whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->count();
                    $leads[] = $monthLeads;
                }
                break;
        }

        return [
            'labels' => $labels,
            'datasets' => [
                [
                    'label' => 'Leads',
                    'data' => $leads,
                    'backgroundColor' => 'rgba(180, 145, 98, 0.7)',
                    'borderColor' => '#B49162',
                ],
            ],
        ];
    }
}

