'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Phone, Mail, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceLocationsProps {
  locations: string[];
  className?: string;
}

export function ServiceLocations({ locations, className }: ServiceLocationsProps) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  if (!locations || locations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(className)}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-secondary/10">
              <MapPin className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-primary dark:text-white">
                Service Locations
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 mt-1">
                Available in {locations.length} location{locations.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={cn(
                  'p-4 rounded-lg border transition-all duration-200 cursor-pointer',
                  selectedLocation === location
                    ? 'border-secondary bg-secondary/5 shadow-md'
                    : 'border-gray-200 dark:border-primary-700 hover:border-secondary/50 hover:shadow-sm'
                )}
                onClick={() => setSelectedLocation(selectedLocation === location ? null : location)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-full bg-secondary/10 mt-0.5">
                      <MapPin className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary dark:text-white mb-1">
                        {location}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Damascus, Syria
                      </p>
                      {selectedLocation === location && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 pt-3 border-t border-gray-200 dark:border-primary-700"
                        >
                          <div className="space-y-2">
                            <button
                              className="flex items-center gap-2 text-sm text-secondary hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location + ', Damascus, Syria')}`, '_blank');
                              }}
                            >
                              <Navigation className="w-4 h-4" />
                              Get Directions
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0">
                    Available
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Map Link */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-primary-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              View all locations on map
            </p>
            <button
              onClick={() => {
                const query = locations.map(loc => `${loc}, Damascus, Syria`).join('|');
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`, '_blank');
              }}
              className="flex items-center gap-2 text-sm text-secondary hover:underline font-medium"
            >
              <Navigation className="w-4 h-4" />
              Open in Google Maps
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

