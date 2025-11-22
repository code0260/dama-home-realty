'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Booking } from '@/types';
import {
  Calendar,
  Filter,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import Link from 'next/link';
import { BookingCard } from './BookingCard';
import { cn } from '@/lib/utils';

interface BookingHistoryProps {
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
}

export function BookingHistory({ bookings, onBookingClick }: BookingHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.property?.neighborhood?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.id.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.booking_status === statusFilter);
    }

    // Date filter
    const today = new Date();
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter((booking) => {
        if (booking.booking_status !== 'confirmed') return false;
        const checkIn = new Date(booking.check_in);
        return isAfter(checkIn, today);
      });
    } else if (dateFilter === 'past') {
      filtered = filtered.filter((booking) => {
        const checkOut = new Date(booking.check_out);
        return isAfter(today, checkOut) || booking.booking_status === 'completed';
      });
    } else if (dateFilter === 'current') {
      filtered = filtered.filter((booking) => {
        if (booking.booking_status !== 'confirmed') return false;
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        return isAfter(today, checkIn) && isBefore(today, checkOut);
      });
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const bookingStats = useMemo(() => {
    return {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.booking_status === 'confirmed').length,
      pending: bookings.filter((b) => b.booking_status === 'pending').length,
      cancelled: bookings.filter((b) => b.booking_status === 'cancelled').length,
      completed: bookings.filter((b) => b.booking_status === 'completed').length,
    };
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-2 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-secondary" />
            Booking History
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all your bookings
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            Total: {bookingStats.total}
          </Badge>
          <Badge className="bg-green-500 text-white px-3 py-1">
            Confirmed: {bookingStats.confirmed}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 dark:border-primary-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Grid */}
      {filteredBookings.length === 0 ? (
        <Card className="border-gray-200 dark:border-primary-700">
          <CardContent className="py-16 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'You don\'t have any bookings yet'}
            </p>
            {!searchTerm && statusFilter === 'all' && dateFilter === 'all' && (
              <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link href="/properties">Browse Properties</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onBookingClick?.(booking)}
              className="cursor-pointer"
            >
              <BookingCard booking={booking} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

