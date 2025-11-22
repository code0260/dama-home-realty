'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, Home, Users, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  filters: Record<string, string | null>;
  description?: string;
}

const defaultPresets: FilterPreset[] = [
  {
    id: 'luxury',
    name: 'Luxury',
    icon: <Sparkles className="w-4 h-4" />,
    filters: {
      min_price: '500000',
      amenities: 'Air Conditioning,Heating,Security',
    },
    description: 'Premium properties with luxury amenities',
  },
  {
    id: 'budget',
    name: 'Budget',
    icon: <DollarSign className="w-4 h-4" />,
    filters: {
      max_price: '100000',
      type: 'rent',
    },
    description: 'Affordable options for everyone',
  },
  {
    id: 'family',
    name: 'Family-Friendly',
    icon: <Users className="w-4 h-4" />,
    filters: {
      bedrooms: '3',
      amenities: 'Parking,Security,Garden',
    },
    description: 'Perfect for families',
  },
  {
    id: 'new',
    name: 'New Listings',
    icon: <Home className="w-4 h-4" />,
    filters: {
      // Will be sorted by newest
    },
    description: 'Recently added properties',
  },
];

interface FilterPresetsProps {
  presets?: FilterPreset[];
  onPresetSelect: (preset: FilterPreset) => void;
  className?: string;
}

export function FilterPresets({ presets = defaultPresets, onPresetSelect, className }: FilterPresetsProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Filters</h4>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.id}
            variant="outline"
            size="sm"
            onClick={() => onPresetSelect(preset)}
            className={cn(
              'h-auto py-2 px-3 flex flex-col items-center gap-1.5 hover:bg-secondary/5 hover:border-secondary/30 transition-colors'
            )}
          >
            <div className="text-secondary">{preset.icon}</div>
            <span className="text-xs font-medium">{preset.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

