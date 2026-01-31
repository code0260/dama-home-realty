'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

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

export function InteractiveMap({ locations, className }: InteractiveMapProps) {
  const { t, locale } = useLanguage();
  
  const defaultLocations: Location[] = [
    {
      id: 1,
      name: (() => {
        const translation = t('contact.mainOfficeDamascus');
        if (translation === 'contact.mainOfficeDamascus') {
          return locale === 'ar' ? 'المكتب الرئيسي - دمشق' : 'Main Office - Damascus';
        }
        return translation;
      })(),
      address: (() => {
        const translation = t('contact.damascusSyria');
        if (translation === 'contact.damascusSyria') {
          return locale === 'ar' ? 'دمشق، سوريا' : 'Damascus, Syria';
        }
        return translation;
      })(),
      phone: '+963 932 498 092',
      email: 'info@damahomerealty.com',
      lat: 33.5138,
      lng: 36.2765,
      hours: {
        weekdays: locale === 'ar' ? '9:00 صباحاً - 12:00 مساءً' : '9:00 AM - 12:00 PM',
        saturday: locale === 'ar' ? '9:00 صباحاً - 12:00 مساءً' : '9:00 AM - 12:00 PM',
        sunday: (() => {
          const translation = t('contact.closed');
          if (translation === 'contact.closed') {
            return locale === 'ar' ? 'مغلق' : 'Closed';
          }
          return translation;
        })(),
      },
    },
    {
      id: 2,
      name: (() => {
        const translation = t('contact.branchOfficeAleppo');
        if (translation === 'contact.branchOfficeAleppo') {
          return locale === 'ar' ? 'فرع حلب' : 'Branch Office - Aleppo';
        }
        return translation;
      })(),
      address: (() => {
        const translation = t('contact.aleppoSyria');
        if (translation === 'contact.aleppoSyria') {
          return locale === 'ar' ? 'حلب، سوريا' : 'Aleppo, Syria';
        }
        return translation;
      })(),
      phone: '+963 957 360 390',
      email: 'sales@damahomerealty.com',
      lat: 36.2021,
      lng: 37.1343,
      hours: {
        weekdays: locale === 'ar' ? '9:00 صباحاً - 12:00 مساءً' : '9:00 AM - 12:00 PM',
        saturday: locale === 'ar' ? '9:00 صباحاً - 12:00 مساءً' : '9:00 AM - 12:00 PM',
        sunday: (() => {
          const translation = t('contact.closed');
          if (translation === 'contact.closed') {
            return locale === 'ar' ? 'مغلق' : 'Closed';
          }
          return translation;
        })(),
      },
    },
  ];

  const finalLocations = locations || defaultLocations;
  const [selectedLocation, setSelectedLocation] = useState<Location>(finalLocations[0]);

  const mapUrl = useMemo(() => {
    // Use the correct Google Maps link for the company location
    // Convert short URL to embed format
    if (selectedLocation.id === 1) {
      // Main Office - Use the provided Google Maps link
      return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.5!2d36.2765!3d33.5138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDMwJzQ5LjciTiAzNsKwMTYnMzUuNCJF!5e0!3m2!1sen!2s!4v1234567890';
    }
    const { lat, lng } = selectedLocation;
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDMwJzQ5LjciTiAzNsKwMTYnMzUuNCJF!5e0!3m2!1sen!2s!4v1234567890`;
  }, [selectedLocation]);

  const handleGetDirections = () => {
    if (selectedLocation.id === 1) {
      // Main Office - Use the provided Google Maps link
      window.open('https://maps.app.goo.gl/aoGU9caGwDFDCqPMA', '_blank');
    } else {
      const { lat, lng } = selectedLocation;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Map */}
      <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="relative w-full h-64 md:h-80 bg-gray-100">
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
                className="bg-white hover:bg-gray-50 text-[#0F172A] shadow-lg border border-gray-200 flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                {(() => {
                  const translation = t('contact.getDirections');
                  if (translation === 'contact.getDirections') {
                    return locale === 'ar' ? 'احصل على الاتجاهات' : 'Get Directions';
                  }
                  return translation;
                })()}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Selector */}
      <div className="space-y-3">
        {finalLocations.map((location) => (
          <motion.div
            key={location.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={cn(
                'cursor-pointer border transition-all duration-300',
                selectedLocation.id === location.id
                  ? 'border-[#B49162] shadow-md bg-[#B49162]/5'
                  : 'border-gray-200 hover:border-[#B49162]/50 hover:shadow-sm bg-white'
              )}
              onClick={() => setSelectedLocation(location)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'p-2 rounded-lg flex-shrink-0 transition-colors',
                    selectedLocation.id === location.id
                      ? 'bg-[#B49162]'
                      : 'bg-[#B49162]/10'
                  )}>
                    <MapPin className={cn(
                      'w-5 h-5',
                      selectedLocation.id === location.id ? 'text-white' : 'text-[#B49162]'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn(
                      'font-bold mb-1',
                      selectedLocation.id === location.id ? 'text-[#B49162]' : 'text-[#0F172A]'
                    )}>
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {location.address}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Phone className="w-3 h-3" />
                      <span>{location.phone}</span>
                    </div>
                  </div>
                  {selectedLocation.id === location.id && (
                    <Badge className="bg-[#B49162] text-white border-0">
                      {(() => {
                        const translation = t('contact.selected');
                        if (translation === 'contact.selected') {
                          return locale === 'ar' ? 'محدد' : 'Selected';
                        }
                        return translation;
                      })()}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

