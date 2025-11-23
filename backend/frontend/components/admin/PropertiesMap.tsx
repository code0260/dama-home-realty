'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPropertiesMapData, PropertiesMapData } from '@/lib/api/admin';
import { MapPin } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 33.5138, // Damascus coordinates
  lng: 36.2765,
};

interface PropertiesMapProps {
  googleMapsApiKey?: string;
}

export function PropertiesMap({ googleMapsApiKey }: PropertiesMapProps) {
  const [data, setData] = useState<PropertiesMapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const mapData = await getPropertiesMapData();
        setData(mapData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching properties map data:', err);
        setError('Failed to load properties map data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    // Map loaded callback
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[500px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">{error || 'Failed to load properties map'}</p>
          <p className="text-sm text-gray-500 mt-2">
            Note: Google Maps integration requires API key. Use the API endpoint
            /api/admin/dashboard/properties/map-data to fetch data.
          </p>
        </CardContent>
      </Card>
    );
  }

  const properties = data.properties || [];
  const center = properties.length > 0 && properties[0].latitude && properties[0].longitude
    ? { lat: properties[0].latitude, lng: properties[0].longitude }
    : defaultCenter;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Properties Map ({properties.length} properties)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {googleMapsApiKey ? (
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
              onLoad={onLoad}
            >
              {properties.map((property) => {
                if (!property.latitude || !property.longitude) return null;
                return (
                  <Marker
                    key={property.id}
                    position={{ lat: property.latitude, lng: property.longitude }}
                    onClick={() => setSelectedProperty(property.id)}
                  >
                    {selectedProperty === property.id && (
                      <InfoWindow
                        onCloseClick={() => setSelectedProperty(null)}
                      >
                        <div className="p-2">
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-gray-600">
                            {property.neighborhood}
                          </p>
                          <p className="text-sm font-medium text-primary">
                            ${property.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {property.type} • {property.status}
                          </p>
                        </div>
                      </InfoWindow>
                    )}
                  </Marker>
                );
              })}
            </GoogleMap>
          </LoadScript>
        ) : (
          <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Properties Map
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {properties.length} properties found
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Google Maps API key required for interactive map.
                <br />
                Configure GOOGLE_MAPS_API_KEY in your environment.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

