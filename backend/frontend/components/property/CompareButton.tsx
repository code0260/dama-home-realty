'use client';

import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { GitCompare, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompareProperties } from './CompareProperties';

interface CompareButtonProps {
  property: Property;
  className?: string;
}

export function CompareButton({ property, className }: CompareButtonProps) {
  const { addProperty, removeProperty, isCompared, canAdd } = useCompareProperties();
  const compared = isCompared(property.id || 0);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (compared) {
      removeProperty(property.id || 0);
    } else if (canAdd) {
      addProperty(property);
    } else {
      // Show toast or alert that max compare reached
      alert(`You can compare up to 3 properties. Please remove one first.`);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        'h-9 w-9 p-0 bg-white/90 hover:bg-white backdrop-blur-sm shadow-md',
        compared && 'bg-secondary/10 text-secondary',
        !canAdd && !compared && 'opacity-50 cursor-not-allowed',
        className
      )}
      aria-label={compared ? 'Remove from compare' : 'Add to compare'}
      title={compared ? 'Remove from compare' : canAdd ? 'Add to compare' : 'Maximum 3 properties'}
    >
      {compared ? (
        <Check className="w-4 h-4" />
      ) : (
        <GitCompare className="w-4 h-4" />
      )}
    </Button>
  );
}

