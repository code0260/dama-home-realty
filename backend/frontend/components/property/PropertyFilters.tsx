'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { X, Filter, Search } from 'lucide-react';
import { Neighborhood } from '@/types';
import axiosInstance from '@/lib/axios';
import { ApiError, isApiError } from '@/types/errors';
import { SearchAutocomplete } from './SearchAutocomplete';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface PropertyFiltersProps {
  searchParams: URLSearchParams;
  onFilterChange: (key: string, value: string | null) => void;
  onReset: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const commonAmenities = [
  'WiFi',
  'Solar Power',
  'Parking',
  'Garden',
  'Balcony',
  'Elevator',
  'Security',
  'Air Conditioning',
  'Heating',
  'Furnished',
];

export function PropertyFilters({
  searchParams,
  onFilterChange,
  onReset,
  isMobile = false,
  onClose,
}: PropertyFiltersProps) {
  const { t, locale } = useLanguage();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };
  
  // Local state for debounced inputs (price and search)
  const [localMinPrice, setLocalMinPrice] = useState(searchParams.get('min_price') || '');
  const [localMaxPrice, setLocalMaxPrice] = useState(searchParams.get('max_price') || '');
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
  
  // Refs for debounce timers
  const minPriceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const maxPriceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const response = await axiosInstance.get<{ data: Neighborhood[] }>('/neighborhoods', {
          params: { city: 'Damascus', locale: 'en' },
        });
        setNeighborhoods(response.data?.data || []);
      } catch (error: unknown) {
        // Silently handle network errors - backend may not be running
        if (isApiError(error) && (!error.isNetworkError && !error.isTimeoutError)) {
          console.error('Error fetching neighborhoods:', error);
        } else if (!isApiError(error)) {
          console.error('Error fetching neighborhoods:', error);
        }
        // Set empty array on error to prevent UI issues
        setNeighborhoods([]);
      } finally {
        setLoadingNeighborhoods(false);
      }
    };

    fetchNeighborhoods();
  }, []);

  // Sync local state with URL params when they change externally
  useEffect(() => {
    const urlMinPrice = searchParams.get('min_price') || '';
    const urlMaxPrice = searchParams.get('max_price') || '';
    const urlSearch = searchParams.get('search') || '';
    
    if (urlMinPrice !== localMinPrice) {
      setLocalMinPrice(urlMinPrice);
    }
    if (urlMaxPrice !== localMaxPrice) {
      setLocalMaxPrice(urlMaxPrice);
    }
    if (urlSearch !== localSearch) {
      setLocalSearch(urlSearch);
    }
  }, [searchParams]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (minPriceTimerRef.current) clearTimeout(minPriceTimerRef.current);
      if (maxPriceTimerRef.current) clearTimeout(maxPriceTimerRef.current);
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  // Debounced handlers for price inputs
  const handleMinPriceChange = useCallback((value: string) => {
    setLocalMinPrice(value);
    
    if (minPriceTimerRef.current) {
      clearTimeout(minPriceTimerRef.current);
    }
    
    minPriceTimerRef.current = setTimeout(() => {
      onFilterChange('min_price', value || null);
    }, 800);
  }, [onFilterChange]);

  const handleMaxPriceChange = useCallback((value: string) => {
    setLocalMaxPrice(value);
    
    if (maxPriceTimerRef.current) {
      clearTimeout(maxPriceTimerRef.current);
    }
    
    maxPriceTimerRef.current = setTimeout(() => {
      onFilterChange('max_price', value || null);
    }, 800);
  }, [onFilterChange]);

  // Debounced handler for search input
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    searchTimerRef.current = setTimeout(() => {
      onFilterChange('search', value || null);
    }, 500);
  }, [onFilterChange]);

  const handleTypeChange = (value: string) => {
    onFilterChange('type', value === 'all' ? null : value);
  };

  const handleBedroomsChange = (value: string) => {
    onFilterChange('bedrooms', value === 'all' ? null : value);
  };

  const handleBathroomsChange = (value: string) => {
    onFilterChange('bathrooms', value === 'all' ? null : value);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    const currentAmenities = searchParams.get('amenities')?.split(',') || [];
    let newAmenities: string[];
    
    if (checked) {
      newAmenities = [...currentAmenities, amenity].filter(Boolean);
    } else {
      newAmenities = currentAmenities.filter((a) => a !== amenity);
    }
    
    onFilterChange('amenities', newAmenities.length > 0 ? newAmenities.join(',') : null);
  };

  const currentType = searchParams.get('type') || 'all';
  const currentNeighborhood = searchParams.get('neighborhood_id') || '';
  const currentBedrooms = searchParams.get('bedrooms') || 'all';
  const currentBathrooms = searchParams.get('bathrooms') || 'all';
  const currentAmenities = searchParams.get('amenities')?.split(',') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary text-start">{getTranslation('contact.filters', 'الفلاتر', 'Filters')}</h3>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Search Keyword with Autocomplete */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium text-gray-700 text-start">
          {getTranslation('contact.search', 'بحث', 'Search')}
        </Label>
        <SearchAutocomplete
          value={localSearch}
          onChange={(value) => handleSearchChange(value)}
          onSelect={(value) => {
            handleSearchChange(value);
            onFilterChange('search', value || null);
          }}
          placeholder={getTranslation('contact.searchProperties', 'بحث في العقارات...', 'Search properties...')}
          className="w-full"
        />
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700 text-start">{getTranslation('contact.propertyType', 'نوع العقار', 'Property Type')}</Label>
        <RadioGroup value={currentType} onValueChange={handleTypeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="type-all" />
            <Label htmlFor="type-all" className="font-normal cursor-pointer text-sm text-start">
              {getTranslation('contact.allTypes', 'جميع الأنواع', 'All Types')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sale" id="type-sale" />
            <Label htmlFor="type-sale" className="font-normal cursor-pointer text-sm text-start">
              {getTranslation('contact.buy', 'شراء', 'Buy')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rent" id="type-rent" />
            <Label htmlFor="type-rent" className="font-normal cursor-pointer text-sm text-start">
              {getTranslation('contact.rent', 'إيجار', 'Rent')}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hotel" id="type-hotel" />
            <Label htmlFor="type-hotel" className="font-normal cursor-pointer text-sm text-start">
              {getTranslation('contact.hotel', 'فندق', 'Hotel')}
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Neighborhood */}
      <div className="space-y-2">
        <Label htmlFor="neighborhood" className="text-sm font-medium text-gray-700 text-start">
          {getTranslation('contact.neighborhood', 'الحي', 'Neighborhood')}
        </Label>
        <Select
          value={currentNeighborhood || 'all'}
          onValueChange={(value) => onFilterChange('neighborhood_id', value === 'all' ? null : value)}
        >
          <SelectTrigger id="neighborhood" className="bg-white h-9 text-start">
            <SelectValue placeholder={getTranslation('contact.allNeighborhoods', 'جميع الأحياء', 'All Neighborhoods')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{getTranslation('contact.allNeighborhoods', 'جميع الأحياء', 'All Neighborhoods')}</SelectItem>
            {neighborhoods.map((neighborhood) => (
              <SelectItem key={neighborhood.id} value={neighborhood.id.toString()}>
                {neighborhood.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range with Bronze Accent */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-700">{t('filters.priceRange')}</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="min_price" className="text-xs text-gray-500">
              {t('filters.minPrice')}
            </Label>
            <Input
              id="min_price"
              type="number"
              placeholder={t('filters.minPrice')}
              value={localMinPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="bg-white h-9 focus:border-secondary focus:ring-secondary/20"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="max_price" className="text-xs text-gray-500">
              {t('filters.maxPrice')}
            </Label>
            <Input
              id="max_price"
              type="number"
              placeholder={t('filters.maxPrice')}
              value={localMaxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="bg-white h-9 focus:border-secondary focus:ring-secondary/20"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Bedrooms */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{t('filters.bedrooms')}</Label>
        <Select value={currentBedrooms} onValueChange={handleBedroomsChange}>
          <SelectTrigger className="bg-white h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.all')}</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bathrooms */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">{t('property.bathrooms')}</Label>
        <Select value={currentBathrooms} onValueChange={handleBathroomsChange}>
          <SelectTrigger className="bg-white h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.all')}</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Amenities - Using Accordion */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="amenities" className="border-0">
          <AccordionTrigger className="text-sm font-medium text-gray-700 py-2 hover:no-underline">
            {t('filters.amenities')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {commonAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={currentAmenities.includes(amenity)}
                    onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                    className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                  />
                  <Label
                    htmlFor={`amenity-${amenity}`}
                    className="font-normal cursor-pointer text-sm text-gray-600"
                  >
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      {/* Search Button - Full Width, Bold, Bronze */}
      <Button
        onClick={() => {
          // Apply all current filters
          // Filters are already applied via onFilterChange, but this provides visual feedback
        }}
        className={cn("w-full bg-secondary hover:bg-secondary/90 text-white font-bold text-base h-11 rounded-lg shadow-md hover:shadow-lg transition-all duration-200", locale === 'ar' && 'flex-row-reverse')}
      >
        <Search className={cn("w-4 h-4", locale === 'ar' ? 'ml-2' : 'mr-2')} />
        {getTranslation('contact.applyFilters', 'تطبيق الفلاتر', 'Apply Filters')}
      </Button>

      {/* Reset Button */}
      <Button
        variant="outline"
        className="w-full border-gray-300 hover:bg-gray-50"
        onClick={onReset}
      >
        {getTranslation('contact.resetFilters', 'إعادة تعيين الفلاتر', 'Reset Filters')}
      </Button>
    </div>
  );
}
