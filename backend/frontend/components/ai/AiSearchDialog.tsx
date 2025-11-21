'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Sparkles, X } from 'lucide-react';
import { Property } from '@/types';
import { PropertyCard } from '@/components/ui-custom/PropertyCard';
import axiosInstance from '@/lib/axios';
import { getCsrfCookie } from '@/lib/api';
import Link from 'next/link';

interface AiSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AiSearchResponse {
  query: string;
  extracted_filters: Record<string, any>;
  data: Property[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export function AiSearchDialog({ open, onOpenChange }: AiSearchDialogProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [extractedFilters, setExtractedFilters] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState<AiSearchResponse['pagination'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get CSRF cookie when dialog opens
  useEffect(() => {
    if (open) {
      getCsrfCookie().catch(console.error);
    }
  }, [open]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Ensure CSRF cookie is available
      await getCsrfCookie();

      const response = await axiosInstance.post<AiSearchResponse>('/ai-search', {
        query: query.trim(),
        per_page: 12,
      });

      setResults(response.data.data || []);
      setExtractedFilters(response.data.extracted_filters || {});
      setPagination(response.data.pagination);
    } catch (err: any) {
      console.error('AI Search Error:', err);
      setError(err.response?.data?.message || 'Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setExtractedFilters({});
    setPagination(null);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            AI Magic Search
          </DialogTitle>
          <DialogDescription>
            Describe what you're looking for in natural language. Our AI will find the perfect properties for you.
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex gap-2 mt-4">
          <div className="flex-1 relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., 'cheap flat in Malki with solar power' or '2 bedroom villa with pool'"
              className="pr-10"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Extracted Filters Display */}
        {Object.keys(extractedFilters).length > 0 && (
          <div className="mt-4 p-3 bg-secondary/10 rounded-lg">
            <p className="text-sm font-medium mb-2">AI understood:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(extractedFilters).map(([key, value]) => (
                <span
                  key={key}
                  className="px-2 py-1 bg-secondary/20 text-secondary text-xs rounded-full"
                >
                  {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Found {pagination?.total || results.length} {pagination?.total === 1 ? 'property' : 'properties'}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((property) => (
                <Link key={property.id} href={`/properties/${property.slug}`}>
                  <PropertyCard property={property} />
                </Link>
              ))}
            </div>
            {pagination && pagination.last_page > 1 && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Showing page {pagination.current_page} of {pagination.last_page}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && query && !error && (
          <div className="mt-8 text-center text-gray-500">
            <p>No properties found matching your search.</p>
            <p className="text-sm mt-2">Try rephrasing your query or use different keywords.</p>
          </div>
        )}

        {/* Initial State */}
        {!loading && results.length === 0 && !query && (
          <div className="mt-8 text-center text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-secondary/30" />
            <p>Start typing to search with AI...</p>
            <div className="mt-4 text-sm space-y-1">
              <p className="font-medium">Example searches:</p>
              <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                <li>"cheap apartment in Malki"</li>
                <li>"villa with pool and garden"</li>
                <li>"2 bedroom flat under 300 USD"</li>
                <li>"apartment with solar power"</li>
              </ul>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

