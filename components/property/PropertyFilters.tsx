'use client';

import { useState, useEffect } from 'react';
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
import { X, Filter } from 'lucide-react';
import { Neighborhood } from '@/types';
import axiosInstance from '@/lib/axios';

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
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loadingNeighborhoods, setLoadingNeighborhoods] = useState(true);

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const response = await axiosInstance.get<{ data: Neighborhood[] }>('/neighborhoods', {
          params: { city: 'Damascus', locale: 'en' },
        });
        setNeighborhoods(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching neighborhoods:', error);
      } finally {
        setLoadingNeighborhoods(false);
      }
    };

    fetchNeighborhoods();
  }, []);

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
  const currentMinPrice = searchParams.get('min_price') || '';
  const currentMaxPrice = searchParams.get('max_price') || '';
  const currentBedrooms = searchParams.get('bedrooms') || 'all';
  const currentBathrooms = searchParams.get('bathrooms') || 'all';
  const currentAmenities = searchParams.get('amenities')?.split(',') || [];
  const currentSearch = searchParams.get('search') || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary">Filters</h3>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Search Keyword */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search properties..."
          value={currentSearch}
          onChange={(e) => onFilterChange('search', e.target.value || null)}
        />
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <Label>Property Type</Label>
        <RadioGroup value={currentType} onValueChange={handleTypeChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="type-all" />
            <Label htmlFor="type-all" className="font-normal cursor-pointer">All Types</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sale" id="type-sale" />
            <Label htmlFor="type-sale" className="font-normal cursor-pointer">Buy</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rent" id="type-rent" />
            <Label htmlFor="type-rent" className="font-normal cursor-pointer">Rent</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hotel" id="type-hotel" />
            <Label htmlFor="type-hotel" className="font-normal cursor-pointer">Hotel</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      {/* Neighborhood */}
      <div className="space-y-2">
        <Label htmlFor="neighborhood">Neighborhood</Label>
        <Select
          value={currentNeighborhood || 'all'}
          onValueChange={(value) => onFilterChange('neighborhood_id', value === 'all' ? null : value)}
        >
          <SelectTrigger id="neighborhood">
            <SelectValue placeholder="All Neighborhoods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Neighborhoods</SelectItem>
            {neighborhoods.map((neighborhood) => (
              <SelectItem key={neighborhood.id} value={neighborhood.id.toString()}>
                {neighborhood.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label>Price Range</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="min_price" className="text-xs text-gray-500">Min</Label>
            <Input
              id="min_price"
              type="number"
              placeholder="Min"
              value={currentMinPrice}
              onChange={(e) => onFilterChange('min_price', e.target.value || null)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="max_price" className="text-xs text-gray-500">Max</Label>
            <Input
              id="max_price"
              type="number"
              placeholder="Max"
              value={currentMaxPrice}
              onChange={(e) => onFilterChange('max_price', e.target.value || null)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Bedrooms */}
      <div className="space-y-3">
        <Label>Bedrooms</Label>
        <Select value={currentBedrooms} onValueChange={handleBedroomsChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bathrooms */}
      <div className="space-y-3">
        <Label>Bathrooms</Label>
        <Select value={currentBathrooms} onValueChange={handleBathroomsChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Amenities */}
      <div className="space-y-3">
        <Label>Amenities</Label>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {commonAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={currentAmenities.includes(amenity)}
                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
              />
              <Label htmlFor={`amenity-${amenity}`} className="font-normal cursor-pointer text-sm">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Reset Button */}
      <Button variant="outline" className="w-full" onClick={onReset}>
        Reset Filters
      </Button>
    </div>
  );
}

