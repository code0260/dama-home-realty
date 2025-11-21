'use client';

import {
  Wifi,
  Sun,
  Car,
  Trees,
  Home,
  Building2,
  Shield,
  Wind,
  Flame,
  Sofa,
  Tv,
  Droplets,
  UtensilsCrossed,
  Dumbbell,
  Waves,
  Snowflake,
  Fan,
  Lock,
  Camera,
  Sprout,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface AmenityIconProps {
  amenity: string;
  size?: number;
  className?: string;
}

const amenityIconMap: Record<string, LucideIcon> = {
  wifi: Wifi,
  'wi-fi': Wifi,
  internet: Wifi,
  'solar power': Sun,
  solar: Sun,
  parking: Car,
  garden: Trees,
  balcony: Home,
  elevator: Building2,
  lift: Building2,
  security: Shield,
  'air conditioning': Wind,
  ac: Wind,
  heating: Flame,
  furnished: Sofa,
  tv: Tv,
  television: Tv,
  pool: Waves,
  swimming: Waves,
  gym: Dumbbell,
  fitness: Dumbbell,
  kitchen: UtensilsCrossed,
  fireplace: Flame,
  'water heater': Droplets,
  'cctv': Camera,
  surveillance: Camera,
  'green space': Sprout,
  'snowflake': Snowflake,
  fan: Fan,
  lock: Lock,
};

export function AmenityIcon({ amenity, size = 24, className = '' }: AmenityIconProps) {
  const normalizedAmenity = amenity.toLowerCase().trim();
  const IconComponent = amenityIconMap[normalizedAmenity] || Home;

  return <IconComponent size={size} className={className} />;
}

