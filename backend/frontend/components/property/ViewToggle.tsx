'use client';

import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Map, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'grid' | 'list' | 'map' | 'gallery';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  showMap?: boolean;
  showGallery?: boolean;
  className?: string;
}

export function ViewToggle({
  viewMode,
  onViewChange,
  showMap = true,
  showGallery = true,
  className,
}: ViewToggleProps) {
  const views: { mode: ViewMode; icon: React.ReactNode; label: string; show: boolean }[] = [
    { mode: 'grid', icon: <LayoutGrid className="w-4 h-4" />, label: 'Grid', show: true },
    { mode: 'list', icon: <List className="w-4 h-4" />, label: 'List', show: true },
    { mode: 'map', icon: <Map className="w-4 h-4" />, label: 'Map', show: showMap },
    { mode: 'gallery', icon: <ImageIcon className="w-4 h-4" />, label: 'Gallery', show: showGallery },
  ];

  return (
    <div className={cn('flex items-center gap-2 bg-gray-100 dark:bg-primary-800 rounded-lg p-1', className)}>
      {views
        .filter((view) => view.show)
        .map((view) => (
          <Button
            key={view.mode}
            variant="ghost"
            size="sm"
            onClick={() => onViewChange(view.mode)}
            className={cn(
              'h-9 px-4 rounded-md transition-all duration-200 flex items-center gap-2',
              viewMode === view.mode
                ? 'bg-white dark:bg-primary-700 text-secondary shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-secondary'
            )}
            aria-label={`${view.label} view`}
          >
            {view.icon}
            <span className="hidden sm:inline">{view.label}</span>
          </Button>
        ))}
    </div>
  );
}

