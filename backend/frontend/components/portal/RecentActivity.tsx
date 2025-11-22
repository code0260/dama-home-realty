'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Booking } from '@/types';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  bookings: Booking[];
  services: any[];
  limit?: number;
}

interface ActivityItem {
  id: string;
  type: 'booking' | 'service';
  title: string;
  description: string;
  timestamp: string;
  status: string;
  icon: React.ElementType;
  color: string;
}

export function RecentActivity({ bookings, services, limit = 10 }: RecentActivityProps) {
  const activities = useMemo(() => {
    const items: ActivityItem[] = [];

    // Add booking activities
    bookings
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit / 2)
      .forEach((booking) => {
        items.push({
          id: `booking-${booking.id}`,
          type: 'booking',
          title: booking.property?.title || 'Property Booking',
          description: `Booking ${booking.booking_status}`,
          timestamp: booking.updated_at,
          status: booking.booking_status,
          icon: Calendar,
          color:
            booking.booking_status === 'confirmed'
              ? 'text-green-600'
              : booking.booking_status === 'cancelled'
              ? 'text-red-600'
              : 'text-yellow-600',
        });
      });

    // Add service activities
    services
      .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
      .slice(0, limit / 2)
      .forEach((service) => {
        items.push({
          id: `service-${service.id}`,
          type: 'service',
          title: 'Service Request',
          description: service.message || 'Service request updated',
          timestamp: service.updated_at || service.created_at,
          status: service.status,
          icon: Sparkles,
          color:
            service.status === 'completed' || service.status === 'closed'
              ? 'text-green-600'
              : service.status === 'in_progress' || service.status === 'contacted'
              ? 'text-blue-600'
              : 'text-yellow-600',
        });
      });

    // Sort all activities by timestamp
    return items
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }, [bookings, services, limit]);

  const getStatusBadge = (status: string, type: 'booking' | 'service') => {
    if (type === 'booking') {
      switch (status) {
        case 'confirmed':
          return (
            <Badge className="bg-green-500 text-white text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Confirmed
            </Badge>
          );
        case 'cancelled':
          return (
            <Badge className="bg-red-500 text-white text-xs">
              <XCircle className="w-3 h-3 mr-1" />
              Cancelled
            </Badge>
          );
        default:
          return (
            <Badge className="bg-yellow-500 text-white text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Pending
            </Badge>
          );
      }
    } else {
      switch (status) {
        case 'completed':
        case 'closed':
          return (
            <Badge className="bg-green-500 text-white text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Done
            </Badge>
          );
        case 'in_progress':
        case 'contacted':
          return (
            <Badge className="bg-blue-500 text-white text-xs">
              <Clock className="w-3 h-3 mr-1" />
              In Progress
            </Badge>
          );
        default:
          return (
            <Badge className="bg-yellow-500 text-white text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Pending
            </Badge>
          );
      }
    }
  };

  if (activities.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-primary-700">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-secondary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            No recent activity
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-primary-700">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-secondary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-primary-800 transition-colors"
                >
                  <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-primary-700', activity.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-primary dark:text-white truncate">
                        {activity.title}
                      </p>
                      {getStatusBadge(activity.status, activity.type)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

