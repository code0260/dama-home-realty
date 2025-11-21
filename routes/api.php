<?php

use App\Http\Controllers\Api\AiConciergeController;
use App\Http\Controllers\Api\AiSearchController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\NeighborhoodController;
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
Route::post('/webhooks/stripe', [\App\Http\Controllers\WebhookController::class, 'handleWebhook'])
    ->middleware('web');
