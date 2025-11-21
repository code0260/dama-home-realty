'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Neighborhood } from '@/types';
import axiosInstance from '@/lib/axios';
import { AiSearchDialog } from '@/components/ai/AiSearchDialog';

export function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState('all');
  const [type, setType] = useState('all');
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);
  const [aiSearchOpen, setAiSearchOpen] = useState(false);
  const [scale, setScale] = useState(1);

  // Parallax scroll effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 150]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  // Ken Burns effect (slow zoom)
  useEffect(() => {
    // Only start interval after component is mounted
    const interval = setInterval(() => {
      setScale((prev) => {
        if (prev >= 1.1) return 1;
        return prev + 0.001;
      });
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const response = await axiosInstance.get<{ data: Neighborhood[] }>('/neighborhoods', {
          params: { city: 'Damascus', locale: 'en' },
        });
        // Laravel Resource::collection returns { data: [...] }
        const neighborhoodsData = response.data?.data || [];
        setNeighborhoods(Array.isArray(neighborhoodsData) ? neighborhoodsData : []);
      } catch (error: any) {
        console.error('Error fetching neighborhoods:', error);
        // Log network errors with helpful message
        if (error.isNetworkError || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          console.warn('Backend server may not be running. Please start Laravel server with: php artisan serve');
        }
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
    <section className="relative w-full h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax & Ken Burns Effect */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y, opacity }}
      >
        <div className="w-full h-full bg-linear-to-br from-primary via-primary/90 to-secondary/20">
          {/* Background image with Ken Burns effect */}
          <motion.div
            className="absolute inset-0 bg-[url('/damascus-skyline.jpg')] bg-cover bg-center"
            style={{
              scale,
              backgroundImage: "url('/damascus-skyline.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Heading with Gradient Text */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 drop-shadow-2xl">
          <span className="bg-linear-to-r from-[#B49162] via-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
            Find Your Safe Haven
          </span>
          <br />
          <span className="text-white">in Damascus</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-100 mb-10 drop-shadow-lg max-w-2xl mx-auto">
          Discover premium properties in Syria's historic capital
        </p>

        {/* Magic Search Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Button
            onClick={() => setAiSearchOpen(true)}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-md shadow-xl"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Try AI Magic Search
          </Button>
        </motion.div>

        {/* Glassmorphism Search Box (Airbnb Style) */}
        <motion.div
          className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Location Select */}
            <div className="flex-1">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full bg-white/90 hover:bg-white border-white/30 h-14 text-left">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                  <SelectValue placeholder="Where?" />
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
                <SelectTrigger className="w-full bg-white/90 hover:bg-white border-white/30 h-14 text-left">
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
              className="bg-[#B49162] hover:bg-[#9A7A4F] text-white px-8 md:px-12 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Search className="w-5 h-5 mr-2" />
              Search
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* AI Search Dialog */}
      <AiSearchDialog open={aiSearchOpen} onOpenChange={setAiSearchOpen} />
    </section>
  );
}

