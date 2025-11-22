'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Property } from '@/types';
import { getProperties } from '@/lib/api';
import { PropertyCard } from '@/components/ui-custom/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  X,
  Layers,
  Maximize2,
  Minimize2,
  Grid3x3,
  Flame,
  Square,
  Route,
  Filter,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapLayers } from '@/components/map/MapLayers';
import { MapClusters } from '@/components/map/MapClusters';
import { MapHeatmap } from '@/components/map/MapHeatmap';
import { DrawSearchArea } from '@/components/map/DrawSearchArea';
import { RoutePlanning } from '@/components/map/RoutePlanning';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { cn } from '@/lib/utils';

// Default center: Damascus, Syria
const DEFAULT_CENTER = { lat: 33.5138, lng: 36.2765 };
const DEFAULT_ZOOM = 12;

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Libraries for Google Maps
const libraries: ('places' | 'drawing' | 'geometry' | 'visualization')[] = [
  'places',
  'drawing',
  'geometry',
  'visualization',
];

interface MapMarker {
  property: Property;
  position: { lat: number; lng: number };
}

function MapSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [showList, setShowList] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap');
  const [useClusters, setUseClusters] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [drawAreaEnabled, setDrawAreaEnabled] = useState(false);
  const [drawnBounds, setDrawnBounds] = useState<google.maps.LatLngBounds | null>(null);
  const [routeEnabled, setRouteEnabled] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState<Property | null>(null);
  const [routeDestination, setRouteDestination] = useState<Property | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const filters: any = {
          status: 'active',
          per_page: 200, // Get more properties for map
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

        // Filter by drawn area bounds if available
        if (drawnBounds) {
          const ne = drawnBounds.getNorthEast();
          const sw = drawnBounds.getSouthWest();
          // You would need backend support for bounds filtering
          // For now, we'll just fetch all and filter client-side
        }

        const response = await getProperties(filters);
        let fetchedProperties = response.data || [];

        // Filter by drawn bounds if available (client-side filtering)
        if (drawnBounds) {
          fetchedProperties = fetchedProperties.filter((property) => {
            const propertyPos = getPropertyPosition(property);
            return drawnBounds.contains(
              new google.maps.LatLng(propertyPos.lat, propertyPos.lng)
            );
          });
        }

        setProperties(fetchedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchProperties();
    }
  }, [isLoaded, searchParams, drawnBounds]);

  // Get property position (helper function)
  const getPropertyPosition = useCallback((property: Property): { lat: number; lng: number } => {
    const neighborhoodCoords: Record<string, { lat: number; lng: number }> = {
      'Malki': { lat: 33.5200, lng: 36.2800 },
      'Mezzeh': { lat: 33.5100, lng: 36.2700 },
      'Kafr Sousa': { lat: 33.5000, lng: 36.2900 },
      'Abu Rummaneh': { lat: 33.5300, lng: 36.2600 },
      'Baramkeh': { lat: 33.5150, lng: 36.2750 },
      'Mazzeh': { lat: 33.5100, lng: 36.2700 },
      'Abu Rummane': { lat: 33.5300, lng: 36.2600 },
      'Kafar Sousse': { lat: 33.5000, lng: 36.2900 },
    };

    const neighborhoodName = property.neighborhood?.name || 'Damascus';
    const coords = neighborhoodCoords[neighborhoodName] || DEFAULT_CENTER;

    // Add slight random offset to avoid overlapping markers
    const offset = {
      lat: coords.lat + (Math.random() - 0.5) * 0.01,
      lng: coords.lng + (Math.random() - 0.5) * 0.01,
    };

    return offset;
  }, []);

  // Convert properties to markers
  const markers: MapMarker[] = useMemo(() => {
    return properties.map((property) => ({
      property,
      position: getPropertyPosition(property),
    }));
  }, [properties, getPropertyPosition]);

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);

    // Get initial bounds
    const bounds = map.getBounds();
    if (bounds) {
      setMapBounds(bounds);
    }
  }, []);

  // Handle map bounds change
  const onBoundsChanged = useCallback(() => {
    if (mapRef) {
      const bounds = mapRef.getBounds();
      if (bounds) {
        setMapBounds(bounds);
      }
    }
  }, [mapRef]);

  // Handle marker click
  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);

    // Find marker position
    const marker = markers.find((m) => m.property.id === property.id || m.property.uuid === property.uuid);
    if (marker && mapRef) {
      mapRef.setCenter(marker.position);
      mapRef.setZoom(15);
    }

    // Handle route planning
    if (routeEnabled) {
      if (!routeOrigin) {
        setRouteOrigin(property);
      } else if (!routeDestination) {
        setRouteDestination(property);
      }
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
  };

  // Format price
  const formatPrice = (price: number, currency: string) => {
    return currency === 'USD' ? `$${price.toLocaleString()}` : `${price.toLocaleString()} ${currency}`;
  };

  // Handle fullscreen toggle
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setShowList(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'all' && value !== '') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/map-search?${params.toString()}`);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    router.push('/map-search');
    setFiltersOpen(false);
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4 font-semibold">Error loading Google Maps</p>
            <p className="text-gray-600 text-sm">
              Please check your API key configuration in the environment variables.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Skeleton className="w-64 h-64 rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with Search and Controls */}
      <div className="bg-white border-b border-gray-200 dark:border-primary-700 sticky top-0 z-40">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 w-full md:w-auto">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search properties by name or location..."
                  className="flex-1"
                />
                <Button onClick={handleSearch} className="bg-secondary hover:bg-secondary/90 text-white">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Map Controls */}
            <div className="flex gap-2 flex-wrap">
              {/* Filters Button */}
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 shadow-sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-primary dark:text-white">Filter Properties</SheetTitle>
                  </SheetHeader>
                  <PropertyFilters
                    searchParams={searchParams}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                    isMobile={true}
                    onClose={() => setFiltersOpen(false)}
                  />
                </SheetContent>
              </Sheet>

              {/* Fullscreen Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleFullscreen}
                className="bg-white hover:bg-gray-50 shadow-sm"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-4 h-4 mr-2" />
                    Exit Fullscreen
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Fullscreen
                  </>
                )}
              </Button>

              {/* List Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowList(!showList)}
                className="bg-white hover:bg-gray-50 shadow-sm"
              >
                {showList ? 'Hide List' : 'Show List'}
              </Button>
            </div>
          </div>

          {/* Map Toolbar */}
          <div className="flex gap-2 mt-4 flex-wrap items-center">
            {/* Map Layers */}
            <MapLayers mapTypeId={mapTypeId} onMapTypeChange={setMapTypeId} />

            {/* Clusters Toggle */}
            <Toggle
              pressed={useClusters}
              onPressedChange={setUseClusters}
              aria-label="Toggle clusters"
              className="bg-white hover:bg-gray-50 shadow-sm"
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Clusters
            </Toggle>

            {/* Heatmap Toggle */}
            <Toggle
              pressed={showHeatmap}
              onPressedChange={setShowHeatmap}
              aria-label="Toggle heatmap"
              className="bg-white hover:bg-gray-50 shadow-sm"
            >
              <Flame className="w-4 h-4 mr-2" />
              Heatmap
            </Toggle>

            {/* Draw Area */}
            <DrawSearchArea
              map={mapRef}
              enabled={drawAreaEnabled}
              onToggle={() => setDrawAreaEnabled(!drawAreaEnabled)}
              onAreaDrawn={setDrawnBounds}
            />

            {/* Route Planning */}
            <RoutePlanning
              map={mapRef}
              origin={routeOrigin}
              destination={routeDestination}
              enabled={routeEnabled}
              onToggle={() => {
                setRouteEnabled(!routeEnabled);
                if (!routeEnabled) {
                  setRouteOrigin(null);
                  setRouteDestination(null);
                }
              }}
              getPropertyPosition={getPropertyPosition}
            />
          </div>

          {/* Results Count */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-3 py-1">
                {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
              </Badge>
              {drawnBounds && (
                <Badge className="bg-secondary text-white px-3 py-1">
                  Area Filtered
                </Badge>
              )}
              {routeEnabled && routeOrigin && routeDestination && (
                <Badge className="bg-blue-500 text-white px-3 py-1">
                  Route Active
                </Badge>
              )}
            </div>
            {drawnBounds && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDrawnBounds(null);
                  setDrawAreaEnabled(false);
                }}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear Area
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Split Screen: List + Map */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Left Side: Property List */}
        {showList && !isFullscreen && (
          <div className="lg:w-1/3 xl:w-1/4 overflow-y-auto bg-gray-50 dark:bg-primary-900 border-r border-gray-200 dark:border-primary-700">
            <div className="p-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="w-full h-48 rounded-lg" />
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <Card className="border-gray-200 dark:border-primary-700">
                  <CardContent className="py-16 text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">
                      No properties found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                      {drawnBounds
                        ? 'Try adjusting your search area or filters'
                        : 'Try adjusting your filters or search query'}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDrawnBounds(null);
                        router.push('/map-search');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div
                      key={property.id || property.uuid}
                      onClick={() => handleMarkerClick(property)}
                      className={cn(
                        'cursor-pointer transition-all rounded-lg',
                        selectedProperty?.id === property.id ||
                        selectedProperty?.uuid === property.uuid
                          ? 'ring-2 ring-secondary shadow-lg'
                          : 'hover:shadow-md'
                      )}
                    >
                      <PropertyCard property={property} viewMode="grid" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right Side: Map */}
        <div
          className={cn(
            'relative bg-gray-100 dark:bg-primary-800',
            showList && !isFullscreen ? 'lg:w-2/3 xl:w-3/4' : 'w-full',
            isFullscreen ? 'h-screen' : 'h-[600px] lg:h-[calc(100vh-200px)]'
          )}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={mapZoom}
            onLoad={onMapLoad}
            onBoundsChanged={onBoundsChanged}
            onZoomChanged={() => {
              if (mapRef) {
                setMapZoom(mapRef.getZoom() || DEFAULT_ZOOM);
              }
            }}
            onCenterChanged={() => {
              if (mapRef) {
                const center = mapRef.getCenter();
                if (center) {
                  setMapCenter({ lat: center.lat(), lng: center.lng() });
                }
              }
            }}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER,
              },
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              fullscreenControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP,
              },
              mapTypeId: mapTypeId as google.maps.MapTypeId,
            }}
          >
            {/* Map Clusters or Individual Markers */}
            {useClusters ? (
              <MapClusters
                map={mapRef}
                properties={properties}
                onMarkerClick={handleMarkerClick}
                getPropertyPosition={getPropertyPosition}
                formatPrice={formatPrice}
              />
            ) : (
              markers.map((marker) => (
                <Marker
                  key={marker.property.id || marker.property.uuid}
                  position={marker.position}
                  onClick={() => handleMarkerClick(marker.property)}
                  label={{
                    text: formatPrice(marker.property.price, marker.property.currency).substring(0, 10),
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold',
                  }}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 0C11.2 0 0 11.2 0 25c0 18.75 25 35 25 35s25-16.25 25-35C50 11.2 38.8 0 25 0z" fill="#B49162"/>
                        <circle cx="25" cy="25" r="10" fill="#fff"/>
                        <text x="25" y="30" text-anchor="middle" fill="#B49162" font-size="10" font-weight="bold">${marker.property.price.toLocaleString().slice(0, 5)}</text>
                      </svg>
                    `),
                    scaledSize: new google.maps.Size(50, 60),
                    anchor: new google.maps.Point(25, 60),
                  }}
                />
              ))
            )}

            {/* Map Heatmap */}
            {showHeatmap && (
              <MapHeatmap
                map={mapRef}
                properties={properties}
                enabled={showHeatmap}
                getPropertyPosition={getPropertyPosition}
              />
            )}

            {/* Info Window */}
            {selectedProperty && (
              <InfoWindow
                position={markers.find(
                  (m) => m.property.id === selectedProperty.id || m.property.uuid === selectedProperty.uuid
                )?.position}
                onCloseClick={() => setSelectedProperty(null)}
              >
                <div className="p-2 max-w-xs">
                  <Link href={`/properties/${selectedProperty.slug}`}>
                    <h3 className="font-bold text-primary dark:text-white mb-1 hover:underline cursor-pointer">
                      {selectedProperty.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {selectedProperty.neighborhood?.name || 'Damascus'}
                  </p>
                  <p className="text-lg font-bold text-secondary mb-2">
                    {formatPrice(selectedProperty.price, selectedProperty.currency)}
                    {selectedProperty.type === 'rent' && '/month'}
                  </p>
                  <div className="flex gap-2 mt-2 text-xs text-gray-500 dark:text-gray-500">
                    <span>{selectedProperty.bedrooms} beds</span>
                    <span>•</span>
                    <span>{selectedProperty.bathrooms} baths</span>
                    <span>•</span>
                    <span>{selectedProperty.area_sqm} m²</span>
                  </div>
                  {routeEnabled && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-primary-700 flex gap-2">
                      {!routeOrigin ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setRouteOrigin(selectedProperty);
                            setSelectedProperty(null);
                          }}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs"
                        >
                          Set Origin
                        </Button>
                      ) : !routeDestination ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            setRouteDestination(selectedProperty);
                            setSelectedProperty(null);
                          }}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs"
                        >
                          Set Destination
                        </Button>
                      ) : null}
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}

            {/* Route Planning */}
            {routeEnabled && routeOrigin && routeDestination && (
              <RoutePlanning
                map={mapRef}
                origin={routeOrigin}
                destination={routeDestination}
                enabled={routeEnabled}
                onToggle={() => {
                  setRouteEnabled(false);
                  setRouteOrigin(null);
                  setRouteDestination(null);
                }}
                getPropertyPosition={getPropertyPosition}
              />
            )}
          </GoogleMap>

          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            {/* Zoom Controls */}
            <div className="bg-white dark:bg-primary-800 rounded-lg shadow-lg border border-gray-200 dark:border-primary-700 flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (mapRef) {
                    mapRef.setZoom((mapRef.getZoom() || DEFAULT_ZOOM) + 1);
                  }
                }}
                className="h-8 w-8 p-0 rounded-b-none"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <div className="border-t border-gray-200 dark:border-primary-700" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (mapRef) {
                    mapRef.setZoom((mapRef.getZoom() || DEFAULT_ZOOM) - 1);
                  }
                }}
                className="h-8 w-8 p-0 rounded-t-none"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MapSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[80vh]">
          <Skeleton className="w-full h-screen" />
        </div>
      }
    >
      <MapSearchContent />
    </Suspense>
  );
}
