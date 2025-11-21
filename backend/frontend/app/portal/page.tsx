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
import { format, differenceInDays, isAfter, isBefore, differenceInCalendarDays } from 'date-fns';
import {
  Calendar,
  Home,
  Clock,
  MapPin,
  Wifi,
  Key,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Navigation,
  Phone,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function TenantPortalPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-linear-to-br from-primary/5 via-white to-secondary/5">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-br from-primary/5 via-white to-secondary/5">
        {/* Premium Header */}
        <div className="bg-linear-to-r from-primary via-primary/95 to-secondary/20 text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-secondary" />
              <h1 className="text-4xl font-bold">Your Stay Dashboard</h1>
            </div>
            <p className="text-gray-200 text-lg">Welcome back! Here's everything you need for your stay.</p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Active Stay - Premium Card */}
          {activeBooking && (
            <div className="mb-8">
              <ActiveStayCard booking={activeBooking} />
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
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/properties">Browse Properties</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
    </div>
  );
}

// Premium Active Stay Card Component
function ActiveStayCard({ booking }: { booking: Booking }) {
  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const today = new Date();
  const totalDays = differenceInCalendarDays(checkOut, checkIn);
  const daysElapsed = differenceInCalendarDays(today, checkIn);
  const daysRemaining = differenceInDays(checkOut, today);
  const progress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));

  const getWhatsAppLink = (phone: string) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(`Hello, I need assistance with my stay at ${booking.property?.title || 'the property'}.`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const getGoogleMapsLink = (address: string) => {
    if (!address) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  return (
    <Card className="border-2 border-secondary shadow-2xl overflow-hidden">
      {/* Header with Property Image */}
      <div className="relative h-48 bg-linear-to-br from-primary to-secondary">
        {booking.property?.images && booking.property.images.length > 0 ? (
          <Image
            src={booking.property.images[0]}
            alt={booking.property.title || 'Property'}
            fill
            className="object-cover opacity-80"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-1">You are staying at</h2>
              <p className="text-xl font-semibold">{booking.property?.title || 'Property'}</p>
              <p className="text-sm text-gray-200 mt-1">
                {booking.property?.neighborhood?.name || 'Damascus'}
              </p>
            </div>
            <Badge className="bg-green-500 text-white text-lg px-4 py-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Active Stay
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Countdown & Timeline */}
        <div className="bg-linear-to-r from-secondary/10 to-primary/10 rounded-xl p-6 border border-secondary/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-secondary/20 rounded-full p-3">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Days Remaining</p>
                <p className="text-4xl font-bold text-secondary">{daysRemaining}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Check-out</p>
              <p className="text-lg font-semibold text-primary">
                {format(checkOut, 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          {/* Stay Timeline Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>{format(checkIn, 'MMM d')}</span>
              <span className="font-semibold">Today</span>
              <span>{format(checkOut, 'MMM d')}</span>
            </div>
            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-linear-to-r from-secondary to-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-secondary rounded-full border-4 border-white shadow-lg"
                style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{daysElapsed} days elapsed</span>
              <span>{totalDays} total days</span>
            </div>
          </div>
        </div>

        {/* Private Access Information */}
        {booking.property?.tenant_details && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
              <Key className="w-5 h-5" />
              Private Access Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booking.property.tenant_details.wifi_password && (
                <Card className="bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-500 rounded-lg p-2">
                        <Wifi className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">WiFi Password</p>
                        <p className="text-xl font-bold text-primary font-mono">
                          {booking.property.tenant_details.wifi_password}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {booking.property.tenant_details.door_code && (
                <Card className="bg-linear-to-br from-green-50 to-green-100/50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500 rounded-lg p-2">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Door Code</p>
                        <p className="text-xl font-bold text-primary font-mono">
                          {booking.property.tenant_details.door_code}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {booking.property.tenant_details.full_address && (
              <Card className="bg-linear-to-br from-purple-50 to-purple-100/50 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500 rounded-lg p-2">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Full Address</p>
                      <p className="font-semibold text-primary mb-2">
                        {booking.property.tenant_details.full_address}
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <a
                          href={getGoogleMapsLink(booking.property.tenant_details.full_address)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Open in Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {booking.property.tenant_details.house_rules && (
              <Card className="bg-linear-to-br from-amber-50 to-amber-100/50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-500 rounded-lg p-2">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2 font-semibold">House Rules</p>
                      <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {booking.property.tenant_details.house_rules}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          {booking.property?.agent?.phone && (
            <>
              <Button
                asChild
                className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                size="lg"
              >
                <a
                  href={getWhatsAppLink(booking.property.agent.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Agent via WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <a href={`tel:${booking.property.agent.phone}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  Call Agent
                </a>
              </Button>
            </>
          )}
          <Button
            variant="outline"
            className="flex-1"
            size="lg"
            onClick={() => {
              alert('Checkout instructions will be sent to your email');
            }}
          >
            <Calendar className="w-5 h-5 mr-2" />
            Request Checkout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Service Card Component
function ServiceCard({ service }: { service: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed':
        return 'bg-green-500 text-white';
      case 'contacted':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-yellow-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'closed':
        return 'Completed';
      case 'contacted':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Service Request</CardTitle>
          <Badge className={getStatusColor(service.status)}>
            {getStatusText(service.status)}
          </Badge>
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
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
          <span className="font-semibold">
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
