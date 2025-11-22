'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { getBooking } from '@/lib/api';
import { Booking } from '@/types';
import { format } from 'date-fns';
import { CreditCard, CheckCircle2, XCircle, Loader2, AlertCircle, Home, Calendar } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';
import { PaymentProgress } from '@/components/payment/PaymentProgress';
import { PaymentMethods } from '@/components/payment/PaymentMethods';
import { PaymentSecurity } from '@/components/payment/PaymentSecurity';
import { BookingSummary } from '@/components/payment/BookingSummary';
import { motion } from 'framer-motion';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = parseInt(params.id as string);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canceled, setCanceled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');

  useEffect(() => {
    const canceledParam = searchParams.get('canceled');
    if (canceledParam === 'true') {
      setCanceled(true);
      setCurrentStep(2);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await getBooking(bookingId);
        setBooking(data);

        // If already paid, redirect to success
        if (data.payment_status === 'paid' || data.payment_status === 'partial') {
          router.push(`/bookings/${bookingId}/payment/success`);
        }
      } catch (err: any) {
        console.error('Error fetching booking:', err);
        if (err.response?.status === 404) {
          setError('Booking not found');
        } else if (err.response?.status === 403) {
          setError('You are not authorized to view this booking');
        } else {
          setError('Failed to load booking details');
        }
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, router]);

  const handleCheckout = async () => {
    if (!booking) return;

    setProcessing(true);
    setError(null);
    setCurrentStep(3); // Move to processing step

    try {
      const response = await axiosInstance.post(`/bookings/${booking.id}/checkout`);
      const { checkout_url } = response.data;

      // Redirect to Stripe Checkout
      window.location.href = checkout_url;
    } catch (err: any) {
      console.error('Error creating checkout session:', err);
      setError(
        err.response?.data?.message || 'Failed to initiate payment. Please try again.'
      );
      setProcessing(false);
      setCurrentStep(2); // Go back to payment method step
    }
  };

  const depositAmount = booking ? booking.total_price * 0.3 : 0;
  const remainingAmount = booking ? booking.total_price - depositAmount : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-96 w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Error</h2>
              <p className="text-gray-600 mb-4">{error || 'Booking not found'}</p>
              <Button asChild>
                <Link href="/portal">Go to My Bookings</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-primary-900">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">
                Complete Your Booking
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Secure your reservation with a deposit payment
              </p>
            </div>

            {/* Payment Progress */}
            <Card className="mb-6 border-2 border-gray-200 dark:border-primary-700">
              <CardContent className="pt-6">
                <PaymentProgress currentStep={currentStep} />
              </CardContent>
            </Card>

            {canceled && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Payment was canceled. You can try again below.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Booking Summary */}
              <div className="lg:col-span-2 space-y-6">
                {/* Booking Summary */}
                <BookingSummary booking={booking} />

                {/* Payment Methods */}
                {currentStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PaymentMethods
                      selectedMethod={selectedPaymentMethod}
                      onMethodChange={setSelectedPaymentMethod}
                      currency={booking.property?.currency || 'USD'}
                    />
                  </motion.div>
                )}

                {/* Payment Security */}
                {currentStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <PaymentSecurity />
                  </motion.div>
                )}
              </div>

              {/* Right Column - Payment Action */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24 border-2 border-gray-200 dark:border-primary-700">
                  <CardHeader>
                    <CardTitle className="text-primary dark:text-white">Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Amount Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Total Price</span>
                        <span className="font-semibold text-primary dark:text-white">
                          {booking.total_price.toLocaleString()} {booking.property?.currency || 'USD'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Deposit (30%)</span>
                        <span className="font-semibold text-secondary">
                          {depositAmount.toLocaleString()} {booking.property?.currency || 'USD'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-500 border-t pt-3">
                        <span>Remaining (due at check-in)</span>
                        <span>
                          {remainingAmount.toLocaleString()} {booking.property?.currency || 'USD'}
                        </span>
                      </div>
                    </div>

                    {/* Deposit Amount Highlight */}
                    <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-primary dark:text-white">
                          Deposit Amount
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-secondary">
                        {depositAmount.toLocaleString()} {booking.property?.currency || 'USD'}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Pay now to confirm your booking
                      </p>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      onClick={handleCheckout}
                      disabled={processing || booking.payment_status === 'paid' || currentStep < 2}
                      className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-lg"
                      size="lg"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : booking.payment_status === 'paid' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Already Paid
                        </>
                      ) : currentStep < 2 ? (
                        <>
                          Select Payment Method First
                        </>
                      ) : selectedPaymentMethod === 'stripe' ? (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay with Stripe
                        </>
                      ) : selectedPaymentMethod === 'card' ? (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay with Card
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pay Deposit
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                      By proceeding, you agree to our{' '}
                      <Link href="/terms" className="text-secondary hover:underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-secondary hover:underline">
                        Privacy Policy
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
