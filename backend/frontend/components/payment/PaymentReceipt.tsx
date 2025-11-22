'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Mail, Printer, Share2 } from 'lucide-react';
import { Booking } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getBookingNights } from '@/lib/booking-utils';

interface PaymentReceiptProps {
  booking: Booking;
  paymentAmount: number;
  paymentMethod?: string;
  transactionId?: string;
  onDownload?: () => void;
  onPrint?: () => void;
  onEmail?: () => void;
  className?: string;
}

export function PaymentReceipt({
  booking,
  paymentAmount,
  paymentMethod = 'Credit Card',
  transactionId,
  onDownload,
  onPrint,
  onEmail,
  className,
}: PaymentReceiptProps) {
  const formatPrice = (price: number, currency: string) => {
    return currency === 'USD' ? `$${price.toLocaleString()}` : `${price.toLocaleString()} ${currency}`;
  };

  const depositAmount = booking.total_price * 0.3;
  const remainingAmount = booking.total_price - depositAmount;
  const nights = getBookingNights(booking);

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleEmail = () => {
    if (onEmail) {
      onEmail();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    }
  };

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary dark:text-white">Payment Receipt</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="bg-white hover:bg-gray-50 dark:bg-primary-800 dark:hover:bg-primary-700"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="bg-white hover:bg-gray-50 dark:bg-primary-800 dark:hover:bg-primary-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEmail}
              className="bg-white hover:bg-gray-50 dark:bg-primary-800 dark:hover:bg-primary-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Receipt Header */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-primary dark:text-white">Dama Home Realty</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Payment Receipt</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {format(new Date(), 'MMMM dd, yyyy - hh:mm a')}
          </p>
        </div>

        <Separator />

        {/* Booking Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-primary dark:text-white">Booking Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Booking ID:</span>
              <span className="font-semibold text-primary dark:text-white">#{booking.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Property:</span>
              <span className="font-semibold text-primary dark:text-white">
                {booking.property?.title || 'Property'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Check-in:</span>
              <span className="font-semibold text-primary dark:text-white">
                {format(new Date(booking.check_in), 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Check-out:</span>
              <span className="font-semibold text-primary dark:text-white">
                {format(new Date(booking.check_out), 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Nights:</span>
              <span className="font-semibold text-primary dark:text-white">
                {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Payment Details */}
        <div className="space-y-3">
          <h4 className="font-semibold text-primary dark:text-white">Payment Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
              <span className="font-semibold text-primary dark:text-white">
                {formatPrice(booking.total_price, booking.property?.currency || 'USD')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Deposit (30%):</span>
              <span className="font-semibold text-primary dark:text-white">
                {formatPrice(depositAmount, booking.property?.currency || 'USD')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
              <span className="font-semibold text-primary dark:text-white">
                {formatPrice(remainingAmount, booking.property?.currency || 'USD')}
              </span>
            </div>
            {transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                <span className="font-mono text-xs font-semibold text-primary dark:text-white">
                  {transactionId}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
              <span className="font-semibold text-primary dark:text-white">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">Paid</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Amount Paid */}
        <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-primary dark:text-white">Amount Paid:</span>
            <span className="text-2xl font-bold text-secondary">
              {formatPrice(paymentAmount, booking.property?.currency || 'USD')}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 dark:text-gray-500 space-y-1">
          <p>Thank you for your payment!</p>
          <p>
            A confirmation email has been sent to your registered email address. Please keep this
            receipt for your records.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

