'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Booking } from '@/types';
import {
  Calendar,
  Home,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { cn } from '@/lib/utils';

interface DashboardOverviewProps {
  bookings: Booking[];
  services: any[];
  userName?: string;
}

export function DashboardOverview({ bookings, services, userName }: DashboardOverviewProps) {
  const stats = useMemo(() => {
    const today = new Date();
    
    // Active bookings (currently staying)
    const activeBookings = bookings.filter((booking) => {
      if (booking.booking_status !== 'confirmed') return false;
      const checkIn = new Date(booking.check_in);
      const checkOut = new Date(booking.check_out);
      return isAfter(today, checkIn) && isBefore(today, checkOut);
    });

    // Upcoming bookings
    const upcomingBookings = bookings.filter((booking) => {
      if (booking.booking_status !== 'confirmed') return false;
      const checkIn = new Date(booking.check_in);
      return isAfter(checkIn, today);
    });

    // Past bookings
    const pastBookings = bookings.filter((booking) => {
      const checkOut = new Date(booking.check_out);
      return isAfter(today, checkOut) || booking.booking_status === 'completed';
    });

    // Total spent
    const totalSpent = bookings
      .filter((b) => b.payment_status === 'paid' || b.payment_status === 'partial')
      .reduce((sum, booking) => sum + (booking.amount_paid || 0), 0);

    // Active services
    const activeServices = services.filter(
      (s) => s.status === 'contacted' || s.status === 'in_progress'
    );

    // Pending services
    const pendingServices = services.filter((s) => s.status === 'new' || s.status === 'pending');

    // Completed services
    const completedServices = services.filter(
      (s) => s.status === 'closed' || s.status === 'completed'
    );

    return {
      activeBookings: activeBookings.length,
      upcomingBookings: upcomingBookings.length,
      pastBookings: pastBookings.length,
      totalSpent,
      activeServices: activeServices.length,
      pendingServices: pendingServices.length,
      completedServices: completedServices.length,
      totalBookings: bookings.length,
      totalServices: services.length,
    };
  }, [bookings, services]);

  const statCards = [
    {
      title: 'Active Stays',
      value: stats.activeBookings,
      icon: Home,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-400',
    },
    {
      title: 'Upcoming Bookings',
      value: stats.upcomingBookings,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-400',
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-secondary',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
    },
    {
      title: 'Active Services',
      value: stats.activeServices,
      icon: Sparkles,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-2">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's a summary of your bookings and services
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow border-gray-200 dark:border-primary-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-primary dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={cn('p-3 rounded-lg', stat.bgColor)}>
                      <Icon className={cn('w-6 h-6', stat.textColor)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-gray-200 dark:border-primary-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary dark:text-white">
              {stats.totalBookings}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-primary-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary dark:text-white">
              {stats.pastBookings}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Past Stays</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-primary-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary dark:text-white">
              {stats.totalServices}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Services</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 dark:border-primary-700">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary dark:text-white">
              {stats.completedServices}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

