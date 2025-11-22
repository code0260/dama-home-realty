'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Booking } from '@/types';
import {
  Calendar,
  MapPin,
  DollarSign,
  User,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BookingDetailsProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModify?: (booking: Booking) => void;
}

export function BookingDetails({
  booking,
  open,
  onOpenChange,
  onModify,
}: BookingDetailsProps) {
  if (!booking) return null;

  const days = differenceInDays(new Date(booking.check_out), new Date(booking.check_in));
  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const today = new Date();
  const isActive = today >= checkIn && today <= checkOut;
  const isUpcoming = checkIn > today;
  const isPast = checkOut < today;

  const getStatusBadge = () => {
    switch (booking.booking_status) {
      case 'confirmed':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Confirmed
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-gray-500 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = () => {
    switch (booking.payment_status) {
      case 'paid':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-blue-500 text-white">
            <AlertCircle className="w-3 h-3 mr-1" />
            Partial
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'refunded':
        return (
          <Badge className="bg-gray-500 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary dark:text-white flex items-center justify-between">
            <span>Booking Details</span>
            {getStatusBadge()}
          </DialogTitle>
          <DialogDescription>Booking Reference: #{booking.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Image */}
          {booking.property?.images && booking.property.images.length > 0 && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src={booking.property.images[0]}
                alt={booking.property.title || 'Property'}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Property Info */}
          <div>
            <h3 className="text-xl font-bold text-primary dark:text-white mb-2">
              {booking.property?.title || 'Property'}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
              <MapPin className="w-4 h-4" />
              <span>{booking.property?.neighborhood?.name || 'Damascus'}</span>
            </div>
            {booking.property?.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {booking.property.description}
              </p>
            )}
          </div>

          <Separator />

          {/* Booking Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Check-in</span>
              </div>
              <p className="text-lg font-semibold text-primary dark:text-white">
                {format(checkIn, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Check-out</span>
              </div>
              <p className="text-lg font-semibold text-primary dark:text-white">
                {format(checkOut, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Booking Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary dark:text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-secondary" />
                Payment Information
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
                  <span className="font-semibold text-primary dark:text-white">
                    {booking.total_price.toLocaleString()} {booking.property?.currency || 'USD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
                  <span className="font-semibold text-primary dark:text-white">
                    {booking.amount_paid?.toLocaleString() || 0} {booking.property?.currency || 'USD'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Nights:</span>
                  <span className="font-semibold text-primary dark:text-white">{days} nights</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-primary-700">
                  <span className="text-gray-600 dark:text-gray-400">Payment Status:</span>
                  {getPaymentStatusBadge()}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-primary dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-secondary" />
                Contact Information
              </h4>
              {booking.property?.agent && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>{booking.property.agent.name}</span>
                  </div>
                  {booking.property.agent.phone && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4" />
                      <a
                        href={`tel:${booking.property.agent.phone}`}
                        className="hover:text-secondary transition-colors"
                      >
                        {booking.property.agent.phone}
                      </a>
                    </div>
                  )}
                  {(booking.property.agent as any)?.email && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <a
                        href={`mailto:${(booking.property.agent as any).email}`}
                        className="hover:text-secondary transition-colors"
                      >
                        {(booking.property.agent as any).email}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold text-primary dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  Special Notes
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{booking.notes}</p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-primary-700">
            {booking.payment_status === 'pending' && (
              <Button
                asChild
                className="flex-1 bg-secondary hover:bg-secondary/90 text-white"
              >
                <Link href={`/bookings/${booking.id}/payment`}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Complete Payment
                </Link>
              </Button>
            )}
            {isActive && (
              <Button asChild variant="outline" className="flex-1">
                <Link href={`/properties/${booking.property?.slug}`}>
                  View Property
                </Link>
              </Button>
            )}
            {isUpcoming && onModify && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onModify(booking);
                  onOpenChange(false);
                }}
              >
                Modify Booking
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

