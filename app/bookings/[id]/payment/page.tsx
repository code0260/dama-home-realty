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
import { CreditCard, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

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

  useEffect(() => {
    const canceledParam = searchParams.get('canceled');
    if (canceledParam === 'true') {
      setCanceled(true);
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-primary mb-8">Complete Your Booking</h1>

            {canceled && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Payment was canceled. You can try again below.
                </AlertDescription>
              </Alert>
            )}

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
                <CardDescription>{booking.property?.title || 'Property'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in</span>
                  <span className="font-semibold">
                    {format(new Date(booking.check_in), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out</span>
                  <span className="font-semibold">
                    {format(new Date(booking.check_out), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nights</span>
                  <span className="font-semibold">{booking.nights} nights</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Price</span>
                    <span className="font-semibold">
                      {booking.total_price.toLocaleString()} {booking.property?.currency || 'USD'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Deposit (30%)</span>
                    <span>
                      {depositAmount.toLocaleString()} {booking.property?.currency || 'USD'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Remaining (due at check-in)</span>
                    <span>
                      {remainingAmount.toLocaleString()} {booking.property?.currency || 'USD'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment
                </CardTitle>
                <CardDescription>
                  Pay the deposit to confirm your booking. The remaining amount will be due at
                  check-in.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Deposit Amount</span>
                      <span className="text-2xl font-bold text-secondary">
                        {depositAmount.toLocaleString()} {booking.property?.currency || 'USD'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Secure payment powered by Stripe
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
                    disabled={processing || booking.payment_status === 'paid'}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : booking.payment_status === 'paid' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Already Paid
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay Deposit with Stripe
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    By proceeding, you agree to our terms and conditions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

