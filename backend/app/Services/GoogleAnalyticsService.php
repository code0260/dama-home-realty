<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class GoogleAnalyticsService
{
    protected string $propertyId;
    protected string $accessToken;

    public function __construct()
    {
        $this->propertyId = config('google-analytics.property_id');
        $this->accessToken = $this->getAccessToken();
    }

    /**
     * Get access token for Google Analytics API
     */
    protected function getAccessToken(): string
    {
        // In production, use OAuth2 service account credentials
        // For now, return from config
        return config('google-analytics.access_token', '');
    }

    /**
     * Get page views for a date range
     */
    public function getPageViews(string $startDate, string $endDate): array
    {
        $cacheKey = "ga_pageviews_{$startDate}_{$endDate}";
        
        return Cache::remember($cacheKey, 3600, function () use ($startDate, $endDate) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->accessToken,
                ])->get("https://analyticsdata.googleapis.com/v1beta/properties/{$this->propertyId}:runReport", [
                    'dateRanges' => [
                        ['startDate' => $startDate, 'endDate' => $endDate]
                    ],
                    'dimensions' => [
                        ['name' => 'date'],
                        ['name' => 'pagePath']
                    ],
                    'metrics' => [
                        ['name' => 'screenPageViews']
                    ],
                ]);

                if ($response->successful()) {
                    return $response->json();
                }

                Log::error('Google Analytics API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [];
            } catch (\Exception $e) {
                Log::error('Google Analytics Service error', [
                    'message' => $e->getMessage(),
                ]);

                return [];
            }
        });
    }

    /**
     * Get user behavior metrics
     */
    public function getUserBehavior(string $startDate, string $endDate): array
    {
        $cacheKey = "ga_userbehavior_{$startDate}_{$endDate}";
        
        return Cache::remember($cacheKey, 3600, function () use ($startDate, $endDate) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->accessToken,
                ])->get("https://analyticsdata.googleapis.com/v1beta/properties/{$this->propertyId}:runReport", [
                    'dateRanges' => [
                        ['startDate' => $startDate, 'endDate' => $endDate]
                    ],
                    'metrics' => [
                        ['name' => 'activeUsers'],
                        ['name' => 'newUsers'],
                        ['name' => 'sessions'],
                        ['name' => 'averageSessionDuration'],
                    ],
                ]);

                if ($response->successful()) {
                    return $response->json();
                }

                return [];
            } catch (\Exception $e) {
                Log::error('Google Analytics User Behavior error', [
                    'message' => $e->getMessage(),
                ]);

                return [];
            }
        });
    }

    /**
     * Get conversion events
     */
    public function getConversions(string $startDate, string $endDate): array
    {
        $cacheKey = "ga_conversions_{$startDate}_{$endDate}";
        
        return Cache::remember($cacheKey, 3600, function () use ($startDate, $endDate) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->accessToken,
                ])->get("https://analyticsdata.googleapis.com/v1beta/properties/{$this->propertyId}:runReport", [
                    'dateRanges' => [
                        ['startDate' => $startDate, 'endDate' => $endDate]
                    ],
                    'dimensions' => [
                        ['name' => 'eventName']
                    ],
                    'metrics' => [
                        ['name' => 'eventCount']
                    ],
                    'dimensionFilter' => [
                        'filter' => [
                            'fieldName' => 'eventName',
                            'stringFilter' => [
                                'matchType' => 'CONTAINS',
                                'value' => 'conversion',
                            ],
                        ],
                    ],
                ]);

                if ($response->successful()) {
                    return $response->json();
                }

                return [];
            } catch (\Exception $e) {
                Log::error('Google Analytics Conversions error', [
                    'message' => $e->getMessage(),
                ]);

                return [];
            }
        });
    }

    /**
     * Get traffic sources
     */
    public function getTrafficSources(string $startDate, string $endDate): array
    {
        $cacheKey = "ga_trafficsources_{$startDate}_{$endDate}";
        
        return Cache::remember($cacheKey, 3600, function () use ($startDate, $endDate) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->accessToken,
                ])->get("https://analyticsdata.googleapis.com/v1beta/properties/{$this->propertyId}:runReport", [
                    'dateRanges' => [
                        ['startDate' => $startDate, 'endDate' => $endDate]
                    ],
                    'dimensions' => [
                        ['name' => 'sessionSourceMedium']
                    ],
                    'metrics' => [
                        ['name' => 'sessions']
                    ],
                ]);

                if ($response->successful()) {
                    return $response->json();
                }

                return [];
            } catch (\Exception $e) {
                Log::error('Google Analytics Traffic Sources error', [
                    'message' => $e->getMessage(),
                ]);

                return [];
            }
        });
    }

    /**
     * Get a custom report with specified metrics
     */
    public function getReport(string $startDate, string $endDate, array $metrics = []): array
    {
        $cacheKey = "ga_report_" . md5("{$startDate}_{$endDate}_" . implode(',', $metrics));
        
        return Cache::remember($cacheKey, 3600, function () use ($startDate, $endDate, $metrics) {
            try {
                $metricsArray = array_map(function ($metric) {
                    return ['name' => $metric];
                }, $metrics);

                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $this->accessToken,
                ])->get("https://analyticsdata.googleapis.com/v1beta/properties/{$this->propertyId}:runReport", [
                    'dateRanges' => [
                        ['startDate' => $startDate, 'endDate' => $endDate]
                    ],
                    'metrics' => $metricsArray,
                ]);

                if ($response->successful()) {
                    return $response->json();
                }

                Log::error('Google Analytics Report API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [];
            } catch (\Exception $e) {
                Log::error('Google Analytics Report error', [
                    'message' => $e->getMessage(),
                ]);

                return [];
            }
        });
    }

    /**
     * Sync analytics data (to be called by scheduled job)
     */
    public function syncAnalyticsData(): void
    {
        $endDate = now()->format('Y-m-d');
        $startDate = now()->subDays(30)->format('Y-m-d');

        // Sync different metrics
        $this->getPageViews($startDate, $endDate);
        $this->getUserBehavior($startDate, $endDate);
        $this->getConversions($startDate, $endDate);
        $this->getTrafficSources($startDate, $endDate);
    }
}

