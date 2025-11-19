<?php

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

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/my-services', [LeadController::class, 'myServices']);
});

// Property routes
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{identifier}', [PropertyController::class, 'show']);
Route::get('/properties/{identifier}/availability', [PropertyController::class, 'availability']);

// Neighborhood routes
Route::get('/neighborhoods', [NeighborhoodController::class, 'index']);
Route::get('/neighborhoods/{slug}', [NeighborhoodController::class, 'show']);

// Service routes
Route::get('/services', [ServiceController::class, 'index']);

// Testimonial routes
Route::get('/testimonials', [TestimonialController::class, 'index']);

// Contact route
Route::post('/contact', [ContactController::class, 'store']);

// Lead routes (for list your property)
Route::post('/leads', [LeadController::class, 'store']);

// Booking routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::put('/bookings/{id}', [BookingController::class, 'update']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);

    // Payment routes
    Route::post('/bookings/{id}/checkout', [PaymentController::class, 'createCheckoutSession']);
    Route::get('/bookings/{id}/payment/verify', [PaymentController::class, 'verifyPayment']);
});

// Webhook route (no authentication required, uses Stripe signature verification)
Route::post('/webhooks/stripe', [\App\Http\Controllers\WebhookController::class, 'handleWebhook'])
    ->middleware('web');
