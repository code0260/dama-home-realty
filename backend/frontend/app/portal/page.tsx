'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getMyBookings, getMyServices, getCurrentUser } from '@/lib/api';
import { Booking } from '@/types';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import {
  Calendar,
  Home,
  AlertCircle,
  Sparkles,
  Phone,
  MessageCircle,
  Menu,
  LayoutDashboard,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { PortalSidebar } from '@/components/portal/PortalSidebar';
import { BoardingPassCard } from '@/components/portal/BoardingPassCard';
import { DashboardOverview } from '@/components/portal/DashboardOverview';
import { QuickActions } from '@/components/portal/QuickActions';
import { RecentActivity } from '@/components/portal/RecentActivity';
import { Notifications } from '@/components/portal/Notifications';
import { ProfileCompletion } from '@/components/portal/ProfileCompletion';
import { BookingCalendar } from '@/components/portal/BookingCalendar';
import { BookingHistory } from '@/components/portal/BookingHistory';
import { BookingDetails } from '@/components/portal/BookingDetails';
import { BookingModification } from '@/components/portal/BookingModification';
import { ServiceRequests } from '@/components/portal/ServiceRequests';
import { ServiceStatus } from '@/components/portal/ServiceStatus';
import { ServiceHistory } from '@/components/portal/ServiceHistory';
import { ServiceRatings } from '@/components/portal/ServiceRatings';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function TenantPortalPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [bookingDetailsOpen, setBookingDetailsOpen] = useState(false);
  const [bookingModificationOpen, setBookingModificationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Services
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6 mt-6">
              {/* Profile Completion */}
              <ProfileCompletion user={user} />

              {/* Dashboard Overview */}
              <DashboardOverview bookings={bookings} services={services} userName={user?.name} />

              {/* Quick Actions */}
              <QuickActions />

              {/* Main Grid: Recent Activity & Notifications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivity bookings={bookings} services={services} />
                <Notifications bookings={bookings} services={services} />
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6 mt-6">
              {/* Active Stay - Boarding Pass Card */}
              {activeBooking && (
                <div className="mb-8">
                  <BoardingPassCard booking={activeBooking} />
                </div>
              )}

              {/* Booking Calendar */}
              <BookingCalendar bookings={bookings} />

              {/* Booking History */}
              <BookingHistory
                bookings={bookings}
                onBookingClick={(booking) => {
                  setSelectedBooking(booking);
                  setBookingDetailsOpen(true);
                }}
              />
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6 mt-6">
              {/* Service Requests */}
              <ServiceRequests
                services={services}
                onServiceClick={(service) => setSelectedService(service)}
              />

              {/* Service Details */}
              {selectedService && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ServiceStatus service={selectedService} />
                  <ServiceRatings
                    service={selectedService}
                    onRatingSubmitted={() => {
                      // Refresh services after rating
                      fetchServices();
                    }}
                  />
                </div>
              )}

              {/* Service History */}
              <ServiceHistory
                services={services}
                onServiceClick={(service) => setSelectedService(service)}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Booking Details Dialog */}
        <BookingDetails
          booking={selectedBooking}
          open={bookingDetailsOpen}
          onOpenChange={setBookingDetailsOpen}
          onModify={(booking) => {
            setSelectedBooking(booking);
            setBookingDetailsOpen(false);
            setBookingModificationOpen(true);
          }}
        />

        {/* Booking Modification Dialog */}
        <BookingModification
          booking={selectedBooking}
          open={bookingModificationOpen}
          onOpenChange={setBookingModificationOpen}
          onSuccess={() => {
            // Refresh bookings after modification
            fetchBookings();
            setSelectedBooking(null);
          }}
        />
      </main>
    </div>
  );
}

