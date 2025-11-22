'use client';

import { useEffect, useRef } from 'react';
import { Property } from '@/types';

interface MapHeatmapProps {
  map: google.maps.Map | null;
  properties: Property[];
  enabled: boolean;
  getPropertyPosition: (property: Property) => { lat: number; lng: number };
  intensity?: number;
}

export function MapHeatmap({
  map,
  properties,
  enabled,
  getPropertyPosition,
  intensity = 0.7,
}: MapHeatmapProps) {
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map || !enabled || properties.length === 0) {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
      return;
    }

    // Initialize heatmap layer
    if (!heatmapRef.current) {
      heatmapRef.current = new google.maps.visualization.HeatmapLayer({
        map,
        radius: 50,
        opacity: intensity,
        gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)',
          ],
      });
    }

    // Convert properties to weighted locations
    const weightedLocations = properties.map((property) => {
      const position = getPropertyPosition(property);
      // Weight based on price (higher price = more weight)
      const weight = Math.log(property.price) / Math.log(10);
      return {
        location: new google.maps.LatLng(position.lat, position.lng),
        weight: weight,
      };
    });

    heatmapRef.current.setData(weightedLocations);

    // Cleanup
    return () => {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
    };
  }, [map, properties, enabled, getPropertyPosition, intensity]);

  return null;
}

