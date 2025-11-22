'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPin, Search } from 'lucide-react';
import { Neighborhood } from '@/types';
import axiosInstance from '@/lib/axios';
import { cn } from '@/lib/utils';

interface SearchSuggestionsProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (neighborhoodId: string) => void;
  className?: string;
}

export function SearchSuggestions({
  value,
  onChange,
  onSelect,
  className,
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value || value.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get<{ data: Neighborhood[] }>(
          '/neighborhoods',
          {
            params: {
              city: 'Damascus',
              locale: 'en',
              search: value,
            },
          }
        );
        const neighborhoodsData = response.data?.data || [];
        setSuggestions(
          Array.isArray(neighborhoodsData)
            ? neighborhoodsData.slice(0, 5)
            : []
        );
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (neighborhood: Neighborhood) => {
    onChange(neighborhood.name);
    onSelect(neighborhood.id.toString());
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl border-gray-200 max-h-64 overflow-y-auto">
          <div className="p-2">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Searching...
              </div>
            ) : (
              <div className="space-y-1">
                {suggestions.map((neighborhood) => (
                  <button
                    key={neighborhood.id}
                    onClick={() => handleSelect(neighborhood)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3 group"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-secondary transition-colors shrink-0" />
                    <div>
                      <div className="font-medium text-primary group-hover:text-secondary transition-colors">
                        {neighborhood.name}
                      </div>
                      {neighborhood.city && (
                        <div className="text-sm text-gray-500">
                          {neighborhood.city}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

