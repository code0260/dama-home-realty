'use client';

import { useEffect, useState, Suspense } from 'react';
import { Property, PaginatedResponse } from '@/types';
import { FeaturedPropertiesClient } from './FeaturedPropertiesClient';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import axiosInstance from '@/lib/axios';
import { AlertCircle } from 'lucide-react';

function FeaturedPropertiesLoader() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedPropertiesContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setError(null);
        const response = await axiosInstance.get<PaginatedResponse<Property>>('/properties', {
          params: {
            featured: true,
            status: 'active',
            per_page: 6,
            locale: 'en',
          },
        });
        // Handle both response formats
        const properties = response.data?.data || (Array.isArray(response.data) ? response.data : []);
        setProperties(properties);
      } catch (err: any) {
        console.error('Error fetching featured properties:', err);
        // Handle network errors gracefully
        if (err.isNetworkError || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED' || err.message === 'Network Error') {
          setError('Unable to connect to backend server. Please ensure the Laravel server is running at http://localhost:8000');
        } else if (err.isTimeoutError) {
          setError('Request timed out. The server may be slow or unreachable.');
        } else {
          setError(err.response?.data?.message || err.message || 'Failed to load featured properties');
        }
        setProperties([]); // Set empty array on error
      }
    };

    fetchFeaturedProperties();
  }, []);

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return <FeaturedPropertiesClient properties={properties} />;
}

export function FeaturedProperties() {
  return (
    <Suspense fallback={<FeaturedPropertiesLoader />}>
      <FeaturedPropertiesContent />
    </Suspense>
  );
}

