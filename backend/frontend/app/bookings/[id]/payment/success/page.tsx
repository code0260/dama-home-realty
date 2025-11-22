'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getBooking } from '@/lib/api';
import { Booking } from '@/types';
import { Home, Calendar, Mail, Download, Share2 } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ConfirmationDetails } from '@/components/payment/ConfirmationDetails';
import { BookingSummary } from '@/components/payment/BookingSummary';
import { NextSteps } from '@/components/payment/NextSteps';
import { PaymentReceipt } from '@/components/payment/PaymentReceipt';

function PaymentSuccessContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = parseInt(params.id as string);
  const sessionId = searchParams.get('session_id');

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);

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
    } else if (bookingId) {
      // If no session_id, just fetch the booking
      getBooking(bookingId)
        .then((data) => {
          setBooking(data);
          setLoading(false);
          setVerifying(false);
        })
        .catch((err) => {
          console.error('Error fetching booking:', err);
          setLoading(false);
          setVerifying(false);
        });
    } else {
      setLoading(false);
      setVerifying(false);
    }
  }, [bookingId, sessionId]);

  const handleEmailReceipt = async () => {
    if (!booking) return;
    
    setResendingEmail(true);
    try {
      // This would call an API endpoint to resend the receipt
      // await axiosInstance.post(`/bookings/${booking.id}/receipt/resend`);
      // For now, just show success
      setTimeout(() => {
        setResendingEmail(false);
      }, 2000);
    } catch (err) {
      console.error('Error sending email receipt:', err);
      setResendingEmail(false);
    }
  };

  const handleDownloadReceipt = () => {
    // This would generate and download a PDF receipt
    // For now, we'll use window.print() as a placeholder
    window.print();
  };

  const handleShareBooking = () => {
    if (navigator.share && booking) {
      navigator.share({
        title: `Booking Confirmation - ${booking.property?.title || 'Property'}`,
        text: `I've booked ${booking.property?.title || 'Property'} from ${new Date(booking.check_in).toLocaleDateString()} to ${new Date(booking.check_out).toLocaleDateString()}`,
        url: window.location.href,
      });
    }
  };

  if (loading || verifying) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-primary-900">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-primary-900">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto">
            <div className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-2 text-primary dark:text-white">
                Booking Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn't find your booking. Please check the booking ID and try again.
              </p>
              <Button asChild>
                <Link href="/portal">Go to My Bookings</Link>
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const depositAmount = booking.total_price * 0.3;
  const transactionId = booking.stripe_checkout_session_id || sessionId || undefined;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-primary-900">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Actions */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">
                  Payment Successful!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Your booking has been confirmed
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadReceipt}
                  className="bg-white hover:bg-gray-50 dark:bg-primary-800 dark:hover:bg-primary-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <Button
                    variant="outline"
                    onClick={handleShareBooking}
                    className="bg-white hover:bg-gray-50 dark:bg-primary-800 dark:hover:bg-primary-700"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                )}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Confirmation & Summary */}
              <div className="lg:col-span-2 space-y-6">
                {/* Confirmation Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ConfirmationDetails
                    booking={booking}
                    transactionId={transactionId}
                    paymentMethod="Credit Card via Stripe"
                    onEmailReceipt={handleEmailReceipt}
                  />
                </motion.div>

                {/* Booking Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <BookingSummary booking={booking} />
                </motion.div>

                {/* Payment Receipt */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="print:hidden"
                >
                  <PaymentReceipt
                    booking={booking}
                    paymentAmount={depositAmount}
                    paymentMethod="Credit Card via Stripe"
                    transactionId={transactionId}
                    onDownload={handleDownloadReceipt}
                    onEmail={handleEmailReceipt}
                  />
                </motion.div>
              </div>

              {/* Right Column - Next Steps */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <NextSteps booking={booking} />
                </motion.div>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-200 dark:border-primary-700"
            >
              <Button
                asChild
                className="bg-secondary hover:bg-secondary/90 text-white h-12 text-base"
                size="lg"
              >
                <Link href="/portal">
                  <Calendar className="w-5 h-5 mr-2" />
                  View My Bookings
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-white hover:bg-gray-50 dark:bg-primary-800 dark:hover:bg-primary-700 h-12 text-base"
                size="lg"
              >
                <Link href="/properties">
                  <Home className="w-5 h-5 mr-2" />
                  Browse More Properties
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-primary-900">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-4 w-96 mx-auto" />
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
