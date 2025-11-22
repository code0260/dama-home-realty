'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Booking } from '@/types';
import { format } from 'date-fns';
import {
  CheckCircle2,
  Calendar,
  Home,
  DollarSign,
  CreditCard,
  FileText,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBookingNights } from '@/lib/booking-utils';

interface ConfirmationDetailsProps {
  booking: Booking;
  transactionId?: string;
  paymentMethod?: string;
  onEmailReceipt?: () => void;
  className?: string;
}

export function ConfirmationDetails({
  booking,
  transactionId,
  paymentMethod = 'Credit Card',
  onEmailReceipt,
  className,
}: ConfirmationDetailsProps) {
  const depositAmount = booking.total_price * 0.3;
  const remainingAmount = booking.total_price - depositAmount;
  const nights = getBookingNights(booking);

  const formatPrice = (price: number, currency: string) => {
    return currency === 'USD' ? `$${price.toLocaleString()}` : `${price.toLocaleString()} ${currency}`;
  };

  return (
    <Card className={cn('border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary dark:text-white">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            Confirmation Details
          </CardTitle>
          <Badge className="bg-green-500 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Confirmation Message */}
        <div className="text-center space-y-2">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
          <h3 className="text-2xl font-bold text-primary dark:text-white">
            Payment Successful!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your booking has been confirmed. A confirmation email has been sent to your registered
            email address.
          </p>
        </div>

        <Separator />

        {/* Booking Information */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-primary-800 rounded-lg">
              <Home className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Property</p>
              <p className="font-semibold text-primary dark:text-white">
                {booking.property?.title || 'Property'}
              </p>
              {booking.property?.neighborhood && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {booking.property.neighborhood.name}, {booking.property.neighborhood.city}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-primary-800 rounded-lg">
              <Calendar className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Booking Dates</p>
              <p className="font-semibold text-primary dark:text-white">
                {format(new Date(booking.check_in), 'MMMM d, yyyy')} -{' '}
                {format(new Date(booking.check_out), 'MMMM d, yyyy')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {nights} {nights === 1 ? 'night' : 'nights'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-primary-800 rounded-lg">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Booking ID</p>
              <p className="font-semibold text-primary dark:text-white font-mono">#{booking.id}</p>
              {transactionId && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                  Transaction: {transactionId}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Amount</span>
            <span className="font-semibold text-primary dark:text-white">
              {formatPrice(booking.total_price, booking.property?.currency || 'USD')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Deposit Paid</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {formatPrice(depositAmount, booking.property?.currency || 'USD')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 border-t pt-2">
            <span>Remaining (due at check-in)</span>
            <span>{formatPrice(remainingAmount, booking.property?.currency || 'USD')}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
            <span className="font-semibold text-primary dark:text-white">{paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
            <Badge className="bg-green-500 text-white">Paid</Badge>
          </div>
        </div>

        {/* Email Receipt */}
        {onEmailReceipt && (
          <>
            <Separator />
            <div className="flex items-center justify-between p-4 bg-white dark:bg-primary-800 rounded-lg border border-gray-200 dark:border-primary-700">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary" />
                <div>
                  <p className="font-semibold text-primary dark:text-white">Email Receipt</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receipt has been sent to your email
                  </p>
                </div>
              </div>
              <button
                onClick={onEmailReceipt}
                className="text-sm text-secondary hover:underline font-medium"
              >
                Resend
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

