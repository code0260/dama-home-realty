'use client';

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActiveFiltersCountProps {
  count: number;
  onClear?: () => void;
  className?: string;
}

export function ActiveFiltersCount({ count, onClear, className }: ActiveFiltersCountProps) {
  if (count === 0) return null;

  return (
    <div className={className}>
      <Badge
        variant="secondary"
        className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20 transition-colors flex items-center gap-2 px-3 py-1.5"
      >
        <span className="font-semibold">{count}</span>
        <span className="text-sm">Active Filter{count !== 1 ? 's' : ''}</span>
        {onClear && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-auto p-0 w-4 h-4 rounded-full hover:bg-secondary/20"
            aria-label="Clear all filters"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </Badge>
    </div>
  );
}

