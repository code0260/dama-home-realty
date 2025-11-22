'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, X, Trash2, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface SavedFilter {
  id: string;
  name: string;
  filters: Record<string, string>;
  createdAt: number;
}

interface SavedFiltersProps {
  searchParams: URLSearchParams;
  onLoadFilter: (filters: Record<string, string>) => void;
  className?: string;
}

export function SavedFilters({ searchParams, onLoadFilter, className }: SavedFiltersProps) {
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filterName, setFilterName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('savedFilters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedFilters(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSavedFilters([]);
      }
    }
  }, []);

  const saveCurrentFilter = () => {
    if (!filterName.trim()) return;

    const filters: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (value) filters[key] = value;
    });

    if (Object.keys(filters).length === 0) return;

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName.trim(),
      filters,
      createdAt: Date.now(),
    };

    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem('savedFilters', JSON.stringify(updated));
    setFilterName('');
    setIsOpen(false);
  };

  const deleteFilter = (id: string) => {
    const updated = savedFilters.filter((f) => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem('savedFilters', JSON.stringify(updated));
  };

  const loadFilter = (filter: SavedFilter) => {
    const params = new URLSearchParams(filter.filters);
    router.push(`/properties?${params.toString()}`);
    setIsOpen(false);
  };

  const currentFilters: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (value) currentFilters[key] = value;
  });

  const hasFilters = Object.keys(currentFilters).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Save className="w-4 h-4 mr-2" />
          Saved Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Saved Filters</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Save Current Filter */}
          {hasFilters && (
            <div className="space-y-2 p-4 bg-gray-50 dark:bg-primary-900 rounded-lg">
              <Label htmlFor="filter-name">Save Current Filter</Label>
              <div className="flex gap-2">
                <Input
                  id="filter-name"
                  placeholder="Filter name..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveCurrentFilter()}
                />
                <Button onClick={saveCurrentFilter} size="sm" disabled={!filterName.trim()}>
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Saved Filters List */}
          <div className="max-h-[400px] overflow-y-auto">
            {savedFilters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Filter className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No saved filters yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-primary-800 rounded-lg border border-gray-200 dark:border-primary-700 hover:bg-gray-50 dark:hover:bg-primary-700 transition-colors"
                  >
                    <Button
                      variant="ghost"
                      onClick={() => loadFilter(filter)}
                      className="flex-1 justify-start"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {filter.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteFilter(filter.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

