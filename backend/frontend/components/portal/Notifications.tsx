'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Filter,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Booking } from '@/types';

interface Notification {
  id: string;
  type: 'booking' | 'service' | 'payment' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationsProps {
  bookings: Booking[];
  services: any[];
}

export function Notifications({ bookings, services }: NotificationsProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Generate notifications from bookings and services
  useMemo(() => {
    const items: Notification[] = [];

    // Booking notifications
    bookings.forEach((booking) => {
      if (booking.booking_status === 'pending') {
        items.push({
          id: `booking-pending-${booking.id}`,
          type: 'booking',
          title: 'Booking Pending Confirmation',
          message: `Your booking for ${booking.property?.title || 'property'} is pending confirmation`,
          timestamp: booking.created_at,
          read: false,
          link: `/portal?booking=${booking.id}`,
        });
      }
      if (booking.payment_status === 'pending') {
        items.push({
          id: `payment-pending-${booking.id}`,
          type: 'payment',
          title: 'Payment Required',
          message: `Complete payment for booking #${booking.id}`,
          timestamp: booking.created_at,
          read: false,
          link: `/bookings/${booking.id}/payment`,
        });
      }
    });

    // Service notifications
    services.forEach((service) => {
      if (service.status === 'contacted' || service.status === 'in_progress') {
        items.push({
          id: `service-${service.id}`,
          type: 'service',
          title: 'Service Update',
          message: `Your service request has been updated: ${service.status}`,
          timestamp: service.updated_at || service.created_at,
          read: false,
          link: '/portal/services',
        });
      }
    });

    // Sort by timestamp (newest first)
    const sorted = items.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setNotifications(sorted);
  }, [bookings, services]);

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.read);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return CheckCircle2;
      case 'payment':
        return AlertCircle;
      case 'service':
        return Info;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-500';
      case 'payment':
        return 'bg-yellow-500';
      case 'service':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="border-gray-200 dark:border-primary-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-secondary" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white ml-2">{unreadCount}</Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'unread', 'read'] as const).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterType)}
              className={cn(
                filter === filterType &&
                  'bg-secondary hover:bg-secondary/90 text-white'
              )}
            >
              <Filter className="w-3 h-3 mr-1" />
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Button>
          ))}
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No {filter === 'all' ? '' : filter} notifications
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              <AnimatePresence>
                {filteredNotifications.map((notification, index) => {
                  const Icon = getNotificationIcon(notification.type);
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={cn(
                        'flex items-start gap-3 p-4 rounded-lg border transition-all',
                        notification.read
                          ? 'bg-gray-50 dark:bg-primary-800 border-gray-200 dark:border-primary-700'
                          : 'bg-white dark:bg-primary-900 border-secondary/20 shadow-sm',
                        'hover:shadow-md'
                      )}
                    >
                      <div
                        className={cn(
                          'p-2 rounded-lg text-white',
                          getNotificationColor(notification.type)
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p
                            className={cn(
                              'text-sm font-semibold',
                              notification.read
                                ? 'text-gray-600 dark:text-gray-400'
                                : 'text-primary dark:text-white'
                            )}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-secondary rounded-full shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDistanceToNow(new Date(notification.timestamp), {
                              addSuffix: true,
                            })}
                          </p>
                          <div className="flex gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-6 px-2 text-xs"
                              >
                                Mark as read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

