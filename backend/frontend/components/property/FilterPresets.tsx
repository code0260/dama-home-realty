'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, Home, Users, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

export interface FilterPreset {
  id: string;
  name: string;
  icon: React.ReactNode;
  filters: Record<string, string | null>;
  description?: string;
}

interface FilterPresetsProps {
  presets?: FilterPreset[];
  onPresetSelect: (preset: FilterPreset) => void;
  className?: string;
}

export function FilterPresets({ presets, onPresetSelect, className }: FilterPresetsProps) {
  const { t, locale } = useLanguage();

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

  const defaultPresets: FilterPreset[] = [
    {
      id: 'luxury',
      name: getTranslation('contact.luxury', 'فاخر', 'Luxury'),
      icon: <Sparkles className="w-4 h-4" />,
      filters: {
        min_price: '500000',
        amenities: 'Air Conditioning,Heating,Security',
      },
      description: 'Premium properties with luxury amenities',
    },
    {
      id: 'budget',
      name: getTranslation('contact.budget', 'ميزانية', 'Budget'),
      icon: <DollarSign className="w-4 h-4" />,
      filters: {
        max_price: '100000',
        type: 'rent',
      },
      description: 'Affordable options for everyone',
    },
    {
      id: 'family',
      name: getTranslation('contact.familyFriendly', 'صديق للعائلة', 'Family-Friendly'),
      icon: <Users className="w-4 h-4" />,
      filters: {
        bedrooms: '3',
        amenities: 'Parking,Security,Garden',
      },
      description: 'Perfect for families',
    },
    {
      id: 'new',
      name: getTranslation('contact.newListings', 'عروض جديدة', 'New Listings'),
      icon: <Home className="w-4 h-4" />,
      filters: {
        // Will be sorted by newest
      },
      description: 'Recently added properties',
    },
  ];

  const presetsToUse = presets || defaultPresets;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-start">{getTranslation('contact.quickFilters', 'فلاتر سريعة', 'Quick Filters')}</h4>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {presetsToUse.map((preset) => (
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

