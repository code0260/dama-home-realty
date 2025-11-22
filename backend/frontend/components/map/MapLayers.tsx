'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Map, Satellite, Layers, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapLayersProps {
  mapTypeId: string;
  onMapTypeChange: (mapTypeId: string) => void;
  className?: string;
}

const mapTypes = [
  {
    id: 'roadmap',
    label: 'Roadmap',
    icon: Map,
  },
  {
    id: 'satellite',
    label: 'Satellite',
    icon: Satellite,
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    icon: Layers,
  },
  {
    id: 'terrain',
    label: 'Terrain',
    icon: Navigation,
  },
];

export function MapLayers({ mapTypeId, onMapTypeChange, className }: MapLayersProps) {
  const currentMapType = mapTypes.find((type) => type.id === mapTypeId) || mapTypes[0];
  const CurrentIcon = currentMapType.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'bg-white hover:bg-gray-50 shadow-lg border-gray-200 dark:bg-primary-800 dark:border-primary-700',
            className
          )}
        >
          <CurrentIcon className="w-4 h-4 mr-2" />
          {currentMapType.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {mapTypes.map((type) => {
          const Icon = type.icon;
          return (
            <DropdownMenuItem
              key={type.id}
              onClick={() => onMapTypeChange(type.id)}
              className={cn(
                'cursor-pointer flex items-center gap-2',
                mapTypeId === type.id && 'bg-secondary/10 text-secondary font-semibold'
              )}
            >
              <Icon className="w-4 h-4" />
              {type.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

