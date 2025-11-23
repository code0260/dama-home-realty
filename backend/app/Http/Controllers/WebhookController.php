<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Contract;
use App\Mail\BookingConfirmed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Stripe\Stripe;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class WebhookController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Handle Stripe webhooks
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch (\UnexpectedValueException $e) {
            Log::error('Stripe webhook: Invalid payload', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (SignatureVerificationException $e) {
            Log::error('Stripe webhook: Invalid signature', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $this->handleCheckoutSessionCompleted($event->data->object);
                break;

            case 'payment_intent.succeeded':
                $this->handlePaymentIntentSucceeded($event->data->object);
                break;

            case 'payment_intent.payment_failed':
                $this->handlePaymentIntentFailed($event->data->object);
                break;

            default:
                Log::info('Stripe webhook: Unhandled event type', ['type' => $event->type]);
        }

        return response()->json(['received' => true]);
    }

    /**
     * Handle checkout session completed
     */
    protected function handleCheckoutSessionCompleted($session)
    {
        $bookingId = $session->metadata->booking_id ?? null;

        if (!$bookingId) {
            Log::warning('Stripe webhook: No booking_id in metadata', ['session_id' => $session->id]);
            return;
        }

        // Optimize query with eager loading
        $booking = Booking::with([
            'property:id,title',
            'user:id,email,name',
        ])->find($bookingId);

        if (!$booking) {
            Log::warning('Stripe webhook: Booking not found', ['booking_id' => $bookingId]);
            return;
        }

        // Update booking payment status - use config for deposit percentage
        $depositPercentage = config('booking.deposit_percentage', 30);
        $depositAmount = $booking->total_price * ($depositPercentage / 100);

        DB::transaction(function () use ($booking, $depositAmount) {
            $booking->update([
                'payment_status' => 'partial', // Partial because it's only the deposit
                'amount_paid' => $depositAmount,
                'booking_status' => 'confirmed', // Confirm booking after deposit payment
            ]);

            // Create contract automatically after payment
            if (!$booking->contract) {
                Contract::create([
                    'booking_id' => $booking->id,
                    'status' => 'active',
                    'start_date' => $booking->check_in,
                    'end_date' => $booking->check_out,
                    'total_amount' => $booking->total_price,
                    'deposit_amount' => $depositAmount,
                    'payment_status' => 'partial',
                    'terms' => $this->generateDefaultContractTerms($booking),
                    'signed_by_tenant' => false,
                    'signed_by_owner' => false,
                ]);

                Log::info('Stripe webhook: Contract created automatically', [
                    'booking_id' => $booking->id,
                ]);
            }
        });

        // Send booking confirmation email
        try {
            Mail::to($booking->user->email)->send(new BookingConfirmed($booking));
            Log::info('Stripe webhook: Booking confirmation email sent', [
                'booking_id' => $booking->id,
                'user_email' => $booking->user->email,
            ]);
        } catch (\Exception $e) {
            Log::error('Stripe webhook: Failed to send booking confirmation email', [
                'booking_id' => $booking->id,
                'error' => $e->getMessage(),
            ]);
        }

        Log::info('Stripe webhook: Booking payment updated and contract created', [
            'booking_id' => $booking->id,
            'payment_status' => 'partial',
        ]);
    }

    /**
     * Handle payment intent succeeded
     */
    protected function handlePaymentIntentSucceeded($paymentIntent)
    {
        // Additional handling if needed
        Log::info('Stripe webhook: Payment intent succeeded', ['payment_intent_id' => $paymentIntent->id]);
    }

    /**
     * Handle payment intent failed
     */
    protected function handlePaymentIntentFailed($paymentIntent)
    {
        Log::warning('Stripe webhook: Payment intent failed', [
            'payment_intent_id' => $paymentIntent->id,
            'error' => $paymentIntent->last_payment_error ?? null,
        ]);
    }

    /**
     * Generate default contract terms
     */
    protected function generateDefaultContractTerms(Booking $booking): string
    {
        return "This is a rental agreement contract for the property: {$booking->property->getTranslation('title', 'en')}.

TERMS AND CONDITIONS:
1. The tenant agrees to pay the total amount of {$booking->total_price} {$booking->property->currency}.
2. A deposit of " . ($booking->total_price * 0.3) . " {$booking->property->currency} has been paid.
3. The remaining amount must be paid before check-in.
4. The tenant is responsible for maintaining the property in good condition.
5. Any damages will be deducted from the security deposit.
6. The contract is valid from {$booking->check_in->format('Y-m-d')} to {$booking->check_out->format('Y-m-d')}.

This contract is automatically generated upon payment confirmation.";
    }
}
