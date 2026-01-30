'use client';

import { MapPin, Users, Home, TrendingUp, Coffee, DollarSign } from 'lucide-react';
import { Property } from '@/types';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface NeighborhoodInfoProps {
  property: Property;
  neighborhoodStats?: {
    averagePrice?: number;
    propertyCount?: number;
    popularity?: number;
    amenities?: string[];
  };
}

export function NeighborhoodInfo({ property, neighborhoodStats }: NeighborhoodInfoProps) {
  const { t, locale } = useLanguage();
  const neighborhood = property.neighborhood;
  
  if (!neighborhood) return null;

  // Mock stats if not provided
  const stats = neighborhoodStats || {
    averagePrice: property.price * 0.9,
    propertyCount: 25,
    popularity: 85,
    amenities: ['Restaurants', 'Schools', 'Parks', 'Shopping'],
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-secondary/10 rounded-lg">
          <MapPin className="w-6 h-6 text-secondary" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-primary dark:text-white">
            {neighborhood.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {t('common.damascus')}, {t('common.syria')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gray-50 dark:bg-primary-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-secondary" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Avg. Price</span>
            </div>
            <p className="text-lg font-bold text-primary dark:text-white">
              {stats.averagePrice 
                ? new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: property.currency || 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(stats.averagePrice)
                : 'N/A'}
            </p>
          </div>

        <div className="p-4 bg-gray-50 dark:bg-primary-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-secondary" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Properties</span>
          </div>
          <p className="text-lg font-bold text-primary dark:text-white">
            {stats.propertyCount || 0}
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-primary-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Popularity</span>
          </div>
          <p className="text-lg font-bold text-primary dark:text-white">
            {stats.popularity || 0}%
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-primary-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Coffee className="w-5 h-5 text-secondary" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Nearby</span>
          </div>
          <p className="text-sm font-semibold text-primary dark:text-white">
            {stats.amenities?.length || 0} Places
          </p>
        </div>
      </div>

      {stats.amenities && stats.amenities.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Nearby Amenities
          </h4>
          <div className="flex flex-wrap gap-2">
            {stats.amenities.map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
