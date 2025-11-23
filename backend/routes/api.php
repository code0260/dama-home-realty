<?php

use App\Http\Controllers\Api\AdminAnalyticsController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\AiConciergeController;
use App\Http\Controllers\Api\AiSearchController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\NeighborhoodController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes (Rate limit: 10 requests per minute)
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Authenticated routes (Rate limit: 60 requests per minute)
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/my-services', [LeadController::class, 'myServices']);
});

// Property routes (Rate limit: 60 requests per minute)
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/properties', [PropertyController::class, 'index']);
    Route::get('/properties/{identifier}', [PropertyController::class, 'show']);
    Route::get('/properties/{identifier}/availability', [PropertyController::class, 'availability']);
});

// Property creation/update routes (require authentication, Rate limit: 10 requests per minute - prevent spam)
Route::middleware(['auth:sanctum', 'throttle:10,1'])->group(function () {
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::patch('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
});

// AI routes (Rate limit: 20 requests per minute - more expensive)
Route::middleware('throttle:20,1')->group(function () {
    Route::post('/ai-search', [AiSearchController::class, 'search']);
    Route::post('/ai-concierge/chat', [AiConciergeController::class, 'chat']);
});

// Public read routes (Rate limit: 60 requests per minute)
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/neighborhoods', [NeighborhoodController::class, 'index']);
    Route::get('/neighborhoods/{slug}', [NeighborhoodController::class, 'show']);
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/agents', [AgentController::class, 'index']);
    Route::get('/testimonials', [TestimonialController::class, 'index']);
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{slug}', [ArticleController::class, 'show']);
});

// Contact & Lead routes (Rate limit: 10 requests per minute - prevent spam)
Route::middleware('throttle:10,1')->group(function () {
    Route::post('/contact', [ContactController::class, 'store']);
    Route::post('/leads', [LeadController::class, 'store']);
});

// Booking routes (require authentication, Rate limit: 30 requests per minute)
Route::middleware(['auth:sanctum', 'throttle:30,1'])->group(function () {
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::put('/bookings/{id}', [BookingController::class, 'update']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);

    // Payment routes (Rate limit: 20 requests per minute)
    Route::middleware('throttle:20,1')->group(function () {
        Route::post('/bookings/{id}/checkout', [PaymentController::class, 'createCheckoutSession']);
        Route::get('/bookings/{id}/payment/verify', [PaymentController::class, 'verifyPayment']);
    });
});

// Webhook route (no authentication required, uses Stripe signature verification)
// Rate limit: 100 requests per minute (Stripe may send multiple webhooks)
Route::post('/webhooks/stripe', [\App\Http\Controllers\WebhookController::class, 'handleWebhook'])
    ->middleware(['web', 'throttle:100,1']);

// Admin Dashboard Routes (require authentication and admin role)
// Rate limit: 60 requests per minute + custom rate limiting
Route::prefix('admin')->middleware(['auth:sanctum', 'throttle:60,1', \App\Http\Middleware\RateLimitDashboard::class])->group(function () {
    // Dashboard Stats
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'getStats']);
    Route::get('/dashboard/revenue', [AdminDashboardController::class, 'getRevenue']);
    Route::get('/dashboard/bookings', [AdminDashboardController::class, 'getBookings']);
    Route::get('/dashboard/leads', [AdminDashboardController::class, 'getLeads']);
    Route::get('/dashboard/properties', [AdminDashboardController::class, 'getProperties']);
    Route::get('/dashboard/properties/map-data', [AdminDashboardController::class, 'getPropertiesMapData']);
    
    // Analytics
    Route::get('/analytics/overview', [AdminAnalyticsController::class, 'overview']);
    Route::get('/analytics/properties', [AdminAnalyticsController::class, 'properties']);
    Route::get('/analytics/bookings', [AdminAnalyticsController::class, 'bookings']);
    Route::get('/analytics/leads', [AdminAnalyticsController::class, 'leads']);
    Route::get('/analytics/agents', [AdminAnalyticsController::class, 'agents']);
    
    // Google Analytics
    Route::get('/google-analytics/overview', [\App\Http\Controllers\Api\GoogleAnalyticsController::class, 'overview']);
    Route::get('/google-analytics/page-views', [\App\Http\Controllers\Api\GoogleAnalyticsController::class, 'pageViews']);
    Route::get('/google-analytics/user-behavior', [\App\Http\Controllers\Api\GoogleAnalyticsController::class, 'userBehavior']);
    Route::get('/google-analytics/conversions', [\App\Http\Controllers\Api\GoogleAnalyticsController::class, 'conversions']);
    Route::get('/google-analytics/traffic-sources', [\App\Http\Controllers\Api\GoogleAnalyticsController::class, 'trafficSources']);
    
    // Notifications
    Route::get('/dashboard/notifications', [NotificationController::class, 'index']);
    Route::post('/dashboard/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/dashboard/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    
    // Export & Reports
    Route::post('/export/report', [ExportController::class, 'export']);
});
