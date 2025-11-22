'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, ArrowLeft, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceComparisonProps {
  services: Service[];
  onClose?: () => void;
  onSelectService?: (service: Service) => void;
  className?: string;
}

const formatPrice = (price: number | null | undefined, currency: 'USD' | 'SYP' | null | undefined) => {
  if (!price) return 'N/A';
  const formattedPrice = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return currency === 'USD' ? `$${formattedPrice}` : `${formattedPrice} ${currency}`;
};

export function ServiceComparison({ services, onClose, onSelectService, className }: ServiceComparisonProps) {
  const [selectedServices, setSelectedServices] = useState<Service[]>(services.slice(0, 3));

  if (!services || services.length === 0) {
    return null;
  }

  // Get all unique features across all services
  const allFeatures = Array.from(
    new Set(
      services.flatMap((service) => {
        // Extract features from description or create from service data
        const features: string[] = [];
        if (service.price) features.push('Pricing Available');
        if (service.duration) features.push(`Duration: ${service.duration}`);
        if (service.locations && service.locations.length > 0) {
          features.push(`Locations: ${service.locations.length}`);
        }
        if (service.availability === 'available') features.push('Available Now');
        return features;
      })
    )
  );

  const comparisonFeatures = [
    { label: 'Price', key: 'price' },
    { label: 'Duration', key: 'duration' },
    { label: 'Availability', key: 'availability' },
    { label: 'Locations', key: 'locations' },
    { label: 'Category', key: 'category' },
  ];

  return (
    <section className={cn('py-12 md:py-16', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-8 h-8 text-secondary" />
              <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white">
                Compare Services
              </h2>
            </div>
            {onClose && (
              <Button variant="ghost" onClick={onClose} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Compare different services to find the best fit for your needs
          </p>
        </motion.div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <Card>
            <CardContent className="p-0">
              <div className="min-w-full">
                {/* Header Row */}
                <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-primary-800 border-b border-gray-200 dark:border-primary-700">
                  <div className="font-semibold text-primary dark:text-white">Feature</div>
                  {selectedServices.map((service, index) => (
                    <div key={service.id} className="text-center">
                      <h3 className="font-bold text-lg text-primary dark:text-white mb-1">
                        {service.title}
                      </h3>
                      {service.category && (
                        <Badge variant="outline" className="text-xs">
                          {service.category}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {/* Feature Rows */}
                {comparisonFeatures.map((feature, featureIndex) => (
                  <div
                    key={feature.key}
                    className={cn(
                      'grid grid-cols-4 gap-4 p-6 border-b border-gray-200 dark:border-primary-700',
                      'hover:bg-gray-50 dark:hover:bg-primary-800/50 transition-colors',
                      featureIndex % 2 === 0 && 'bg-white dark:bg-primary-900/30'
                    )}
                  >
                    <div className="font-medium text-gray-700 dark:text-gray-300">
                      {feature.label}
                    </div>
                    {selectedServices.map((service) => {
                      let value: React.ReactNode = 'N/A';
                      let icon: React.ReactNode = null;

                      switch (feature.key) {
                        case 'price':
                          value = formatPrice(service.price, service.currency);
                          break;
                        case 'duration':
                          value = service.duration || 'N/A';
                          break;
                        case 'availability':
                          const availabilityMap: Record<string, { text: string; color: string }> = {
                            available: { text: 'Available', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
                            limited: { text: 'Limited', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
                            unavailable: { text: 'Unavailable', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
                          };
                          const availability = service.availability
                            ? availabilityMap[service.availability] || { text: 'N/A', color: '' }
                            : { text: 'N/A', color: '' };
                          value = (
                            <Badge className={cn('text-xs', availability.color)}>
                              {availability.text}
                            </Badge>
                          );
                          break;
                        case 'locations':
                          value = service.locations && service.locations.length > 0
                            ? `${service.locations.length} location(s)`
                            : 'N/A';
                          break;
                        case 'category':
                          value = service.category || 'N/A';
                          break;
                      }

                      return (
                        <div key={service.id} className="text-center text-gray-700 dark:text-gray-300">
                          {value}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Description Row */}
                <div className="grid grid-cols-4 gap-4 p-6">
                  <div className="font-medium text-gray-700 dark:text-gray-300">Description</div>
                  {selectedServices.map((service) => (
                    <div key={service.id} className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {service.description || 'No description available'}
                    </div>
                  ))}
                </div>

                {/* Action Row */}
                <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-primary-800 border-t border-gray-200 dark:border-primary-700">
                  <div></div>
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-center">
                      <Button
                        onClick={() => onSelectService?.(service)}
                        className="bg-secondary hover:bg-secondary/90 w-full"
                        size="sm"
                      >
                        Select Service
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

