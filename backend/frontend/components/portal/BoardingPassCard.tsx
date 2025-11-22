'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Wifi,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { Booking } from '@/types';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BoardingPassCardProps {
  booking: Booking;
}

export function BoardingPassCard({ booking }: BoardingPassCardProps) {
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [revealed, setRevealed] = useState<{ wifi: boolean; door: boolean }>({
    wifi: false,
    door: false,
  });

  const checkIn = new Date(booking.check_in);
  const checkOut = new Date(booking.check_out);
  const today = new Date();
  const daysRemaining = differenceInDays(checkOut, today);
  const hoursRemaining = differenceInHours(checkOut, today) % 24;
  const minutesRemaining = differenceInMinutes(checkOut, today) % 60;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = checkOut.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ hours, minutes, seconds });
      } else {
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [checkOut]);

  const getWhatsAppLink = (phone: string) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hello, I need assistance with my stay at ${booking.property?.title || 'the property'}.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const getGoogleMapsLink = (address: string) => {
    if (!address) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  const toggleReveal = (type: 'wifi' | 'door') => {
    setRevealed((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <Card className="border-2 border-secondary/20 shadow-xl overflow-hidden bg-white relative">
      {/* Boarding Pass / Hotel Key Card Design */}
      <div className="relative">
        {/* Perforated Edge Effect */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-secondary/30 to-transparent" />
        
        {/* Header Section */}
        <div className="relative h-48 bg-linear-to-br from-primary via-primary/90 to-secondary overflow-hidden">
          {booking.property?.images && booking.property.images.length > 0 ? (
            <Image
              src={booking.property.images[0]}
              alt={booking.property.title || 'Property'}
              fill
              className="object-cover opacity-40"
            />
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/40 to-transparent" />
          
          <div className="relative z-10 p-6 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-green-500 text-white text-sm px-3 py-1 mb-2">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Active Stay
                </Badge>
                <h2 className="text-2xl font-bold mb-1">{booking.property?.title || 'Property'}</h2>
                <p className="text-white/90 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {booking.property?.neighborhood?.name || 'Damascus'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/80 mb-1">Booking Reference</p>
                <p className="text-sm font-mono font-semibold">#{booking.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Countdown Timer - Prominently Displayed */}
          <div className="bg-linear-to-r from-secondary/10 via-primary/10 to-secondary/10 rounded-xl p-6 border-2 border-secondary/20">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/20 rounded-full p-3">
                  <Clock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Time Remaining</p>
                  <p className="text-xs text-gray-500">Until check-out</p>
                </div>
              </div>
              <Badge className="bg-secondary text-white px-3 py-1 text-sm font-semibold">
                {daysRemaining} {daysRemaining === 1 ? 'Day' : 'Days'}
              </Badge>
            </div>
            
            {/* Live Countdown */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center bg-white/50 rounded-lg p-4 border border-secondary/10">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {countdown.hours.toString().padStart(2, '0')}
                </p>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Hours</p>
              </div>
              <div className="text-center bg-white/50 rounded-lg p-4 border border-secondary/10">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {countdown.minutes.toString().padStart(2, '0')}
                </p>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Minutes</p>
              </div>
              <div className="text-center bg-white/50 rounded-lg p-4 border border-secondary/10">
                <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {countdown.seconds.toString().padStart(2, '0')}
                </p>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Seconds</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-secondary/10 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Check-in: <span className="font-semibold text-primary">{format(checkIn, 'MMM d, yyyy')}</span>
              </span>
              <span className="text-gray-600">
                Check-out: <span className="font-semibold text-primary">{format(checkOut, 'MMM d, yyyy')}</span>
              </span>
            </div>
          </div>

          {/* Access Information - Hidden Behind Reveal Button */}
          {booking.property?.tenant_details && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Key className="w-5 h-5" />
                Access Information
              </h3>

              {/* WiFi Password - Reveal Button */}
              {booking.property.tenant_details.wifi_password && (
                <Card className="bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-200">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500 rounded-lg p-2">
                          <Wifi className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">WiFi Password</p>
                          <p className="text-xs text-gray-500">Network name</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReveal('wifi')}
                        className="h-8 px-3 text-xs"
                      >
                        {revealed.wifi ? (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Reveal
                          </>
                        )}
                      </Button>
                    </div>
                    <AnimatePresence mode="wait">
                      {revealed.wifi ? (
                        <motion.div
                          key="revealed"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white rounded-lg p-3 border border-blue-200"
                        >
                          <p className="text-xl font-bold text-primary font-mono text-center">
                            {booking.property.tenant_details.wifi_password}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-white/50 rounded-lg p-3 border border-blue-200"
                        >
                          <p className="text-sm text-gray-500 text-center font-mono">
                            ••••••••••••
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              )}

              {/* Door Code - Reveal Button */}
              {booking.property.tenant_details.door_code && (
                <Card className="bg-linear-to-br from-green-50 to-green-100/50 border-green-200">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500 rounded-lg p-2">
                          <Key className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">Door Code</p>
                          <p className="text-xs text-gray-500">Entry code</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleReveal('door')}
                        className="h-8 px-3 text-xs"
                      >
                        {revealed.door ? (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Reveal
                          </>
                        )}
                      </Button>
                    </div>
                    <AnimatePresence mode="wait">
                      {revealed.door ? (
                        <motion.div
                          key="revealed"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="bg-white rounded-lg p-3 border border-green-200"
                        >
                          <p className="text-xl font-bold text-primary font-mono text-center">
                            {booking.property.tenant_details.door_code}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-white/50 rounded-lg p-3 border border-green-200"
                        >
                          <p className="text-sm text-gray-500 text-center font-mono">
                            ••••
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              )}

              {/* Full Address */}
              {booking.property.tenant_details.full_address && (
                <Card className="bg-linear-to-br from-purple-50 to-purple-100/50 border-purple-200">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="bg-purple-500 rounded-lg p-2">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Full Address</p>
                        <p className="text-sm text-gray-700">{booking.property.tenant_details.full_address}</p>
                      </div>
                    </div>
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
                </Card>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
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
                    WhatsApp Agent
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
            >
              <Calendar className="w-5 h-5 mr-2" />
              Request Checkout
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

