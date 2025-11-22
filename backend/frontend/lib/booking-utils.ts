import { differenceInDays } from 'date-fns';
import { Booking } from '@/types';

/**
 * Calculate number of nights between check-in and check-out dates
 */
export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
  const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
  
  // Set time to midnight to ensure accurate day calculation
  checkInDate.setHours(0, 0, 0, 0);
  checkOutDate.setHours(0, 0, 0, 0);
  
  const nights = differenceInDays(checkOutDate, checkInDate);
  return Math.max(0, nights); // Ensure non-negative
}

/**
 * Get nights from booking (calculate if not available)
 */
export function getBookingNights(booking: Booking): number {
  if (booking.nights !== undefined && booking.nights !== null) {
    return booking.nights;
  }
  return calculateNights(booking.check_in, booking.check_out);
}

