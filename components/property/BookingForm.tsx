'use client';

import { useState } from 'react';
import { Property } from '@/types';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar, DollarSign, CreditCard, MessageCircle, Phone } from 'lucide-react';
import { createBooking } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { format, differenceInDays } from 'date-fns';

interface BookingFormProps {
  property: Property;
}

export function BookingForm({ property }: BookingFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = (from: Date | undefined, to: Date | undefined) => {
    setCheckIn(from);
    setCheckOut(to);
    setError(null);
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = differenceInDays(checkOut, checkIn);
    return property.price * nights;
  };

  const calculateDeposit = () => {
    const total = calculateTotal();
    // 30% deposit
    return total * 0.3;
  };

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = calculateTotal();
  const deposit = calculateDeposit();

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (!isAuthenticated) {
      // Redirect to login or show login modal
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setLoading(true);
    setError(null);

    if (!property.id) {
      setError('Property ID is missing. Please refresh the page.');
      setLoading(false);
      return;
    }

    try {
      const booking = await createBooking({
        property_id: property.id,
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
      });

      // Redirect to payment/booking confirmation
      router.push(`/bookings/${booking.id}/payment`);
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.check_in?.[0] ||
          'Failed to create booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Only show booking form for hotel/rent properties
  if (!['hotel', 'rent'].includes(property.type)) {
    return null;
  }

  // For non-authenticated users, show contact buttons instead
  if (!isAuthenticated) {
    const getWhatsAppLink = (phone?: string) => {
      if (!phone) return '#';
      const cleanPhone = phone.replace(/\D/g, '');
      const message = encodeURIComponent(
        `Hello, I'm interested in booking: ${property.title} (Ref: ${property.reference_id || property.slug}). Could you please provide more information?`
      );
      return `https://wa.me/${cleanPhone}?text=${message}`;
    };

    const contactPhone = property.agent?.phone || property.owner_contact;

    return (
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Interested in This Property?
          </CardTitle>
          <CardDescription>
            Contact us to arrange your stay
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactPhone ? (
            <>
              <Button
                asChild
                className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                size="lg"
              >
                <a
                  href={getWhatsAppLink(contactPhone)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact via WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full"
                size="lg"
              >
                <a href={`tel:${contactPhone}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </Button>
            </>
          ) : (
            <p className="text-sm text-gray-600 text-center py-4">
              Please contact us for booking information
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // For authenticated users, show full booking form
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Book This Property
        </CardTitle>
        <CardDescription>
          Select your check-in and check-out dates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendar */}
        <AvailabilityCalendar
          propertySlug={property.slug}
          onDateSelect={handleDateSelect}
          selectedRange={checkIn && checkOut ? { from: checkIn, to: checkOut } : undefined}
        />

        {/* Price Summary */}
        {checkIn && checkOut && (
          <div className="space-y-3 rounded-lg border bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {property.price.toLocaleString()} {property.currency} × {nights} nights
              </span>
              <span className="font-semibold">
                {totalPrice.toLocaleString()} {property.currency}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Deposit (30%)</span>
                <span className="font-semibold text-secondary">
                  {deposit.toLocaleString()} {property.currency}
                </span>
              </div>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between font-bold">
                <span>Total</span>
                <span className="text-lg">
                  {totalPrice.toLocaleString()} {property.currency}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Booking Button */}
        <Button
          onClick={handleBooking}
          disabled={!checkIn || !checkOut || loading}
          className="w-full bg-secondary hover:bg-secondary/90 text-white"
          size="lg"
        >
          {loading ? (
            'Processing...'
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Book & Pay Deposit
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

