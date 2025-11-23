'use client';

import { useEffect, useState, Suspense, useMemo, useRef } from 'react';
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
import { NoResults } from '@/components/empty/NoResults';
import { ViewToggle, type ViewMode } from '@/components/property/ViewToggle';
import { ActiveFiltersCount } from '@/components/property/ActiveFiltersCount';
import { FilterPresets, type FilterPreset } from '@/components/property/FilterPresets';
import { ResultsPerPage } from '@/components/property/ResultsPerPage';
import { GridColumnsSelector, type GridColumns } from '@/components/property/GridColumnsSelector';
import { SavedFilters } from '@/components/property/SavedFilters';
import { CompareProperties, useCompareProperties } from '@/components/property/CompareProperties';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Property> | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [resultsPerPage, setResultsPerPage] = useState(12);
  const [gridColumns, setGridColumns] = useState<GridColumns>(3);
  const { comparedProperties, removeProperty, clearProperties } = useCompareProperties();
  const isMountedRef = useRef(false);

  // Get current filters from URL - memoized to prevent unnecessary re-renders
  const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);
  const sortBy = useMemo(() => searchParams.get('sort') || 'newest', [searchParams]);
  const perPage = useMemo(() => parseInt(searchParams.get('per_page') || '12'), [searchParams]);

  // Load view mode and preferences from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('propertiesViewMode') as ViewMode;
    if (savedViewMode && ['grid', 'list', 'map', 'gallery'].includes(savedViewMode)) {
      setViewMode(savedViewMode);
    }
    const savedPerPage = localStorage.getItem('propertiesPerPage');
    if (savedPerPage) {
      const perPageNum = parseInt(savedPerPage);
      if ([12, 24, 48, 96].includes(perPageNum)) {
        setResultsPerPage(perPageNum);
      }
    }
    const savedGridColumns = localStorage.getItem('propertiesGridColumns');
    if (savedGridColumns) {
      const columnsNum = parseInt(savedGridColumns) as GridColumns;
      if ([2, 3, 4].includes(columnsNum)) {
        setGridColumns(columnsNum);
      }
    }
  }, []);

  // Save view mode to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('propertiesViewMode', mode);
  };

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchParams.get('type')) count++;
    if (searchParams.get('neighborhood_id')) count++;
    if (searchParams.get('min_price') || searchParams.get('max_price')) count++;
    if (searchParams.get('bedrooms') && searchParams.get('bedrooms') !== 'all') count++;
    if (searchParams.get('bathrooms') && searchParams.get('bathrooms') !== 'all') count++;
    if (searchParams.get('amenities')) count++;
    if (searchParams.get('search')) count++;
    return count;
  }, [searchParams]);
  
  // Create a stable string representation of search params for dependency
  const searchParamsString = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    return params.toString();
  }, [searchParams]);

  // Extract filter values to create stable dependencies
  const filterValues = useMemo(() => {
    return {
      type: searchParams.get('type') || null,
      neighborhood_id: searchParams.get('neighborhood_id') || null,
      min_price: searchParams.get('min_price') || null,
      max_price: searchParams.get('max_price') || null,
      bedrooms: searchParams.get('bedrooms') || null,
      bathrooms: searchParams.get('bathrooms') || null,
      search: searchParams.get('search') || null,
      amenities: searchParams.get('amenities') || null,
    };
  }, [searchParamsString]);

  useEffect(() => {
    let isCancelled = false;

    const fetchProperties = async () => {
      if (isCancelled) return;

      try {
        setLoading(true);
        
        const filters: any = {
          status: 'active',
          per_page: perPage || resultsPerPage,
          page: currentPage,
          locale: 'en',
        };

        if (filterValues.type) filters.type = filterValues.type;
        if (filterValues.neighborhood_id) filters.neighborhood_id = parseInt(filterValues.neighborhood_id);
        if (filterValues.min_price) filters.min_price = parseFloat(filterValues.min_price);
        if (filterValues.max_price) filters.max_price = parseFloat(filterValues.max_price);
        if (filterValues.bedrooms && filterValues.bedrooms !== 'all') filters.bedrooms = parseInt(filterValues.bedrooms);
        if (filterValues.bathrooms && filterValues.bathrooms !== 'all') filters.bathrooms = parseInt(filterValues.bathrooms);

        const response = await getProperties(filters);
        
        if (isCancelled) return;
        
        let sortedData = response.data || [];
        if (sortBy === 'price_low') {
          sortedData = [...sortedData].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_high') {
          sortedData = [...sortedData].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'area_high') {
          sortedData = [...sortedData].sort((a, b) => (b.area_sqm || 0) - (a.area_sqm || 0));
        } else if (sortBy === 'area_low') {
          sortedData = [...sortedData].sort((a, b) => (a.area_sqm || 0) - (b.area_sqm || 0));
        } else if (sortBy === 'newest') {
          sortedData = [...sortedData].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        }

        setProperties(sortedData);
        setPagination(response);
      } catch (error: any) {
        if (isCancelled) return;
        // Silently handle network errors - backend may not be running
        if (!error.isNetworkError && !error.isTimeoutError) {
          console.error('Error fetching properties:', error);
        }
        setProperties([]);
        setPagination({ data: [], current_page: 1, last_page: 1, per_page: 15, total: 0 });
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    if (!isMountedRef.current) {
      isMountedRef.current = true;
    }
    
    fetchProperties();

    return () => {
      isCancelled = true;
    };
  }, [filterValues, currentPage, sortBy]);

  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null || value === '' || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
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

  const handleResultsPerPageChange = (value: number) => {
    setResultsPerPage(value);
    localStorage.setItem('propertiesPerPage', value.toString());
    const params = new URLSearchParams(searchParams.toString());
    params.set('per_page', value.toString());
    params.delete('page'); // Reset to first page when changing per page
    router.push(`/properties?${params.toString()}`);
  };

  const handlePresetSelect = (preset: FilterPreset) => {
    const params = new URLSearchParams();
    Object.entries(preset.filters).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        params.set(key, value);
      }
    });
    if (preset.id === 'new') {
      params.set('sort', 'newest');
    }
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

  // Get location name for results count
  const locationName = searchParams.get('neighborhood_id') 
    ? 'Selected Area' 
    : 'Damascus';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar - 25% */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card className="rounded-xl shadow-md border-0 p-6 bg-white dark:bg-primary-800">
              <PropertyFilters
                searchParams={searchParams}
                onFilterChange={handleFilterChange}
                onReset={handleReset}
              />
            </Card>
            {/* Filter Presets */}
            <Card className="rounded-xl shadow-md border-0 p-6 bg-white dark:bg-primary-800">
              <FilterPresets onPresetSelect={handlePresetSelect} />
            </Card>
            
            {/* Saved Filters */}
            <SavedFilters
              searchParams={searchParams}
              onLoadFilter={(filters) => {
                const params = new URLSearchParams(filters);
                router.push(`/properties?${params.toString()}`);
              }}
              className="w-full"
            />
          </div>
        </aside>

        {/* Main Content - 75% */}
        <div className="lg:col-span-3">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            {/* Results Count & Mobile Filter */}
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="sm" className="rounded-lg">
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

              {/* Results Count - Elegant Typography */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-light">Showing </span>
                  <span className="font-semibold text-primary">{totalResults}</span>
                  <span className="font-light"> {totalResults === 1 ? 'home' : 'homes'} in </span>
                  <span className="font-semibold text-secondary">{locationName}</span>
                </div>
                {/* Active Filters Count */}
                <ActiveFiltersCount
                  count={activeFiltersCount}
                  onClear={handleReset}
                />
              </div>
            </div>

            {/* Right Side: Sort, View Toggle, Results Per Page */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              {/* Results Per Page */}
              <ResultsPerPage
                value={perPage || resultsPerPage}
                onChange={handleResultsPerPageChange}
                className="hidden sm:flex"
              />
              
              {/* Sort By Dropdown - Minimalist */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-light">Sort by:</span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[160px] border-gray-300 rounded-lg bg-white dark:bg-primary-800">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="area_high">Largest First</SelectItem>
                    <SelectItem value="area_low">Smallest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Grid Columns Selector (only in Grid View) */}
              {viewMode === 'grid' && (
                <GridColumnsSelector
                  value={gridColumns}
                  onChange={(columns) => {
                    setGridColumns(columns);
                    localStorage.setItem('propertiesGridColumns', columns.toString());
                  }}
                />
              )}

              {/* View Toggle */}
              <ViewToggle
                viewMode={viewMode}
                onViewChange={handleViewModeChange}
                showMap={true}
                showGallery={true}
              />
            </div>
          </div>

          {/* Filter Presets */}
          {activeFiltersCount === 0 && (
            <div className="mb-6">
              <FilterPresets onPresetSelect={handlePresetSelect} />
            </div>
          )}

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden rounded-xl">
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
              {/* Properties Display - Based on View Mode */}
              {viewMode === 'map' ? (
                <div className="mb-8">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => router.push('/map-search')}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              ) : viewMode === 'gallery' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {properties.map((property) => (
                    <div key={property.uuid} className="aspect-square rounded-xl overflow-hidden cursor-pointer group">
                      <PropertyCard property={property} viewMode="grid" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cn(
                  viewMode === 'grid'
                    ? `grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ${
                        gridColumns === 2 ? 'lg:grid-cols-2' :
                        gridColumns === 3 ? 'lg:grid-cols-3' :
                        'lg:grid-cols-4'
                      }`
                    : 'flex flex-col gap-6 mb-8'
                )}>
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.uuid}
                      property={property}
                      viewMode={viewMode === 'list' ? 'list' : 'grid'}
                    />
                  ))}
                </div>
              )}

              {/* Pagination - Circle Buttons */}
              {lastPage > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPageNum - 1)}
                    disabled={currentPageNum === 1}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
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
                          className={cn(
                            'rounded-full w-10 h-10 p-0 min-w-[40px]',
                            currentPageNum === pageNum
                              ? 'bg-secondary hover:bg-secondary/90 text-white border-0'
                              : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                          )}
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
                    className="rounded-full w-10 h-10 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Compare Properties Bar (Fixed Bottom) */}
      <CompareProperties
        properties={comparedProperties}
        onRemove={removeProperty}
        onClear={clearProperties}
        className="pb-20"
      />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}
