'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar as CalendarIcon, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Booking } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axios';

interface BookingModificationProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BookingModification({
  booking,
  open,
  onOpenChange,
  onSuccess,
}: BookingModificationProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(
    booking ? new Date(booking.check_in) : undefined
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(
    booking ? new Date(booking.check_out) : undefined
  );
  const [notes, setNotes] = useState(booking?.notes || '');

  if (!booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axiosInstance.put(`/bookings/${booking.id}`, {
        check_in: checkInDate?.toISOString(),
        check_out: checkOutDate?.toISOString(),
        notes,
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.check_in?.[0] ||
          err.response?.data?.errors?.check_out?.[0] ||
          'Failed to modify booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setError(null);
    setLoading(true);

    try {
      await axiosInstance.put(`/bookings/${booking.id}/cancel`);
      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary dark:text-white">
            Modify Booking
          </DialogTitle>
          <DialogDescription>
            Update your booking details. Changes may affect the total price.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Property Info */}
          <div className="p-4 bg-gray-50 dark:bg-primary-800 rounded-lg">
            <h3 className="font-semibold text-primary dark:text-white mb-2">
              {booking.property?.title || 'Property'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {booking.property?.neighborhood?.name || 'Damascus'}
            </p>
          </div>

          {/* Check-in Date */}
          <div className="space-y-2">
            <Label htmlFor="check-in">Check-in Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !checkInDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? format(checkInDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <Label htmlFor="check-out">Check-out Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !checkOutDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? format(checkOutDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) =>
                    !checkInDate || date <= checkInDate || date < new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Special Requests or Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or notes..."
              rows={4}
              className="resize-none"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {booking.booking_status === 'confirmed' && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleCancel}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Cancel Booking'
                )}
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || !checkInDate || !checkOutDate}
              className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Booking'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

