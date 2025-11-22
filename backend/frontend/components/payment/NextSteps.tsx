'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Calendar,
  Phone,
  MapPin,
  Key,
  Wifi,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Booking } from '@/types';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface NextStepsProps {
  booking: Booking;
  className?: string;
}

export function NextSteps({ booking, className }: NextStepsProps) {
  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const daysUntilCheckIn = differenceInDays(checkIn, new Date());

  const steps = [
    {
      icon: Mail,
      title: 'Check Your Email',
      description: 'A confirmation email has been sent with booking details and access information.',
      completed: true,
      action: null,
    },
    {
      icon: Calendar,
      title: 'Add to Calendar',
      description: `Your check-in is on ${format(checkIn, 'MMMM d, yyyy')}. Add this to your calendar.`,
      completed: false,
      action: {
        label: 'Add to Calendar',
        href: `#`,
        onClick: () => {
          // Create calendar event URL
          const startDate = format(checkIn, "yyyyMMdd'T'HHmmss");
          const endDate = format(checkOut, "yyyyMMdd'T'HHmmss");
          const title = encodeURIComponent(`Booking: ${booking.property?.title || 'Property'}`);
          const details = encodeURIComponent(
            `Booking confirmation for ${booking.property?.title || 'Property'}`
          );
          const location = encodeURIComponent(
            `${booking.property?.neighborhood?.name || 'Damascus'}, Syria`
          );
          const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
          window.open(calendarUrl, '_blank');
        },
      },
    },
    {
      icon: Phone,
      title: 'Contact Agent',
      description:
        'Reach out to your agent if you have any questions or special requests before check-in.',
      completed: false,
      action: booking.property?.agent
        ? {
            label: 'Contact Agent',
            href: booking.property.agent.phone
              ? `tel:${booking.property.agent.phone}`
              : '#',
          }
        : null,
    },
    {
      icon: MapPin,
      title: 'Plan Your Arrival',
      description: `Get directions to the property. Check-in time is typically 2:00 PM.`,
      completed: false,
      action: {
        label: 'Get Directions',
        href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${booking.property?.neighborhood?.name || 'Damascus'}, Syria`
        )}`,
      },
    },
  ];

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-white">
          <CheckCircle2 className="w-5 h-5 text-secondary" />
          Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Countdown to Check-in */}
        {daysUntilCheckIn > 0 && (
          <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20 mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-secondary" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">Days until check-in</p>
                <p className="text-2xl font-bold text-primary dark:text-white">
                  {daysUntilCheckIn} {daysUntilCheckIn === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-lg border-2 transition-all',
                  step.completed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-gray-50 dark:bg-primary-800 border-gray-200 dark:border-primary-700 hover:border-secondary/50'
                )}
              >
                <div
                  className={cn(
                    'p-2 rounded-lg flex-shrink-0',
                    step.completed
                      ? 'bg-green-100 dark:bg-green-900/40'
                      : 'bg-gray-200 dark:bg-primary-700'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      step.completed
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4
                      className={cn(
                        'font-semibold',
                        step.completed
                          ? 'text-green-900 dark:text-green-300'
                          : 'text-primary dark:text-white'
                      )}
                    >
                      {step.title}
                    </h4>
                    {step.completed && (
                      <Badge
                        variant="outline"
                        className="bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Done
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {step.description}
                  </p>
                  {step.action && !step.completed && (
                    <div>
                      {step.action.onClick ? (
                        <button
                          onClick={step.action.onClick}
                          className="text-sm text-secondary hover:underline font-medium flex items-center gap-1"
                        >
                          {step.action.label}
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <Link
                          href={step.action.href || '#'}
                          target={step.action.href?.startsWith('http') ? '_blank' : undefined}
                          className="text-sm text-secondary hover:underline font-medium flex items-center gap-1"
                        >
                          {step.action.label}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Access Information Preview */}
        {booking.property?.tenant_details && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Access Information Available
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Property access details (WiFi password, door code) will be available in your
                  confirmation email and tenant portal 24 hours before check-in.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

