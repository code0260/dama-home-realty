'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
}

interface InteractiveMapProps {
  locations?: Location[];
  className?: string;
}

const defaultLocations: Location[] = [
  {
    id: 1,
    name: 'Main Office - Damascus',
    address: 'Damascus, Syria',
    phone: '+963 123 456 789',
    email: 'info@damahome.com',
    lat: 33.5138,
    lng: 36.2765,
    hours: {
      weekdays: '9:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
  },
  {
    id: 2,
    name: 'Branch Office - Aleppo',
    address: 'Aleppo, Syria',
    phone: '+963 987 654 321',
    email: 'aleppo@damahome.com',
    lat: 36.2021,
    lng: 37.1343,
    hours: {
      weekdays: '9:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
  },
];

export function InteractiveMap({ locations = defaultLocations, className }: InteractiveMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location>(locations[0]);

  const mapUrl = useMemo(() => {
    const { lat, lng } = selectedLocation;
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDMwJzQ5LjciTiAzNsKwMTYnMzUuNCJF!5e0!3m2!1sen!2s!4v1234567890`;
  }, [selectedLocation]);

  const handleGetDirections = () => {
    const { lat, lng } = selectedLocation;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Location Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((location) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={cn(
                'cursor-pointer border-2 transition-all duration-300',
                selectedLocation.id === location.id
                  ? 'border-secondary shadow-lg'
                  : 'border-gray-200 dark:border-primary-700 hover:border-secondary/50'
              )}
              onClick={() => setSelectedLocation(location)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg flex-shrink-0">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-primary dark:text-white mb-1">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {location.address}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <Phone className="w-3 h-3" />
                      <span>{location.phone}</span>
                    </div>
                  </div>
                  {selectedLocation.id === location.id && (
                    <Badge variant="outline" className="bg-secondary/10 border-secondary">
                      Selected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Map */}
      <Card className="border-2 border-gray-200 dark:border-primary-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full h-96 md:h-[500px] bg-gray-100 dark:bg-primary-800">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={selectedLocation.name}
              className="absolute inset-0"
            />
            {/* Get Directions Button */}
            <div className="absolute bottom-4 right-4 z-10">
              <Button
                onClick={handleGetDirections}
                className="bg-white hover:bg-gray-50 text-primary shadow-lg flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Location Details */}
      <Card className="border-2 border-gray-200 dark:border-primary-700">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-primary dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-secondary" />
            {selectedLocation.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary dark:text-white mb-1">Address</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {selectedLocation.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary dark:text-white mb-1">Phone</p>
                  <a
                    href={`tel:${selectedLocation.phone}`}
                    className="text-secondary hover:underline text-sm"
                  >
                    {selectedLocation.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-primary dark:text-white mb-1">Email</p>
                  <a
                    href={`mailto:${selectedLocation.email}`}
                    className="text-secondary hover:underline text-sm"
                  >
                    {selectedLocation.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-primary dark:text-white mb-2">Office Hours</p>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday:</span>
                      <span>{selectedLocation.hours.weekdays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday:</span>
                      <span>{selectedLocation.hours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday:</span>
                      <span>{selectedLocation.hours.sunday}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

