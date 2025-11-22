'use client';

import { useEffect, useState } from 'react';
import { Property } from '@/types';
import { getProperties } from '@/lib/api';
import { PropertyCard } from '@/components/ui-custom/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface SimilarPropertiesProps {
  currentProperty: Property;
  maxResults?: number;
}

export function SimilarProperties({ currentProperty, maxResults = 3 }: SimilarPropertiesProps) {
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        setLoading(true);
        setError(null);

        // Find similar properties based on:
        // 1. Same neighborhood
        // 2. Similar price range (±30%)
        // 3. Similar type
        // 4. Similar features (bedrooms, bathrooms, area)

        const filters: any = {
          status: 'active',
          per_page: maxResults + 1, // Get one extra to exclude current property
          locale: 'en',
        };

        // Filter by neighborhood if available
        if (currentProperty.neighborhood?.id) {
          filters.neighborhood_id = currentProperty.neighborhood.id;
        }

        // Filter by type
        if (currentProperty.type) {
          filters.type = currentProperty.type;
        }

        // Filter by price range (±30%)
        if (currentProperty.price) {
          const priceRange = currentProperty.price * 0.3;
          filters.min_price = Math.max(0, currentProperty.price - priceRange);
          filters.max_price = currentProperty.price + priceRange;
        }

        // Filter by bedrooms (±1)
        if (currentProperty.bedrooms) {
          filters.bedrooms = currentProperty.bedrooms;
        }

        const response = await getProperties(filters);
        
        // Exclude current property and limit results
        const filtered = (response.data || [])
          .filter((p: Property) => p.uuid !== currentProperty.uuid)
          .slice(0, maxResults);

        setSimilarProperties(filtered);
      } catch (err: any) {
        console.error('Error fetching similar properties:', err);
        setError('Failed to load similar properties');
        setSimilarProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentProperty.uuid) {
      fetchSimilar();
    }
  }, [currentProperty, maxResults]);

  if (loading) {
    return (
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

  if (similarProperties.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-primary dark:text-white">Similar Properties</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarProperties.map((property) => (
          <PropertyCard key={property.uuid} property={property} />
        ))}
      </div>
    </div>
  );
}

