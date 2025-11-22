'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types';
import { format } from 'date-fns';
import { Home, Calendar, Moon, DollarSign, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getBookingNights } from '@/lib/booking-utils';
import Image from 'next/image';
import Link from 'next/link';

interface BookingSummaryProps {
  booking: Booking;
  className?: string;
}

export function BookingSummary({ booking, className }: BookingSummaryProps) {
  const depositAmount = booking.total_price * 0.3;
  const remainingAmount = booking.total_price - depositAmount;
  const nights = getBookingNights(booking);

  const formatPrice = (price: number, currency: string) => {
    return currency === 'USD' ? `$${price.toLocaleString()}` : `${price.toLocaleString()} ${currency}`;
  };

  const propertyImage =
    booking.property?.images && booking.property.images.length > 0
      ? booking.property.images[0].startsWith('http')
        ? booking.property.images[0]
        : `http://localhost:8000/storage/${booking.property.images[0]}`
      : null;

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-white">
          <Home className="w-5 h-5 text-secondary" />
          Booking Summary
        </CardTitle>
        <CardDescription>{booking.property?.title || 'Property'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Image */}
        {propertyImage && (
          <Link href={`/properties/${booking.property?.slug}`}>
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-primary-800 cursor-pointer hover:opacity-90 transition-opacity">
              <Image
                src={propertyImage}
                alt={booking.property?.title || 'Property'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Link>
        )}

        {/* Booking Details */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Check-in</p>
              <p className="font-semibold text-primary dark:text-white">
                {format(new Date(booking.check_in), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Check-out</p>
              <p className="font-semibold text-primary dark:text-white">
                {format(new Date(booking.check_out), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Moon className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Duration</p>
              <p className="font-semibold text-primary dark:text-white">
                {nights} {nights === 1 ? 'night' : 'nights'}
              </p>
            </div>
          </div>

          {booking.property?.neighborhood && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Location</p>
                <p className="font-semibold text-primary dark:text-white">
                  {booking.property.neighborhood.name}, {booking.property.neighborhood.city}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Price</span>
            <span className="font-semibold text-lg text-primary dark:text-white">
              {formatPrice(booking.total_price, booking.property?.currency || 'USD')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Deposit (30%)</span>
            <span className="font-semibold text-secondary">
              {formatPrice(depositAmount, booking.property?.currency || 'USD')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 border-t pt-2">
            <span>Remaining (due at check-in)</span>
            <span>{formatPrice(remainingAmount, booking.property?.currency || 'USD')}</span>
          </div>
        </div>

        {/* Booking Status */}
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-sm text-gray-600 dark:text-gray-400">Booking Status</span>
          <Badge
            variant="outline"
            className={
              booking.booking_status === 'confirmed'
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400'
                : booking.booking_status === 'pending'
                ? 'bg-yellow-50 border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-400'
                : 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-primary-800 dark:border-primary-700 dark:text-gray-400'
            }
          >
            {booking.booking_status === 'confirmed'
              ? 'Confirmed'
              : booking.booking_status === 'pending'
              ? 'Pending'
              : booking.booking_status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

