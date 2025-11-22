'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Navigation, Search, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Neighborhood } from '@/types';
import axiosInstance from '@/lib/axios';
import { useLoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

interface LocationPickerProps {
  neighborhoodId: string;
  address: string;
  latitude?: number;
  longitude?: number;
  onNeighborhoodChange: (id: string) => void;
  onAddressChange: (address: string) => void;
  onLocationChange: (lat: number, lng: number) => void;
  error?: string;
  className?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 33.5138, // Damascus coordinates
  lng: 36.2765,
};

export function LocationPicker({
  neighborhoodId,
  address,
  latitude,
  longitude,
  onNeighborhoodChange,
  onAddressChange,
  onLocationChange,
  error,
  className,
}: LocationPickerProps) {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter
  );
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        setLoadingNeighborhoods(true);
        const response = await axiosInstance.get<{ data: Neighborhood[] }>('/neighborhoods');
        setNeighborhoods(response.data.data || []);
      } catch (error) {
        console.error('Error fetching neighborhoods:', error);
        setNeighborhoods([]);
      } finally {
        setLoadingNeighborhoods(false);
      }
    };

    fetchNeighborhoods();
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      onLocationChange(lat, lng);
      
      // Reverse geocode to get address
      if (isLoaded && window.google) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            onAddressChange(results[0].formatted_address);
          }
        });
      }
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      if (isLoaded && window.google) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: searchQuery }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();
            
            setMapCenter({ lat, lng });
            setMarkerPosition({ lat, lng });
            onLocationChange(lat, lng);
            onAddressChange(results[0].formatted_address);
            
            // Update map center
            if (mapRef.current) {
              mapRef.current.setCenter({ lat, lng });
            }
          } else {
            alert('Location not found. Please try a different search term.');
          }
          setLoading(false);
        });
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          setMapCenter({ lat, lng });
          setMarkerPosition({ lat, lng });
          onLocationChange(lat, lng);
          
          if (mapRef.current) {
            mapRef.current.setCenter({ lat, lng });
          }
          
          // Reverse geocode to get address
          if (isLoaded && window.google) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                onAddressChange(results[0].formatted_address);
              }
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleNeighborhoodSelect = (id: string) => {
    onNeighborhoodChange(id);
    const neighborhood = neighborhoods.find((n) => n.id.toString() === id);
    if (neighborhood) {
      // You might want to set a default location for the neighborhood
      // For now, we'll just update the address
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Neighborhood Selector */}
      <div className="space-y-2">
        <Label htmlFor="neighborhood">Neighborhood / Area *</Label>
        <Select
          value={neighborhoodId}
          onValueChange={handleNeighborhoodSelect}
          disabled={loadingNeighborhoods}
        >
          <SelectTrigger className={error ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select neighborhood" />
          </SelectTrigger>
          <SelectContent>
            {neighborhoods.map((neighborhood) => (
              <SelectItem key={neighborhood.id} value={neighborhood.id.toString()}>
                {neighborhood.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Address Search */}
      <div className="space-y-2">
        <Label htmlFor="address">Street Address *</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="address"
              value={address}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onAddressChange(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Enter address or search location"
              className={cn('pl-10', error && 'border-red-500')}
              disabled={loading}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            disabled={loading}
            title="Use current location"
          >
            <Navigation className="w-4 h-4" />
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      {/* Coordinates Display */}
      {(latitude && longitude) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span>
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </span>
        </div>
      )}

      {/* Map */}
      {isLoaded ? (
        <Card className="border-2 border-gray-200 dark:border-primary-700 overflow-hidden">
          <CardContent className="p-0">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={markerPosition ? 15 : 12}
              onClick={handleMapClick}
              onLoad={(map) => {
                mapRef.current = map;
              }}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
            >
              {markerPosition && (
                <Marker
                  position={markerPosition}
                  draggable={true}
                  onDragEnd={(e) => {
                    if (e.latLng) {
                      const lat = e.latLng.lat();
                      const lng = e.latLng.lng();
                      setMarkerPosition({ lat, lng });
                      onLocationChange(lat, lng);
                    }
                  }}
                />
              )}
            </GoogleMap>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-gray-200 dark:border-primary-700">
          <CardContent className="flex items-center justify-center h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          Click on the map or use the search bar to set the exact location of your property.
          You can drag the marker to fine-tune the position.
        </AlertDescription>
      </Alert>
    </div>
  );
}

