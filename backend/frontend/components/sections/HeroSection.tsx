'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Sparkles, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Neighborhood } from '@/types';
import axiosInstance from '@/lib/axios';
import { AiSearchDialog } from '@/components/ai/AiSearchDialog';
import { TrustBadges } from './TrustBadges';
import { SearchSuggestions } from './SearchSuggestions';
import { cn } from '@/lib/utils';
import { ApiError, isApiError } from '@/types/errors';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function HeroSection() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'sale' | 'rent' | 'hotel'>('sale');
  const [location, setLocation] = useState('all');
  const [locationSearch, setLocationSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);
  const [aiSearchOpen, setAiSearchOpen] = useState(false);
  const [scale, setScale] = useState(1);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Parallax scroll effect - reduced to prevent content from disappearing
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 80]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0.5]);

  // Ken Burns effect (slow zoom)
  useEffect(() => {
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
    let isMounted = true;

    const fetchNeighborhoods = async () => {
      try {
        const response = await axiosInstance.get<{ data: Neighborhood[] }>(
          '/neighborhoods',
          {
            params: { city: 'Damascus', locale: locale },
          }
        );

        if (!isMounted) return;

        const neighborhoodsData = response.data?.data || [];
        setNeighborhoods(
          Array.isArray(neighborhoodsData) ? neighborhoodsData : []
        );
      } catch (error: unknown) {
        if (!isMounted) return;

        // Only log non-network errors
        const isNetworkError =
          (isApiError(error) && error.isNetworkError) ||
          (error instanceof Error && (error.message.includes('ERR_NETWORK') || error.message.includes('ECONNREFUSED')));

        if (!isNetworkError) {
          console.error('Error fetching neighborhoods:', error);
        } else {
          console.warn(
            'Backend server may not be running. Please start Laravel server with: php artisan serve'
          );
        }
        setNeighborhoods([]);
      } finally {
        if (isMounted) {
          setLoadingNeighborhoods(false);
        }
      }
    };

    fetchNeighborhoods();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab) params.set('type', activeTab);
    if (location && location !== 'all') params.set('neighborhood_id', location);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax & Ken Burns Effect */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <div className="w-full h-full bg-linear-to-br from-primary via-primary/90 to-secondary/20">
          {/* Background gradient with Ken Burns effect */}
          <motion.div
            className="absolute inset-0 bg-linear-to-br from-primary/90 via-primary/70 to-secondary/50"
            style={{
              scale,
            }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          />
        </div>
        {/* Dark Overlay - 40% opacity */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 w-full pt-40 md:pt-44 lg:pt-48">
        <div className="max-w-5xl mx-auto">
          {/* Typography Section */}
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Headline - Big, Bold, White */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 text-white drop-shadow-2xl leading-tight">
              {mounted ? t('home.findSafeHaven') : 'استقرارك يبدأ من هنا.. في قلب دمشق'}
              <br />
              <span className="text-secondary">
                {mounted 
                  ? (locale === 'ar' ? `في ${mounted ? t('common.damascus') : 'دمشق'}` : `in ${mounted ? t('common.damascus') : 'Damascus'}`)
                  : `في ${mounted ? t('common.damascus') : 'دمشق'}`
                }
              </span>
            </h1>

            {/* Sub-headline - Bronze */}
            <p className="text-lg sm:text-xl md:text-2xl text-secondary font-semibold drop-shadow-lg mb-6">
              {mounted ? t('hero.subtitle') : 'خيارات واسعة من الشقق والفلل في أرقى مناطق دمشق (المزة، الشعلان، أبو رمانة..) مع ضمان قانوني كامل.'}
            </p>

            {/* Trust Badges */}
            <TrustBadges />
          </motion.div>

          {/* Floating Search Box with Glassmorphism */}
          <motion.div
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {/* Tabs - Buy, Rent, Hotel */}
            <div className="flex border-b border-gray-200 bg-gray-50/50">
              <button
                onClick={() => setActiveTab('sale')}
                className={cn(
                  'flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200',
                  'hover:bg-white/50',
                  activeTab === 'sale'
                    ? 'bg-white text-secondary border-b-2 border-secondary'
                    : 'text-gray-600 hover:text-secondary'
                )}
              >
                {mounted ? t('home.sale') : 'بيع'}
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={cn(
                  'flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200',
                  'hover:bg-white/50',
                  activeTab === 'rent'
                    ? 'bg-white text-secondary border-b-2 border-secondary'
                    : 'text-gray-600 hover:text-secondary'
                )}
              >
                        {mounted ? t('home.rent') : 'إيجار'}
              </button>
              <button
                onClick={() => setActiveTab('hotel')}
                className={cn(
                  'flex-1 py-4 px-6 text-sm font-semibold transition-all duration-200',
                  'hover:bg-white/50',
                  activeTab === 'hotel'
                    ? 'bg-white text-secondary border-b-2 border-secondary'
                    : 'text-gray-600 hover:text-secondary'
                )}
              >
                        {mounted ? t('home.hotel') : 'فندق'}
              </button>
            </div>

            {/* Search Inputs */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Location Input with Search Suggestions */}
                <div className="lg:col-span-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {mounted ? t('home.location') : 'الموقع'}
                  </label>
                  <Select
                    value={location}
                    onValueChange={(value) => {
                      setLocation(value);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 bg-white border-gray-300 text-left [&>svg]:ml-auto py-3">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500 shrink-0" />
                      <SelectValue placeholder={mounted ? t('home.location') : 'الموقع'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{mounted ? t('home.allLocations') : 'جميع المواقع'}</SelectItem>
                      {loadingNeighborhoods ? (
                        <SelectItem value="loading" disabled>{mounted ? t('common.loading') : 'جاري التحميل...'}</SelectItem>
                      ) : (
                        Array.isArray(neighborhoods) &&
                        neighborhoods.map((neighborhood) => (
                          <SelectItem
                            key={neighborhood.id}
                            value={neighborhood.id.toString()}
                          >
                            {neighborhood.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Price Input */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {mounted ? t('home.minPrice') : 'من'}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="number"
                      placeholder={mounted ? t('home.minPrice') : 'من'}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full h-12 pl-9 bg-white border-gray-300 py-3"
                    />
                  </div>
                </div>

                {/* Max Price Input */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {mounted ? t('home.maxPrice') : 'إلى'}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      type="number"
                      placeholder={mounted ? t('home.maxPrice') : 'إلى'}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full h-12 pl-9 bg-white border-gray-300 py-3"
                    />
                  </div>
                </div>

                {/* Search Button - Large, Bronze */}
                <div className="lg:col-span-1 flex items-end">
                  <Button
                    onClick={handleSearch}
                    className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-base"
                    size="lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    {mounted ? t('common.search') : 'بحث'}
                  </Button>
                </div>
              </div>

              {/* AI Search Option */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button
                  onClick={() => setAiSearchOpen(true)}
                  variant="ghost"
                  className="w-full text-secondary hover:text-secondary/80 hover:bg-secondary/10 text-sm font-medium"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {mounted ? t('home.tryAiSearch') : 'جرب البحث بالذكاء الاصطناعي'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Search Dialog */}
      <AiSearchDialog open={aiSearchOpen} onOpenChange={setAiSearchOpen} />
    </section>
  );
}
