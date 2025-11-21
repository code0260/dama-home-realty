<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateCheckoutSessionRequest;
use App\Http\Traits\HasApiResponse;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    use HasApiResponse;
    public function __construct()
    {
        // Set Stripe API key from config
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create Stripe Checkout Session for booking deposit
     */
    public function createCheckoutSession(CreateCheckoutSessionRequest $request, int $bookingId)
    {
        // Optimize query with eager loading
        $booking = Booking::with([
            'property:id,title,currency,price',
            'user:id,email',
        ])->findOrFail($bookingId);

        // Verify user owns this booking
        if (Auth::id() !== $booking->user_id) {
            return $this->forbiddenResponse('Unauthorized');
        }

        // Check if booking is already paid
        if ($booking->payment_status === 'paid') {
            return $this->errorResponse('Booking is already paid', 400);
        }

        // Calculate deposit from config (default: 30%)
        $depositPercentage = config('booking.deposit_percentage', 30);
        $depositAmount = $booking->total_price * ($depositPercentage / 100);

        try {
            $checkoutSession = Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => strtolower($booking->property->currency ?? 'usd'),
                            'product_data' => [
                                'name' => $booking->property->getTranslation('title', 'en') ?? 'Property Booking',
                                'description' => "Deposit for booking from {$booking->check_in->format('M d, Y')} to {$booking->check_out->format('M d, Y')}",
                            ],
                            'unit_amount' => (int) ($depositAmount * 100), // Convert to cents
                        ],
                        'quantity' => 1,
                    ],
                ],
                'mode' => 'payment',
                'success_url' => config('app.frontend_url') . '/bookings/' . $booking->id . '/payment/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => config('app.frontend_url') . '/bookings/' . $booking->id . '/payment?canceled=true',
                'metadata' => [
                    'booking_id' => $booking->id,
                    'user_id' => $booking->user_id,
                    'property_id' => $booking->property_id,
                ],
                'customer_email' => Auth::user()->email,
            ]);

            // Save checkout session ID to booking
            $booking->update([
                'stripe_checkout_session_id' => $checkoutSession->id,
            ]);

            return $this->successResponse([
                'checkout_url' => $checkoutSession->url,
                'session_id' => $checkoutSession->id,
            ], 'Checkout session created successfully');
        } catch (ApiErrorException $e) {
            Log::error('PaymentController@createCheckoutSession error: ' . $e->getMessage(), [
                'booking_id' => $bookingId,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->errorResponse(
                'Failed to create checkout session. Please try again later.',
                500
            );
        }
    }

    /**
     * Verify payment status
     */
    public function verifyPayment(Request $request, int $bookingId)
    {
        // Optimize query with eager loading
        $booking = Booking::with([
            'property:id,title',
            'user:id,email',
        ])->findOrFail($bookingId);

        // Verify user owns this booking
        if (Auth::id() !== $booking->user_id) {
            return $this->forbiddenResponse('Unauthorized');
        }

        if (!$booking->stripe_checkout_session_id) {
            return $this->successResponse([
                'paid' => false,
                'status' => $booking->payment_status,
            ], 'Payment status retrieved');
        }

        try {
            $session = Session::retrieve($booking->stripe_checkout_session_id);

            return $this->successResponse([
                'paid' => $session->payment_status === 'paid',
                'status' => $booking->payment_status,
                'session_status' => $session->payment_status,
            ], 'Payment status retrieved');
        } catch (ApiErrorException $e) {
            Log::error('PaymentController@verifyPayment error: ' . $e->getMessage(), [
                'booking_id' => $bookingId,
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->successResponse([
                'paid' => false,
                'status' => $booking->payment_status,
            ], 'Payment status retrieved');
        }
    }
}
