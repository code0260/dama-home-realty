# 📋 تفاصيل تنفيذ لوحات التحكم - Dama Home Realty

**التاريخ**: 2025-01-XX  
**الحالة**: 📝 Implementation Details  
**الإصدار**: 1.0.0

---

## 📅 المرحلة 1: الأساسيات (Foundation) - تفاصيل التنفيذ

### ✅ 1.1 إنشاء API Endpoints للداشبورد

#### 1.1.1 AdminDashboardController

**الملف**: `backend/app/Http/Controllers/Api/AdminDashboardController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Lead;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    /**
     * Get overall dashboard statistics
     */
    public function getStats(Request $request)
    {
        $user = $request->user();

        // Check permissions
        if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();
        $lastMonthEnd = Carbon::now()->subMonth()->endOfMonth();

        // Revenue Stats
        $totalRevenue = Booking::where('payment_status', 'paid')
            ->sum('amount_paid');

        $thisMonthRevenue = Booking::where('payment_status', 'paid')
            ->where('created_at', '>=', $thisMonth)
            ->sum('amount_paid');

        $lastMonthRevenue = Booking::where('payment_status', 'paid')
            ->whereBetween('created_at', [$lastMonth, $lastMonthEnd])
            ->sum('amount_paid');

        $revenueGrowth = $lastMonthRevenue > 0
            ? (($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100
            : 0;

        // Properties Stats
        $totalProperties = Property::count();
        $activeProperties = Property::where('status', 'active')->count();
        $thisMonthProperties = Property::where('created_at', '>=', $thisMonth)->count();
        $lastMonthProperties = Property::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();

        $propertiesGrowth = $lastMonthProperties > 0
            ? (($thisMonthProperties - $lastMonthProperties) / $lastMonthProperties) * 100
            : 0;

        // Bookings Stats
        $totalBookings = Booking::count();
        $thisMonthBookings = Booking::where('created_at', '>=', $thisMonth)->count();
        $lastMonthBookings = Booking::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();

        $bookingsGrowth = $lastMonthBookings > 0
            ? (($thisMonthBookings - $lastMonthBookings) / $lastMonthBookings) * 100
            : 0;

        // Leads Stats
        $totalLeads = Lead::count();
        $newLeads = Lead::where('status', 'new')->count();
        $thisMonthLeads = Lead::where('created_at', '>=', $thisMonth)->count();
        $lastMonthLeads = Lead::whereBetween('created_at', [$lastMonth, $lastMonthEnd])->count();

        $leadsGrowth = $lastMonthLeads > 0
            ? (($thisMonthLeads - $lastMonthLeads) / $lastMonthLeads) * 100
            : 0;

        return response()->json([
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
        ]);
    }

    /**
     * Get revenue data for charts
     */
    public function getRevenue(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $period = $request->get('period', '12months'); // 7days, 30days, 3months, 6months, 12months, custom
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        $data = $this->calculateRevenueData($period, $startDate, $endDate);

        return response()->json($data);
    }

    /**
     * Get bookings data for charts
     */
    public function getBookings(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $period = $request->get('period', '12months');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        $data = $this->calculateBookingsData($period, $startDate, $endDate);

        return response()->json($data);
    }

    /**
     * Get leads data for charts
     */
    public function getLeads(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $period = $request->get('period', '12months');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        $data = $this->calculateLeadsData($period, $startDate, $endDate);

        return response()->json($data);
    }

    /**
     * Get properties data for charts
     */
    public function getProperties(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = [
            'by_status' => Property::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status'),
            'by_type' => Property::select('type', DB::raw('count(*) as count'))
                ->groupBy('type')
                ->get()
                ->pluck('count', 'type'),
            'by_neighborhood' => Property::with('neighborhood')
                ->select('neighborhood_id', DB::raw('count(*) as count'))
                ->groupBy('neighborhood_id')
                ->get()
                ->map(function ($item) {
                    return [
                        'neighborhood' => $item->neighborhood ? $item->neighborhood->name : 'Unknown',
                        'count' => $item->count,
                    ];
                }),
        ];

        return response()->json($data);
    }

    /**
     * Calculate revenue data based on period
     */
    private function calculateRevenueData($period, $startDate = null, $endDate = null)
    {
        $labels = [];
        $revenue = [];
        $bookingRevenue = [];
        $serviceRevenue = [];

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
```

#### 1.1.2 AdminAnalyticsController

**الملف**: `backend/app/Http/Controllers/Api/AdminAnalyticsController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Lead;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminAnalyticsController extends Controller
{
    /**
     * Get analytics overview
     */
    public function overview(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Conversion rates
        $totalLeads = Lead::count();
        $convertedLeads = Lead::where('status', 'closed')->count();
        $conversionRate = $totalLeads > 0 ? ($convertedLeads / $totalLeads) * 100 : 0;

        // Booking conversion
        $totalBookings = Booking::count();
        $confirmedBookings = Booking::where('booking_status', 'confirmed')->count();
        $bookingConversionRate = $totalBookings > 0 ? ($confirmedBookings / $totalBookings) * 100 : 0;

        // Average booking value
        $avgBookingValue = Booking::where('payment_status', 'paid')
            ->avg('amount_paid');

        // Property performance
        $avgPropertyViews = Property::avg('views') ?? 0;
        $topPerformingProperty = Property::orderBy('views', 'desc')->first();

        return response()->json([
            'conversion_rates' => [
                'leads_to_bookings' => round($conversionRate, 2),
                'bookings_confirmed' => round($bookingConversionRate, 2),
            ],
            'average_values' => [
                'booking_value' => round($avgBookingValue, 2),
                'property_views' => round($avgPropertyViews, 2),
            ],
            'top_performers' => [
                'property' => $topPerformingProperty ? [
                    'id' => $topPerformingProperty->id,
                    'title' => $topPerformingProperty->getTranslation('title', 'en'),
                    'views' => $topPerformingProperty->views,
                ] : null,
            ],
        ]);
    }

    /**
     * Get properties analytics
     */
    public function properties(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $properties = Property::with(['neighborhood', 'agent'])
            ->withCount('bookings')
            ->orderBy('views', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($property) {
                return [
                    'id' => $property->id,
                    'title' => $property->getTranslation('title', 'en'),
                    'neighborhood' => $property->neighborhood ? $property->neighborhood->name : 'Unknown',
                    'views' => $property->views,
                    'bookings_count' => $property->bookings_count,
                    'price' => $property->price,
                    'status' => $property->status,
                ];
            });

        return response()->json([
            'top_properties' => $properties,
        ]);
    }

    /**
     * Get bookings analytics
     */
    public function bookings(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $statusDistribution = Booking::select('booking_status', DB::raw('count(*) as count'))
            ->groupBy('booking_status')
            ->get()
            ->pluck('count', 'booking_status');

        $cancellationRate = Booking::where('booking_status', 'cancelled')->count() / Booking::count() * 100;

        return response()->json([
            'status_distribution' => $statusDistribution,
            'cancellation_rate' => round($cancellationRate, 2),
        ]);
    }

    /**
     * Get leads analytics
     */
    public function leads(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $funnel = [
            'new' => Lead::where('status', 'new')->count(),
            'contacted' => Lead::where('status', 'contacted')->count(),
            'qualified' => Lead::where('status', 'qualified')->count(),
            'closed' => Lead::where('status', 'closed')->count(),
        ];

        $sources = Lead::select('source', DB::raw('count(*) as count'))
            ->groupBy('source')
            ->get()
            ->pluck('count', 'source');

        return response()->json([
            'funnel' => $funnel,
            'sources' => $sources,
        ]);
    }

    /**
     * Get agents analytics
     */
    public function agents(Request $request)
    {
        $user = $request->user();

        if (!$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $agents = User::role('Agent')
            ->withCount(['properties', 'bookings'])
            ->orderBy('properties_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($agent) {
                return [
                    'id' => $agent->id,
                    'name' => $agent->name,
                    'properties_count' => $agent->properties_count,
                    'bookings_count' => $agent->bookings_count,
                ];
            });

        return response()->json([
            'top_agents' => $agents,
        ]);
    }
}
```

#### 1.1.3 NotificationController

**الملف**: `backend/app/Http/Controllers/Api/NotificationController.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    /**
     * Get user notifications
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->latest()
            ->paginate(20);

        return response()->json($notifications);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();

        $notification = $user->notifications()->find($id);

        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json(['success' => true]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();

        $user->unreadNotifications->markAsRead();

        return response()->json(['success' => true]);
    }
}
```

#### 1.1.4 تحديث Routes

**الملف**: `backend/routes/api.php`

```php
// Add after existing routes

// Admin Dashboard Routes (require authentication and admin role)
Route::prefix('admin')->middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // Dashboard Stats
    Route::get('/dashboard/stats', [App\Http\Controllers\Api\AdminDashboardController::class, 'getStats']);
    Route::get('/dashboard/revenue', [App\Http\Controllers\Api\AdminDashboardController::class, 'getRevenue']);
    Route::get('/dashboard/bookings', [App\Http\Controllers\Api\AdminDashboardController::class, 'getBookings']);
    Route::get('/dashboard/leads', [App\Http\Controllers\Api\AdminDashboardController::class, 'getLeads']);
    Route::get('/dashboard/properties', [App\Http\Controllers\Api\AdminDashboardController::class, 'getProperties']);

    // Analytics
    Route::get('/analytics/overview', [App\Http\Controllers\Api\AdminAnalyticsController::class, 'overview']);
    Route::get('/analytics/properties', [App\Http\Controllers\Api\AdminAnalyticsController::class, 'properties']);
    Route::get('/analytics/bookings', [App\Http\Controllers\Api\AdminAnalyticsController::class, 'bookings']);
    Route::get('/analytics/leads', [App\Http\Controllers\Api\AdminAnalyticsController::class, 'leads']);
    Route::get('/analytics/agents', [App\Http\Controllers\Api\AdminAnalyticsController::class, 'agents']);

    // Notifications
    Route::get('/dashboard/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/dashboard/notifications/{id}/read', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::post('/dashboard/notifications/read-all', [App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
});
```

---

### ✅ 1.2 إنشاء KPI Cards Widgets في Filament

#### 1.2.1 StatsOverview Widget

**الملف**: `backend/app/Filament/Widgets/StatsOverview.php`

```php
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
                ->description($revenueGrowth >= 0 ? '+' : '')
                    . number_format(abs($revenueGrowth), 1) . '% from last month')
                ->descriptionIcon($revenueGrowth >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenueGrowth >= 0 ? 'success' : 'danger')
                ->chart([7, 3, 4, 5, 6, 3, 5])
                ->icon('heroicon-o-currency-dollar'),

            Stat::make('Properties', $totalProperties)
                ->description($activeProperties . ' active')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('info')
                ->chart([3, 2, 4, 5, 3, 4, 6])
                ->icon('heroicon-o-home-modern'),

            Stat::make('Bookings', $totalBookings)
                ->description($thisMonthBookings . ' this month')
                ->descriptionIcon($bookingsGrowth >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($bookingsGrowth >= 0 ? 'success' : 'warning')
                ->chart([2, 3, 4, 5, 4, 3, 5])
                ->icon('heroicon-o-calendar'),

            Stat::make('Leads', $totalLeads)
                ->description($newLeads . ' new')
                ->descriptionIcon($leadsGrowth >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($leadsGrowth >= 0 ? 'success' : 'warning')
                ->chart([4, 3, 5, 6, 5, 4, 6])
                ->icon('heroicon-o-user-group'),
        ];
    }

    protected function getPollingInterval(): ?string
    {
        return '30s'; // Poll every 30 seconds for real-time updates
    }
}
```

#### 1.2.2 تحديث AdminPanelProvider

**الملف**: `backend/app/Providers/Filament/AdminPanelProvider.php`

```php
// Update widgets array:
->widgets([
    Widgets\AccountWidget::class,
    \App\Filament\Widgets\StatsOverview::class, // Add this
    \App\Filament\Widgets\RevenueChart::class,
    \App\Filament\Widgets\BookingsChart::class,
    \App\Filament\Widgets\PopularNeighborhoods::class,
    \App\Filament\Widgets\LatestLeads::class,
])
```

---

### ✅ 1.3 إنشاء Database Tables للـ Analytics

#### 1.3.1 Analytics Events Migration

**الملف**: `backend/database/migrations/xxxx_create_analytics_events_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_type'); // page_view, property_view, booking_created, etc.
            $table->string('event_name');
            $table->morphs('eventable'); // polymorphic relation
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->json('properties')->nullable(); // Additional event data
            $table->string('session_id')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referrer')->nullable();
            $table->timestamps();

            $table->index(['event_type', 'created_at']);
            $table->index('user_id');
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
```

#### 1.3.2 Analytics Sessions Migration

**الملف**: `backend/database/migrations/xxxx_create_analytics_sessions_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->ipAddress('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referrer')->nullable();
            $table->timestamp('started_at');
            $table->timestamp('ended_at')->nullable();
            $table->integer('duration')->nullable(); // in seconds
            $table->integer('page_views')->default(0);
            $table->json('properties')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'started_at']);
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_sessions');
    }
};
```

#### 1.3.3 Analytics Conversions Migration

**الملف**: `backend/database/migrations/xxxx_create_analytics_conversions_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_conversions', function (Blueprint $table) {
            $table->id();
            $table->string('conversion_type'); // lead, booking, service_request, etc.
            $table->morphs('convertible'); // polymorphic relation
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('session_id')->nullable();
            $table->string('source')->nullable(); // website, social_media, referral, etc.
            $table->string('medium')->nullable(); // organic, paid, email, etc.
            $table->string('campaign')->nullable();
            $table->decimal('value', 10, 2)->nullable();
            $table->json('properties')->nullable();
            $table->timestamps();

            $table->index(['conversion_type', 'created_at']);
            $table->index('user_id');
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_conversions');
    }
};
```

#### 1.3.4 إنشاء Models

**الملف**: `backend/app/Models/AnalyticsEvent.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsEvent extends Model
{
    protected $fillable = [
        'event_type',
        'event_name',
        'eventable_type',
        'eventable_id',
        'user_id',
        'properties',
        'session_id',
        'ip_address',
        'user_agent',
        'referrer',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function eventable(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**الملف**: `backend/app/Models/AnalyticsSession.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsSession extends Model
{
    protected $fillable = [
        'session_id',
        'user_id',
        'ip_address',
        'user_agent',
        'referrer',
        'started_at',
        'ended_at',
        'duration',
        'page_views',
        'properties',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'properties' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

**الملف**: `backend/app/Models/AnalyticsConversion.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsConversion extends Model
{
    protected $fillable = [
        'conversion_type',
        'convertible_type',
        'convertible_id',
        'user_id',
        'session_id',
        'source',
        'medium',
        'campaign',
        'value',
        'properties',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'properties' => 'array',
    ];

    public function convertible(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

---

## 📝 ملاحظات التنفيذ

### الخطوات التالية:

1. ✅ إنشاء Controllers
2. ✅ إضافة Routes
3. ✅ إنشاء Widgets
4. ✅ إنشاء Migrations
5. ✅ إنشاء Models
6. ⏭️ اختبار API Endpoints
7. ⏭️ اختبار Widgets في Filament
8. ⏭️ إضافة Error Handling
9. ⏭️ إضافة Caching

### الاختبار:

-   استخدام Postman أو Insomnia لاختبار API endpoints
-   التحقق من Widgets في Filament Admin Panel
-   التحقق من Permissions والـ Authorization

---

**هذا الجزء يغطي المرحلة 1 بالكامل. المراحل التالية ستكون في ملفات منفصلة أو تحديثات لهذا الملف.**
