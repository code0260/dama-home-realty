'use client';

import { Search, Filter } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/button';

interface NoResultsProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function NoResults({ 
  title = 'No Results Found',
  description = 'Try adjusting your filters or search terms to find what you\'re looking for.',
  onReset 
}: NoResultsProps) {
  return (
    <EmptyState
      icon={Search}
      title={title}
      description={description}
      action={onReset ? {
        label: 'Reset Filters',
        onClick: onReset,
      } : undefined}
    >
      <div className="mt-6 flex gap-2">
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Adjust Filters
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="/properties">Browse All</a>
        </Button>
      </div>
    </EmptyState>
  );
}

