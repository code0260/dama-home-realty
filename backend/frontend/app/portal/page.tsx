'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getMyBookings, getMyServices } from '@/lib/api';
import { Booking } from '@/types';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import {
  Calendar,
  Home,
  AlertCircle,
  Sparkles,
  Phone,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { BoardingPassCard } from '@/components/portal/BoardingPassCard';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TenantPortalPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use refs to prevent multiple redirects and track component mount status
  const hasRedirectedRef = useRef(false);
  const isMountedRef = useRef(true);
  const hasFetchedDataRef = useRef(false);

  const fetchBookings = useCallback(async () => {
    try {
      setError(null);
      const response = await getMyBookings();
      if (isMountedRef.current) {
        setBookings(response.data || []);
      }
    } catch (err: any) {
      console.error('Error fetching bookings:', err);
      if (err.response?.status === 401) {
        // Session expired or not authenticated
        if (isMountedRef.current && !hasRedirectedRef.current) {
          hasRedirectedRef.current = true;
          if (typeof window !== 'undefined') {
            window.location.href = '/login?redirect=/portal';
          } else {
            router.push('/login?redirect=/portal');
          }
        }
      } else if (isMountedRef.current) {
        setError('Failed to load bookings');
      }
    }
  }, [router]);

  const fetchServices = useCallback(async () => {
    try {
      const data = await getMyServices();
      if (isMountedRef.current) {
        setServices(data || []);
      }
    } catch (err: any) {
      console.error('Error fetching services:', err);
    }
  }, []);

  // Handle authentication and data fetching
  useEffect(() => {
    isMountedRef.current = true;

    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // If not authenticated, redirect once
    if (!isAuthenticated) {
      if (!hasRedirectedRef.current && isMountedRef.current) {
        hasRedirectedRef.current = true;
        // Use window.location to ensure full page reload
        if (typeof window !== 'undefined') {
          window.location.href = '/login?redirect=/portal';
        } else {
          router.push('/login?redirect=/portal');
        }
      }
      return;
    }

    // If authenticated and haven't fetched data yet, fetch it
    if (isAuthenticated && !hasFetchedDataRef.current) {
      hasFetchedDataRef.current = true;
      Promise.all([fetchBookings(), fetchServices()]).finally(() => {
        if (isMountedRef.current) {
          setLoading(false);
        }
      });
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [isAuthenticated, authLoading, router, fetchBookings, fetchServices]);

  // Get active booking (current stay)
  const activeBooking = bookings.find((booking) => {
    if (booking.booking_status !== 'confirmed') return false;
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const today = new Date();
    return isAfter(today, checkIn) && isBefore(today, checkOut);
  });

  // Get upcoming bookings
  const upcomingBookings = bookings.filter((booking) => {
    if (booking.booking_status !== 'confirmed') return false;
    const checkIn = new Date(booking.check_in);
    const today = new Date();
    return isAfter(checkIn, today);
  });

  // Get past bookings
  const pastBookings = bookings.filter((booking) => {
    const checkOut = new Date(booking.check_out);
    const today = new Date();
    return isAfter(today, checkOut) || booking.booking_status === 'completed';
  });

  // Show loading while auth is checking or data is loading
  if (authLoading || loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex">
        <div className="hidden lg:block w-64 border-r border-gray-200">
          <Skeleton className="h-screen w-full" />
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <PortalSidebar currentSection="bookings" />
        <div className="flex-1 p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <PortalSidebar currentSection="bookings" />

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <PortalSidebar currentSection="bookings" />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header with Welcome Message */}
        <div className="bg-linear-to-r from-primary via-primary/95 to-secondary/20 text-white py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                Welcome back,{' '}
                <span className="bg-linear-to-r from-white via-secondary/90 to-secondary bg-clip-text text-transparent">
                  {user?.name || 'Guest'}
                </span>
              </h1>
              <p className="text-white/90 text-lg md:text-xl">
                Here's everything you need for your stay
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Active Stay - Boarding Pass Card */}
          {activeBooking && (
            <div className="mb-8">
              <BoardingPassCard booking={activeBooking} />
            </div>
          )}

          {/* Upcoming Bookings */}
          {upcomingBookings.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Upcoming Stays
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          )}

          {/* My Services Section */}
          {services.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                My Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </section>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-primary mb-4">Past Stays</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          )}

          {/* No Bookings */}
          {bookings.length === 0 && (
            <Card className="shadow-lg">
              <CardContent className="py-16 text-center">
                <Home className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-2 text-primary">No Active Stays</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  You don't have any bookings yet. Contact us to arrange your stay!
                </p>
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                  <Link href="/properties">Browse Properties</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

// Service Card Component with Status Badges
function ServiceCard({ service }: { service: any }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'closed':
      case 'completed':
        return (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            Done
          </Badge>
        );
      case 'contacted':
      case 'in_progress':
        return (
          <Badge className="bg-blue-500 text-white hover:bg-blue-600">
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
            Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary">Service Request</CardTitle>
          {getStatusBadge(service.status)}
        </div>
        <CardDescription>
          {new Date(service.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 line-clamp-3">{service.message}</p>
      </CardContent>
    </Card>
  );
}

// Booking Card Component
function BookingCard({ booking }: { booking: Booking }) {
  const getStatusBadge = () => {
    switch (booking.booking_status) {
      case 'confirmed':
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 text-white">Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-gray-200">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-primary">
              {booking.property?.title || 'Property'}
            </CardTitle>
            <CardDescription>
              {booking.property?.neighborhood?.name || 'Damascus'}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span>
            {format(new Date(booking.check_in), 'MMM d')} -{' '}
            {format(new Date(booking.check_out), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            {differenceInDays(new Date(booking.check_out), new Date(booking.check_in))} nights
          </span>
          <span className="font-semibold text-primary">
            {booking.total_price.toLocaleString()} {booking.property?.currency || 'USD'}
          </span>
        </div>
        {booking.payment_status === 'pending' && (
          <Button
            asChild
            variant="outline"
            className="w-full"
            size="sm"
          >
            <Link href={`/bookings/${booking.id}/payment`}>Complete Payment</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
