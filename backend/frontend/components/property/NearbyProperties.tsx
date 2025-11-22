'use client';

import { useEffect, useState } from 'react';
import { Property } from '@/types';
import { getProperties } from '@/lib/api';
import { PropertyCard } from '@/components/ui-custom/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { MapPin, AlertCircle } from 'lucide-react';

interface NearbyPropertiesProps {
  currentProperty: Property;
  maxResults?: number;
}

export function NearbyProperties({ currentProperty, maxResults = 3 }: NearbyPropertiesProps) {
  const [nearbyProperties, setNearbyProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        setLoading(true);
        setError(null);

        // Find nearby properties in the same neighborhood
        const filters: any = {
          status: 'active',
          per_page: maxResults + 1, // Get one extra to exclude current property
          locale: 'en',
        };

        // Filter by same neighborhood
        if (currentProperty.neighborhood?.id) {
          filters.neighborhood_id = currentProperty.neighborhood.id;
        }

        const response = await getProperties(filters);
        
        // Exclude current property and limit results
        const filtered = (response.data || [])
          .filter((p: Property) => p.uuid !== currentProperty.uuid)
          .slice(0, maxResults);

        setNearbyProperties(filtered);
      } catch (err: any) {
        console.error('Error fetching nearby properties:', err);
        setError('Failed to load nearby properties');
        setNearbyProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentProperty.neighborhood?.id) {
      fetchNearby();
    } else {
      setLoading(false);
    }
  }, [currentProperty, maxResults]);

  if (!currentProperty.neighborhood?.id) {
    return null;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-primary dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-secondary" />
          Nearby Properties in {currentProperty.neighborhood?.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(maxResults)].map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-xl">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 text-gray-500 py-8">
        <AlertCircle className="w-5 h-5" />
        <p>{error}</p>
      </div>
    );
  }

  if (nearbyProperties.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-primary dark:text-white flex items-center gap-2">
        <MapPin className="w-6 h-6 text-secondary" />
        Nearby Properties in {currentProperty.neighborhood?.name}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nearbyProperties.map((property) => (
          <PropertyCard key={property.uuid} property={property} />
        ))}
      </div>
    </div>
  );
}

