<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\HasApiResponse;
use App\Models\Booking;
use App\Models\Lead;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminAnalyticsController extends Controller
{
    use HasApiResponse;

    /**
     * Get analytics overview
     */
    public function overview(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
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
                ->avg('amount_paid') ?? 0;

            // Property performance
            $avgPropertyViews = Property::avg('views') ?? 0;
            $topPerformingProperty = Property::orderBy('views', 'desc')->first();

            return $this->successResponse([
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
                        'title' => $topPerformingProperty->getTranslation('title', 'en') ?? 
                                   $topPerformingProperty->getTranslation('title', 'ar') ?? 
                                   'Unknown',
                        'views' => $topPerformingProperty->views,
                    ] : null,
                ],
            ], 'Analytics overview retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminAnalyticsController@overview error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch analytics overview', 500);
        }
    }

    /**
     * Get properties analytics
     */
    public function properties(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $properties = Property::with(['neighborhood', 'agent'])
                ->withCount('bookings')
                ->orderBy('views', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($property) {
                    return [
                        'id' => $property->id,
                        'title' => $property->getTranslation('title', 'en') ?? 
                                   $property->getTranslation('title', 'ar') ?? 
                                   'Unknown',
                        'neighborhood' => $property->neighborhood ? 
                            (is_array($property->neighborhood->name) ? 
                                ($property->neighborhood->name['en'] ?? $property->neighborhood->name['ar'] ?? 'Unknown') : 
                                $property->neighborhood->name) : 'Unknown',
                        'views' => $property->views,
                        'bookings_count' => $property->bookings_count,
                        'price' => $property->price,
                        'status' => $property->status,
                    ];
                });

            return $this->successResponse([
                'top_properties' => $properties,
            ], 'Properties analytics retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminAnalyticsController@properties error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch properties analytics', 500);
        }
    }

    /**
     * Get bookings analytics
     */
    public function bookings(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $statusDistribution = Booking::select('booking_status', DB::raw('count(*) as count'))
                ->groupBy('booking_status')
                ->get()
                ->pluck('count', 'booking_status');

            $totalBookings = Booking::count();
            $cancellationRate = $totalBookings > 0 
                ? (Booking::where('booking_status', 'cancelled')->count() / $totalBookings) * 100 
                : 0;

            return $this->successResponse([
                'status_distribution' => $statusDistribution,
                'cancellation_rate' => round($cancellationRate, 2),
            ], 'Bookings analytics retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminAnalyticsController@bookings error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch bookings analytics', 500);
        }
    }

    /**
     * Get leads analytics
     */
    public function leads(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $funnel = [
                'new' => Lead::where('status', 'new')->count(),
                'contacted' => Lead::where('status', 'contacted')->count(),
                'qualified' => Lead::where('status', 'qualified')->count(),
                'closed' => Lead::where('status', 'closed')->count(),
            ];

            // Get source distribution if source column exists
            $sources = [];
            try {
                $sources = Lead::select('source', DB::raw('count(*) as count'))
                    ->whereNotNull('source')
                    ->groupBy('source')
                    ->get()
                    ->pluck('count', 'source');
            } catch (\Exception $e) {
                // Source column might not exist, ignore
            }

            return $this->successResponse([
                'funnel' => $funnel,
                'sources' => $sources,
            ], 'Leads analytics retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminAnalyticsController@leads error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch leads analytics', 500);
        }
    }

    /**
     * Get agents analytics
     */
    public function agents(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
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
                        'properties_count' => $agent->properties_count ?? 0,
                        'bookings_count' => $agent->bookings_count ?? 0,
                    ];
                });

            return $this->successResponse([
                'top_agents' => $agents,
            ], 'Agents analytics retrieved successfully');
        } catch (\Exception $e) {
            Log::error('AdminAnalyticsController@agents error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch agents analytics', 500);
        }
    }
}

