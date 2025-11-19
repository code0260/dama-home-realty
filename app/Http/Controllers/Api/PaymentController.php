<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    public function __construct()
    {
        // Set Stripe API key from config
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create Stripe Checkout Session for booking deposit
     */
    public function createCheckoutSession(Request $request, int $bookingId)
    {
        $booking = Booking::with('property')->findOrFail($bookingId);

        // Verify user owns this booking
        if (Auth::id() !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if booking is already paid
        if ($booking->payment_status === 'paid') {
            return response()->json(['message' => 'Booking is already paid'], 400);
        }

        // Calculate deposit (30% of total)
        $depositAmount = $booking->total_price * 0.3;

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

            return response()->json([
                'checkout_url' => $checkoutSession->url,
                'session_id' => $checkoutSession->id,
            ]);
        } catch (ApiErrorException $e) {
            return response()->json([
                'message' => 'Failed to create checkout session',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify payment status
     */
    public function verifyPayment(Request $request, int $bookingId)
    {
        $booking = Booking::findOrFail($bookingId);

        // Verify user owns this booking
        if (Auth::id() !== $booking->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$booking->stripe_checkout_session_id) {
            return response()->json([
                'paid' => false,
                'status' => $booking->payment_status,
            ]);
        }

        try {
            $session = Session::retrieve($booking->stripe_checkout_session_id);

            return response()->json([
                'paid' => $session->payment_status === 'paid',
                'status' => $booking->payment_status,
                'session_status' => $session->payment_status,
            ]);
        } catch (ApiErrorException $e) {
            return response()->json([
                'paid' => false,
                'status' => $booking->payment_status,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
