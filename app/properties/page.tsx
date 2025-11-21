'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Property, PaginatedResponse } from '@/types';
import { getProperties } from '@/lib/api';
import { PropertyCard } from '@/components/ui-custom/PropertyCard';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { NoResults } from '@/components/empty/NoResults';
import { Filter, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Property> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Get current filters from URL
  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Build filters from URL params
        const filters: any = {
          status: 'active',
          per_page: 12,
          page: currentPage,
          locale: 'en',
        };

        // Add filters from URL
        const type = searchParams.get('type');
        if (type) filters.type = type;

        const neighborhoodId = searchParams.get('neighborhood_id');
        if (neighborhoodId) filters.neighborhood_id = parseInt(neighborhoodId);

        const minPrice = searchParams.get('min_price');
        if (minPrice) filters.min_price = parseFloat(minPrice);

        const maxPrice = searchParams.get('max_price');
        if (maxPrice) filters.max_price = parseFloat(maxPrice);

        const bedrooms = searchParams.get('bedrooms');
        if (bedrooms && bedrooms !== 'all') filters.bedrooms = parseInt(bedrooms);

        const bathrooms = searchParams.get('bathrooms');
        if (bathrooms && bathrooms !== 'all') filters.bathrooms = parseInt(bathrooms);

        // Note: Search and amenities would need backend support
        // For now, we'll skip them or implement client-side filtering

        const response = await getProperties(filters);
        
        // Apply sorting
        let sortedData = response.data || [];
        if (sortBy === 'price_low') {
          sortedData = [...sortedData].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_high') {
          sortedData = [...sortedData].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
          sortedData = [...sortedData].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }

        setProperties(sortedData);
        setPagination(response);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams, currentPage, sortBy]);

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null || value === '' || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    router.push(`/properties?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/properties');
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/properties?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/properties?${params.toString()}`);
  };

  const totalResults = pagination?.total || 0;
  const currentPageNum = pagination?.current_page || 1;
  const lastPage = pagination?.last_page || 1;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24">
                <Card className="p-6">
                  <PropertyFilters
                    searchParams={searchParams}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                  />
                </Card>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Filter properties by your preferences
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6">
                        <PropertyFilters
                          searchParams={searchParams}
                          onFilterChange={(key, value) => {
                            handleFilterChange(key, value);
                            setIsFilterSheetOpen(false);
                          }}
                          onReset={() => {
                            handleReset();
                            setIsFilterSheetOpen(false);
                          }}
                          isMobile={true}
                          onClose={() => setIsFilterSheetOpen(false)}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-primary">{totalResults}</span> results
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Properties Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="w-full h-48" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <NoResults
                  title="No Properties Found"
                  description="Try adjusting your filters or search terms to find what you're looking for."
                  onReset={handleReset}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {properties.map((property) => (
                      <PropertyCard key={property.uuid} property={property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {lastPage > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPageNum - 1)}
                        disabled={currentPageNum === 1}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                          let pageNum: number;
                          if (lastPage <= 5) {
                            pageNum = i + 1;
                          } else if (currentPageNum <= 3) {
                            pageNum = i + 1;
                          } else if (currentPageNum >= lastPage - 2) {
                            pageNum = lastPage - 4 + i;
                          } else {
                            pageNum = currentPageNum - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPageNum === pageNum ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="min-w-[40px]"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPageNum + 1)}
                        disabled={currentPageNum === lastPage}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}

