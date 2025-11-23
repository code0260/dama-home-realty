<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Google Analytics Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Google Analytics API integration
    |
    */

    'property_id' => env('GOOGLE_ANALYTICS_PROPERTY_ID', ''),

    'access_token' => env('GOOGLE_ANALYTICS_ACCESS_TOKEN', ''),

    'service_account_path' => env('GOOGLE_ANALYTICS_SERVICE_ACCOUNT_PATH', storage_path('app/google-analytics-service-account.json')),

    'cache_duration' => env('GOOGLE_ANALYTICS_CACHE_DURATION', 3600), // 1 hour

    'enabled' => env('GOOGLE_ANALYTICS_ENABLED', false),
];

