'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getBooking } from '@/lib/api';
import { Booking } from '@/types';
import { format } from 'date-fns';
import { CheckCircle2, Home, Calendar, Mail } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = parseInt(params.id as string);
  const sessionId = searchParams.get('session_id');

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Verify payment status
        const response = await axiosInstance.get(`/bookings/${bookingId}/payment/verify`);
        
        if (response.data.paid) {
          // Fetch updated booking
          const data = await getBooking(bookingId);
          setBooking(data);
        } else {
          // Payment not confirmed yet, wait a bit and retry
          setTimeout(async () => {
            const retryResponse = await axiosInstance.get(`/bookings/${bookingId}/payment/verify`);
            if (retryResponse.data.paid) {
              const data = await getBooking(bookingId);
              setBooking(data);
            }
          }, 2000);
        }
      } catch (err) {
        console.error('Error verifying payment:', err);
      } finally {
        setVerifying(false);
        setLoading(false);
      }
    };

    if (bookingId && sessionId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [bookingId, sessionId]);

  if (loading || verifying) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Verifying payment...</p>
          </div>
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
            <Card className="border-2 border-green-500">
              <CardContent className="py-12 text-center">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-primary mb-2">Payment Successful!</h1>
                <p className="text-gray-600 mb-8">
                  Your booking has been confirmed. A confirmation email has been sent to your
                  email address.
                </p>

                {booking && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                    <h3 className="font-semibold mb-4">Booking Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-gray-500" />
                        <span>
                          <strong>Property:</strong> {booking.property?.title || 'Property'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>
                          <strong>Dates:</strong> {format(new Date(booking.check_in), 'MMM d')} -{' '}
                          {format(new Date(booking.check_out), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div>
                        <strong>Booking ID:</strong> #{booking.id}
                      </div>
                      <div>
                        <strong>Status:</strong>{' '}
                        <span className="text-green-600 font-semibold">Confirmed</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-secondary hover:bg-secondary/90 text-white">
                    <Link href="/portal">
                      <Calendar className="w-4 h-4 mr-2" />
                      View My Bookings
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/properties">
                      <Home className="w-4 h-4 mr-2" />
                      Browse More Properties
                    </Link>
                  </Button>
                </div>

                <Alert className="mt-6">
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Check your email for booking confirmation and property access details.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

