'use client';

import { useEffect, useState } from 'react';
import { Property } from '@/types';
import { MapPin } from 'lucide-react';

interface PropertyMapProps {
  property: Property;
}

export function PropertyMap({ property }: PropertyMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Get coordinates (you might want to add latitude/longitude to Property type)
  const lat = 33.5138; // Damascus default
  const lng = 36.2765;
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${lat},${lng}&zoom=15`;

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setMapLoaded(true);
    }
  }, []);

  if (!mapLoaded || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-96 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMEYxNzJBIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQkQ5MTYyIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] repeat opacity-5" />
        <div className="relative z-10 text-center p-8">
          <div className="inline-flex p-6 bg-[#B49162]/10 rounded-full mb-4">
            <MapPin className="w-12 h-12 text-[#B49162]" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">Location</h3>
          <p className="text-gray-600 mb-4">
            {property.neighborhood?.name || 'Damascus'}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#B49162] hover:text-[#0F172A] font-semibold transition-colors"
          >
            View on Google Maps
            <MapPin className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden shadow-xl border-2 border-[#B49162]/20 relative">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        className="absolute inset-0"
      />
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-[#0F172A]">
          {property.neighborhood?.name || 'Damascus'}
        </p>
      </div>
    </div>
  );
}

