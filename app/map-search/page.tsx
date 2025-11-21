'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { Property } from '@/types';
import { getProperties } from '@/lib/api';
import { PropertyCard } from '@/components/ui-custom/PropertyCard';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

// Default center: Damascus, Syria
const DEFAULT_CENTER = { lat: 33.5138, lng: 36.2765 };
const DEFAULT_ZOOM = 12;

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Libraries for Google Maps
const libraries: ('places' | 'drawing' | 'geometry')[] = ['places'];

interface MapMarker {
  property: Property;
  position: { lat: number; lng: number };
}

export default function MapSearchPage() {
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
          per_page: 100, // Get more properties for map
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

        const response = await getProperties(filters);
        setProperties(response.data || []);
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
  }, [isLoaded, searchParams]);

  // Convert properties to markers (using neighborhood coordinates or default)
  const markers: MapMarker[] = useMemo(() => {
    // In a real app, you'd have lat/lng in the Property or Neighborhood model
    // For now, we'll use a simple mapping or random nearby coordinates
    const neighborhoodCoords: Record<string, { lat: number; lng: number }> = {
      'Malki': { lat: 33.5200, lng: 36.2800 },
      'Mezzeh': { lat: 33.5100, lng: 36.2700 },
      'Kafr Sousa': { lat: 33.5000, lng: 36.2900 },
      'Abu Rummaneh': { lat: 33.5300, lng: 36.2600 },
      'Baramkeh': { lat: 33.5150, lng: 36.2750 },
    };

    return properties.map((property) => {
      const neighborhoodName = property.neighborhood?.name || 'Damascus';
      const coords = neighborhoodCoords[neighborhoodName] || DEFAULT_CENTER;
      
      // Add slight random offset to avoid overlapping markers
      const offset = {
        lat: coords.lat + (Math.random() - 0.5) * 0.01,
        lng: coords.lng + (Math.random() - 0.5) * 0.01,
      };

      return {
        property,
        position: offset,
      };
    });
  }, [properties]);

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
    
    // Get initial bounds
    const bounds = map.getBounds();
    if (bounds) {
      setMapBounds(bounds);
    }
  }, []);

  // Handle map bounds change (when user pans/zooms)
  const onBoundsChanged = useCallback(() => {
    if (mapRef) {
      const bounds = mapRef.getBounds();
      if (bounds) {
        setMapBounds(bounds);
        // Optionally filter properties by bounds here
      }
    }
  }, [mapRef]);

  // Handle marker click
  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
    
    // Find marker position
    const marker = markers.find((m) => m.property.id === property.id);
    if (marker && mapRef) {
      mapRef.setCenter(marker.position);
      mapRef.setZoom(15);
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Use AI search or simple text search
    router.push(`/properties?search=${encodeURIComponent(searchQuery)}`);
  };

  // Format price
  const formatPrice = (price: number, currency: string) => {
    return currency === 'USD' 
      ? `$${price.toLocaleString()}` 
      : `${price.toLocaleString()} ${currency}`;
  };

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading Google Maps</p>
            <p className="text-gray-600">Please check your API key configuration.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Skeleton className="w-64 h-64 rounded-full mx-auto mb-4" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="bg-white border-b p-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search properties..."
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Split Screen: List + Map */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Side: Property List */}
          <div className="lg:w-1/2 overflow-y-auto bg-gray-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-primary">
                  {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
                </h2>
                {mapBounds && (
                  <p className="text-sm text-gray-600">
                    Showing properties in visible area
                  </p>
                )}
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-full h-48" />
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No properties found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      onClick={() => handleMarkerClick(property)}
                      className={`cursor-pointer transition-all ${
                        selectedProperty?.id === property.id
                          ? 'ring-2 ring-primary'
                          : ''
                      }`}
                    >
                      <PropertyCard property={property} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Map */}
          <div className="lg:w-1/2 h-[600px] lg:h-auto relative">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={mapZoom}
              onLoad={onMapLoad}
              onBoundsChanged={onBoundsChanged}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
            >
              {/* Render markers */}
              {markers.map((marker) => (
                <Marker
                  key={marker.property.id}
                  position={marker.position}
                  onClick={() => handleMarkerClick(marker.property)}
                  label={{
                    text: formatPrice(marker.property.price, marker.property.currency),
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
                        <path d="M25 0C11.2 0 0 11.2 0 25c0 18.75 25 35 25 35s25-16.25 25-35C50 11.2 38.8 0 25 0z" fill="#B49162"/>
                        <circle cx="25" cy="25" r="10" fill="#fff"/>
                        <text x="25" y="30" text-anchor="middle" fill="#B49162" font-size="12" font-weight="bold">${marker.property.price}</text>
                      </svg>
                    `),
                    scaledSize: new google.maps.Size(50, 60),
                    anchor: new google.maps.Point(25, 60),
                  }}
                />
              ))}

              {/* Info Window */}
              {selectedProperty && (
                <InfoWindow
                  position={markers.find((m) => m.property.id === selectedProperty.id)?.position}
                  onCloseClick={() => setSelectedProperty(null)}
                >
                  <div className="p-2 max-w-xs">
                    <Link href={`/properties/${selectedProperty.slug}`}>
                      <h3 className="font-bold text-primary mb-1 hover:underline">
                        {selectedProperty.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedProperty.neighborhood?.name || 'Damascus'}
                    </p>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(selectedProperty.price, selectedProperty.currency)}
                      {selectedProperty.type === 'rent' && '/month'}
                    </p>
                    <div className="flex gap-2 mt-2 text-xs text-gray-500">
                      <span>{selectedProperty.bedrooms} beds</span>
                      <span>•</span>
                      <span>{selectedProperty.bathrooms} baths</span>
                      <span>•</span>
                      <span>{selectedProperty.area_sqm} m²</span>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

