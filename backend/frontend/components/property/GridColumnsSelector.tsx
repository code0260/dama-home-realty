'use client';

import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export type GridColumns = 2 | 3 | 4;

interface GridColumnsSelectorProps {
  value: GridColumns;
  onChange: (columns: GridColumns) => void;
  className?: string;
}

export function GridColumnsSelector({ value, onChange, className }: GridColumnsSelectorProps) {
  return (
    <div className={cn('flex items-center gap-1 bg-gray-100 dark:bg-primary-800 rounded-lg p-1', className)}>
      {([2, 3, 4] as GridColumns[]).map((columns) => (
        <Button
          key={columns}
          variant="ghost"
          size="sm"
          onClick={() => onChange(columns)}
          className={cn(
            'h-8 px-3 rounded-md transition-all duration-200 flex items-center gap-2',
            value === columns
              ? 'bg-white dark:bg-primary-700 text-secondary shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-secondary'
          )}
          aria-label={`${columns} columns`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="text-xs font-medium">{columns}</span>
        </Button>
      ))}
    </div>
  );
}

