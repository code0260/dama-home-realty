<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\HasApiResponse;
use App\Services\GoogleAnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GoogleAnalyticsController extends Controller
{
    use HasApiResponse;
    
    protected GoogleAnalyticsService $analyticsService;

    public function __construct(GoogleAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    /**
     * Get overview analytics
     */
    public function overview(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->input('end_date', now()->format('Y-m-d'));

            $pageViews = $this->analyticsService->getPageViews($startDate, $endDate);
            $userBehavior = $this->analyticsService->getUserBehavior($startDate, $endDate);
            $conversions = $this->analyticsService->getConversions($startDate, $endDate);
            $trafficSources = $this->analyticsService->getTrafficSources($startDate, $endDate);

            return $this->successResponse([
                'page_views' => $pageViews,
                'user_behavior' => $userBehavior,
                'conversions' => $conversions,
                'traffic_sources' => $trafficSources,
                'date_range' => [
                    'start' => $startDate,
                    'end' => $endDate,
                ],
            ], 'Analytics overview retrieved successfully');
        } catch (\Exception $e) {
            Log::error('GoogleAnalyticsController@overview error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse('Failed to fetch analytics overview', 500);
        }
    }

    /**
     * Get page views data
     */
    public function pageViews(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->input('end_date', now()->format('Y-m-d'));

            $data = $this->analyticsService->getPageViews($startDate, $endDate);

            return $this->successResponse($data, 'Page views retrieved successfully');
        } catch (\Exception $e) {
            Log::error('GoogleAnalyticsController@pageViews error: ' . $e->getMessage());

            return $this->errorResponse('Failed to fetch page views', 500);
        }
    }

    /**
     * Get user behavior data
     */
    public function userBehavior(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->input('end_date', now()->format('Y-m-d'));

            $data = $this->analyticsService->getUserBehavior($startDate, $endDate);

            return $this->successResponse($data, 'User behavior retrieved successfully');
        } catch (\Exception $e) {
            Log::error('GoogleAnalyticsController@userBehavior error: ' . $e->getMessage());

            return $this->errorResponse('Failed to fetch user behavior', 500);
        }
    }

    /**
     * Get conversions data
     */
    public function conversions(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->input('end_date', now()->format('Y-m-d'));

            $data = $this->analyticsService->getConversions($startDate, $endDate);

            return $this->successResponse($data, 'Conversions retrieved successfully');
        } catch (\Exception $e) {
            Log::error('GoogleAnalyticsController@conversions error: ' . $e->getMessage());

            return $this->errorResponse('Failed to fetch conversions', 500);
        }
    }

    /**
     * Get traffic sources data
     */
    public function trafficSources(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user || !$user->hasAnyRole(['Super Admin', 'Admin', 'Manager'])) {
                return $this->forbiddenResponse('Unauthorized');
            }

            $startDate = $request->input('start_date', now()->subDays(30)->format('Y-m-d'));
            $endDate = $request->input('end_date', now()->format('Y-m-d'));

            $data = $this->analyticsService->getTrafficSources($startDate, $endDate);

            return $this->successResponse($data, 'Traffic sources retrieved successfully');
        } catch (\Exception $e) {
            Log::error('GoogleAnalyticsController@trafficSources error: ' . $e->getMessage());

            return $this->errorResponse('Failed to fetch traffic sources', 500);
        }
    }
}

