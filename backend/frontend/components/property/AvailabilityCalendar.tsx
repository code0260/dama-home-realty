'use client';

import { useEffect, useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { PropertyAvailability } from '@/types';
import { getPropertyAvailability } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';

interface AvailabilityCalendarProps {
  propertySlug: string;
  onDateSelect?: (checkIn: Date | undefined, checkOut: Date | undefined) => void;
  selectedRange?: DateRange;
}

export function AvailabilityCalendar({
  propertySlug,
  onDateSelect,
  selectedRange,
}: AvailabilityCalendarProps) {
  const [availability, setAvailability] = useState<PropertyAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<DateRange | undefined>(selectedRange);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPropertyAvailability(propertySlug);
        setAvailability(data);
      } catch (err: any) {
        console.error('Error fetching availability:', err);
        setError('Failed to load availability');
      } finally {
        setLoading(false);
      }
    };

    if (propertySlug) {
      fetchAvailability();
    }
  }, [propertySlug]);

  useEffect(() => {
    if (onDateSelect && range) {
      onDateSelect(range.from, range.to);
    }
  }, [range, onDateSelect]);

  if (loading) {
    return <Skeleton className="h-[350px] w-full rounded-lg" />;
  }

  if (error || !availability) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error || 'Failed to load availability'}</AlertDescription>
      </Alert>
    );
  }

  // Convert blocked dates to Date objects (with safety check)
  const blockedDates = (availability.blocked_dates || []).map((dateStr) => new Date(dateStr));

  // Disable blocked dates
  const isDateDisabled = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const blockedDatesList = availability.blocked_dates || [];
    return blockedDatesList.includes(dateStr) || date < new Date();
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-gray-300 bg-white"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-red-500 bg-red-100"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border-2 border-primary bg-primary/20"></div>
          <span>Selected</span>
        </div>
      </div>
      <DayPicker
        mode="range"
        selected={range}
        onSelect={(selectedRange) => {
          setRange(selectedRange);
          if (onDateSelect && selectedRange) {
            onDateSelect(selectedRange.from, selectedRange.to);
          }
        }}
        disabled={isDateDisabled}
        className="rounded-lg border p-4"
        classNames={{
          months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
          month: 'space-y-4',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-medium',
          nav: 'space-x-1 flex items-center',
          nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100',
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex',
          head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
          day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100',
          day_range_end: 'day-range-end',
          day_selected:
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          day_today: 'bg-accent text-accent-foreground',
          day_outside: 'text-muted-foreground opacity-50',
          day_disabled: 'text-muted-foreground opacity-50 bg-red-100',
          day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
        }}
        modifiers={{
          booked: blockedDates,
        }}
        modifiersClassNames={{
          booked: 'bg-red-100 border-red-500 text-red-700',
        }}
      />
      {range?.from && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Check-in:</strong> {format(range.from, 'EEEE, MMMM d, yyyy')}
          </p>
          {range.to && (
            <p>
              <strong>Check-out:</strong> {format(range.to, 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

