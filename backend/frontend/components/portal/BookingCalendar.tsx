'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingCalendarProps {
  bookings: Booking[];
}

export function BookingCalendar({ bookings }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get bookings for the current month
  const monthBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      return (
        isSameMonth(checkIn, currentMonth) ||
        isSameMonth(checkOut, currentMonth) ||
        (checkIn <= monthStart && checkOut >= monthEnd)
      );
    });
  }, [bookings, currentMonth, monthStart, monthEnd]);

  const getBookingsForDate = (date: Date) => {
    return monthBookings.filter((booking) => {
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      return date >= checkIn && date <= checkOut;
    });
  };

  const getBookingStatus = (booking: Booking, date: Date) => {
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);

    if (isSameDay(date, checkIn)) return 'check-in';
    if (isSameDay(date, checkOut)) return 'check-out';
    if (date > checkIn && date < checkOut) return 'active';
    return null;
  };

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get first day of month to pad calendar
  const firstDayOfWeek = monthStart.getDay();
  const paddingDays = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <Card className="border-gray-200 dark:border-primary-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            Booking Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {format(currentMonth, 'MMMM yyyy')}
        </p>
      </CardHeader>
      <CardContent>
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 p-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding days */}
          {paddingDays.map((day) => (
            <div key={`padding-${day}`} className="aspect-square" />
          ))}

          {/* Actual days */}
          {daysInMonth.map((day) => {
            const dayBookings = getBookingsForDate(day);
            const isToday = isSameDay(day, new Date());
            const hasBooking = dayBookings.length > 0;

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'aspect-square border rounded-lg p-1 text-xs relative overflow-hidden',
                  isToday && 'ring-2 ring-secondary',
                  hasBooking && 'bg-secondary/10 border-secondary/30',
                  !hasBooking && 'border-gray-200 dark:border-primary-700 hover:bg-gray-50 dark:hover:bg-primary-800'
                )}
              >
                <div
                  className={cn(
                    'text-center font-medium mb-1',
                    isToday && 'text-secondary font-bold',
                    !isToday && 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  {format(day, 'd')}
                </div>
                {dayBookings.map((booking, index) => {
                  const status = getBookingStatus(booking, day);
                  return (
                    <div
                      key={`${booking.id}-${index}`}
                      className={cn(
                        'text-[10px] px-1 py-0.5 rounded truncate mb-0.5',
                        status === 'check-in' && 'bg-green-500 text-white',
                        status === 'check-out' && 'bg-red-500 text-white',
                        status === 'active' && 'bg-blue-500 text-white',
                        !status && 'bg-gray-400 text-white'
                      )}
                      title={booking.property?.title || 'Booking'}
                    >
                      {status === 'check-in' && 'Check-in'}
                      {status === 'check-out' && 'Check-out'}
                      {status === 'active' && 'Active'}
                    </div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-primary-700">
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span className="text-gray-600 dark:text-gray-400">Check-in</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">Active Stay</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span className="text-gray-600 dark:text-gray-400">Check-out</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

