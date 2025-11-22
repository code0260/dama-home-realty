'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DirectionsRenderer } from '@react-google-maps/api';
import { Route, X, Navigation, MapPin } from 'lucide-react';
import { Property } from '@/types';
import { cn } from '@/lib/utils';

interface RoutePlanningProps {
  map: google.maps.Map | null;
  origin: Property | null;
  destination: Property | null;
  waypoints?: Property[];
  enabled: boolean;
  onToggle: () => void;
  className?: string;
  getPropertyPosition: (property: Property) => { lat: number; lng: number };
}

export function RoutePlanning({
  map,
  origin,
  destination,
  waypoints = [],
  enabled,
  onToggle,
  className,
  getPropertyPosition,
}: RoutePlanningProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);

  useEffect(() => {
    if (!map || !enabled || !origin || !destination) {
      setDirections(null);
      return;
    }

    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
    }

    setLoading(true);

    const originPos = getPropertyPosition(origin);
    const destPos = getPropertyPosition(destination);

    const request: google.maps.DirectionsRequest = {
      origin: new google.maps.LatLng(originPos.lat, originPos.lng),
      destination: new google.maps.LatLng(destPos.lat, destPos.lng),
      travelMode: google.maps.TravelMode.DRIVING,
      waypoints:
        waypoints.length > 0
          ? waypoints.map((wp) => {
              const wpPos = getPropertyPosition(wp);
              return {
                location: new google.maps.LatLng(wpPos.lat, wpPos.lng),
                stopover: true,
              };
            })
          : undefined,
    };

    directionsServiceRef.current.route(request, (result, status) => {
      setLoading(false);
      if (status === google.maps.DirectionsStatus.OK && result) {
        setDirections(result);
      } else {
        console.error('Directions request failed:', status);
        setDirections(null);
      }
    });
  }, [map, enabled, origin, destination, waypoints, getPropertyPosition]);

  const handleClear = () => {
    setDirections(null);
  };

  if (!enabled) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className={cn(
          'bg-white hover:bg-gray-50 shadow-lg border-gray-200 dark:bg-primary-800 dark:border-primary-700',
          className
        )}
      >
        <Route className="w-4 h-4 mr-2" />
        Plan Route
      </Button>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={onToggle}
          className="bg-secondary hover:bg-secondary/90 text-white"
        >
          <Route className="w-4 h-4 mr-2" />
          Planning Route...
        </Button>
        {directions && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="bg-white hover:bg-gray-50 shadow-lg border-gray-200 dark:bg-primary-800 dark:border-primary-700"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {loading && (
        <div className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-white rounded shadow">
          Calculating route...
        </div>
      )}

      {directions && !loading && (
        <div className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-white rounded shadow space-y-1">
          {origin && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-green-500" />
              <span className="font-semibold">From:</span> {origin.title}
            </div>
          )}
          {destination && (
            <div className="flex items-center gap-1">
              <Navigation className="w-3 h-3 text-red-500" />
              <span className="font-semibold">To:</span> {destination.title}
            </div>
          )}
          {directions.routes[0]?.legs[0] && (
            <div className="pt-1 border-t border-gray-200">
              <div>
                <span className="font-semibold">Distance:</span>{' '}
                {directions.routes[0].legs[0].distance?.text}
              </div>
              <div>
                <span className="font-semibold">Duration:</span>{' '}
                {directions.routes[0].legs[0].duration?.text}
              </div>
            </div>
          )}
        </div>
      )}

      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: '#B49162',
              strokeWeight: 5,
              strokeOpacity: 0.8,
            },
            suppressMarkers: false,
            markerOptions: {
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0C6.72 0 0 6.72 0 15c0 11.25 15 25 15 25s15-13.75 15-25C30 6.72 23.28 0 15 0z" fill="#B49162"/>
                    <circle cx="15" cy="15" r="6" fill="#fff"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(30, 40),
              },
            },
          }}
        />
      )}
    </div>
  );
}

