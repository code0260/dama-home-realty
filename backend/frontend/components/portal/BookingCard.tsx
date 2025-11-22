'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types';
import { Calendar, MapPin } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BookingCardProps {
  booking: Booking;
  onClick?: () => void;
  variant?: 'default' | 'compact';
}

export function BookingCard({ booking, onClick, variant = 'default' }: BookingCardProps) {
  const getStatusBadge = () => {
    switch (booking.booking_status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 text-white">Completed</Badge>;
      default:
        return null;
    }
  };

  const days = differenceInDays(new Date(booking.check_out), new Date(booking.check_in));

  if (variant === 'compact') {
    return (
      <Card
        className={cn(
          'hover:shadow-md transition-shadow border-gray-200 dark:border-primary-700 cursor-pointer',
          onClick && 'cursor-pointer'
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-primary dark:text-white truncate mb-1">
                {booking.property?.title || 'Property'}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {format(new Date(booking.check_in), 'MMM d')} -{' '}
                {format(new Date(booking.check_out), 'MMM d, yyyy')}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600 dark:text-gray-400">{days} nights</span>
                <span className="font-semibold text-primary dark:text-white">
                  {booking.total_price.toLocaleString()} {booking.property?.currency || 'USD'}
                </span>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'hover:shadow-lg transition-shadow border-gray-200 dark:border-primary-700',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg text-primary dark:text-white truncate mb-1">
              {booking.property?.title || 'Property'}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {booking.property?.neighborhood?.name || 'Damascus'}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4" />
          <span>
            {format(new Date(booking.check_in), 'MMM d, yyyy')} -{' '}
            {format(new Date(booking.check_out), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">{days} nights</span>
          <span className="font-semibold text-primary dark:text-white">
            {booking.total_price.toLocaleString()} {booking.property?.currency || 'USD'}
          </span>
        </div>
        {booking.payment_status === 'pending' && (
          <Button
            asChild
            variant="outline"
            className="w-full"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/bookings/${booking.id}/payment`}>Complete Payment</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

