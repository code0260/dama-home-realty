'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Clock, X, TrendingUp } from 'lucide-react';
import { Neighborhood } from '@/types';
import axiosInstance from '@/lib/axios';
import { cn } from '@/lib/utils';

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

const MAX_HISTORY = 10;

export function SearchAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = 'Search properties...',
  className,
}: SearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Neighborhood[]>([]);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load search history
  useEffect(() => {
    const saved = localStorage.getItem('propertySearchHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY) : []);
      } catch {
        setHistory([]);
      }
    }
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value || value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await axiosInstance.get<{ data: Neighborhood[] }>('/neighborhoods', {
          params: {
            city: 'Damascus',
            locale: 'en',
            search: value,
          },
        });
        const neighborhoodsData = response.data?.data || [];
        setSuggestions(Array.isArray(neighborhoodsData) ? neighborhoodsData.slice(0, 5) : []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const saveToHistory = useCallback((query: string) => {
    if (!query.trim()) return;

    setHistory((prev) => {
      const filtered = prev.filter((item) => item.query.toLowerCase() !== query.toLowerCase());
      const newHistory = [
        { query: query.trim(), timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY);
      localStorage.setItem('propertySearchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const handleSelect = (query: string) => {
    onChange(query);
    saveToHistory(query);
    setShowSuggestions(false);
    if (onSelect) {
      onSelect(query);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('propertySearchHistory');
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    if (newValue.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputFocus = () => {
    if (value.length >= 2 || history.length > 0) {
      setShowSuggestions(true);
    }
  };

  const hasResults = suggestions.length > 0 || history.length > 0;

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          className="pl-9 pr-9"
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => {
              onChange('');
              setShowSuggestions(false);
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Suggestions & History */}
      {showSuggestions && hasResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg max-h-[400px] overflow-y-auto">
          <div className="p-2">
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="mb-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  Suggestions
                </div>
                {suggestions.map((suggestion) => (
                  <Button
                    key={suggestion.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => handleSelect(suggestion.name)}
                  >
                    <Search className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{suggestion.name}</span>
                  </Button>
                ))}
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Recent Searches
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="h-auto p-1 text-xs text-red-500 hover:text-red-700"
                  >
                    Clear
                  </Button>
                </div>
                {history.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => handleSelect(item.query)}
                  >
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="flex-1">{item.query}</span>
                  </Button>
                ))}
              </div>
            )}

            {loading && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">Loading...</div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

