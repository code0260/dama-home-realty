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
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState<PaginatedResponse<Property> | null>(null);

  const fetchFeaturedProperties = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      
      const response = await axiosInstance.get<PaginatedResponse<Property>>('/properties', {
        params: {
          featured: true,
          status: 'active',
          per_page: 6,
          page,
          locale: 'en',
        },
      });
      
      const data = response.data;
      const newProperties = data?.data || [];
      
      if (append) {
        setProperties((prev) => [...prev, ...newProperties]);
      } else {
        setProperties(newProperties);
      }
      
      setPagination(data);
      setHasMore(page < (data?.last_page || 1));
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Error fetching featured properties:', err);
      if (err.isNetworkError || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED' || err.message === 'Network Error') {
        setError('Unable to connect to backend server. Please ensure the Laravel server is running at http://localhost:8000');
      } else if (err.isTimeoutError) {
        setError('Request timed out. The server may be slow or unreachable.');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load featured properties');
      }
      if (!append) {
        setProperties([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProperties(1, false);
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchFeaturedProperties(currentPage + 1, true);
    }
  };

  if (loading) {
    return <FeaturedPropertiesLoader />;
  }

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

  return (
    <FeaturedPropertiesClient 
      properties={properties} 
      hasMore={hasMore}
      loadingMore={loadingMore}
      onLoadMore={loadMore}
    />
  );
}

export function FeaturedProperties() {
  return (
    <Suspense fallback={<FeaturedPropertiesLoader />}>
      <FeaturedPropertiesContent />
    </Suspense>
  );
}

