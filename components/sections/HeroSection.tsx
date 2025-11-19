'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Neighborhood } from '@/types';
import axiosInstance from '@/lib/axios';

export function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState('all');
  const [type, setType] = useState('all');
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const response = await axiosInstance.get<{ data: Neighborhood[] }>('/neighborhoods', {
          params: { city: 'Damascus', locale: 'en' },
        });
        // Laravel Resource::collection returns { data: [...] }
        const neighborhoodsData = response.data?.data || [];
        setNeighborhoods(Array.isArray(neighborhoodsData) ? neighborhoodsData : []);
      } catch (error) {
        console.error('Error fetching neighborhoods:', error);
        setNeighborhoods([]); // Set empty array on error
      } finally {
        setLoadingNeighborhoods(false);
      }
    };

    fetchNeighborhoods();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.set('type', type);
    if (location && location !== 'all') params.set('neighborhood_id', location);
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-primary via-primary/90 to-secondary/20">
          {/* Placeholder for Damascus skyline image */}
          <div className="absolute inset-0 bg-[url('/damascus-skyline.jpg')] bg-cover bg-center opacity-30" />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Find Your Safe Haven in Damascus
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-md">
          Discover premium properties in Syria's historic capital
        </p>

        {/* Search Box */}
        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Location Select */}
            <div className="flex-1">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Array.isArray(neighborhoods) && neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood.id} value={neighborhood.id.toString()}>
                      {neighborhood.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Select */}
            <div className="flex-1">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sale">Buy</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-secondary hover:bg-secondary/90 text-white px-8 md:px-12"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

