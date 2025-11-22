'use client';

import { useEffect, useRef } from 'react';
import { Marker } from '@react-google-maps/api';
import { Property } from '@/types';

interface MapClustersProps {
  map: google.maps.Map | null;
  properties: Property[];
  onMarkerClick: (property: Property) => void;
  getPropertyPosition: (property: Property) => { lat: number; lng: number };
  formatPrice: (price: number, currency: string) => string;
}

export function MapClusters({
  map,
  properties,
  onMarkerClick,
  getPropertyPosition,
  formatPrice,
}: MapClustersProps) {
  const clustererRef = useRef<any>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!map || properties.length === 0) {
      // Cleanup
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      markersRef.current = [];
      return;
    }

    // Load marker clusterer library dynamically
    if (typeof window !== 'undefined' && !(window as any).markerClustererLoaded) {
      const script = document.createElement('script');
      script.src =
        'https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js';
      script.async = true;
      script.onload = () => {
        (window as any).markerClustererLoaded = true;
        initializeClusterer();
      };
      document.head.appendChild(script);
    } else if ((window as any).markerClustererLoaded) {
      initializeClusterer();
    }

    function initializeClusterer() {
      if (!map || !(window as any).markerClusterer) return;

      // Cleanup existing clusterer
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }

      // Create markers
      const googleMarkers = properties.map((property) => {
        const position = getPropertyPosition(property);
        const marker = new google.maps.Marker({
          position,
          label: {
            text: formatPrice(property.price, property.currency).substring(0, 10),
            color: '#fff',
            fontSize: '11px',
            fontWeight: 'bold',
          },
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="50" height="60" viewBox="0 0 50 60" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 0C11.2 0 0 11.2 0 25c0 18.75 25 35 25 35s25-16.25 25-35C50 11.2 38.8 0 25 0z" fill="#B49162"/>
                <circle cx="25" cy="25" r="10" fill="#fff"/>
                <text x="25" y="30" text-anchor="middle" fill="#B49162" font-size="10" font-weight="bold">${property.price.toLocaleString().slice(0, 5)}</text>
              </svg>
            `),
            scaledSize: new google.maps.Size(50, 60),
            anchor: new google.maps.Point(25, 60),
          },
          map,
        });

        marker.addListener('click', () => {
          onMarkerClick(property);
        });

        return marker;
      });

      markersRef.current = googleMarkers;

      // Create clusterer
      const { MarkerClusterer } = (window as any).markerClusterer;
      clustererRef.current = new MarkerClusterer({
        map,
        markers: googleMarkers,
        algorithm: new (window as any).markerClusterer.GridAlgorithm({}),
        renderer: {
          render: ({ count, position }: any) => {
            return new google.maps.Marker({
              position,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="18" fill="#B49162" stroke="#fff" stroke-width="2"/>
                    <text x="20" y="26" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">${count}</text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
              },
              label: {
                text: String(count),
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
              },
              zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
            });
          },
        },
      });
    }

    // Cleanup
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [map, properties, getPropertyPosition, formatPrice, onMarkerClick]);

  return null;
}

