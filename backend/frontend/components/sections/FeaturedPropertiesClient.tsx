'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types';
import { PropertyCard } from '@/components/ui-custom/PropertyCard';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface FeaturedPropertiesClientProps {
  properties: Property[];
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

type ViewMode = 'grid' | 'list';

export function FeaturedPropertiesClient({ 
  properties, 
  hasMore = false,
  loadingMore = false,
  onLoadMore 
}: FeaturedPropertiesClientProps) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Load view mode from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('propertiesViewMode') as ViewMode;
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view mode to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('propertiesViewMode', mode);
  };

  if (properties.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('properties.noProperties')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
                {t('properties.featured')}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl">
                {t('properties.featuredSubtitle')}
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                className={cn(
                  'h-9 px-4 rounded-md transition-all duration-200',
                  viewMode === 'grid'
                    ? 'bg-white text-secondary shadow-sm'
                    : 'text-gray-600 hover:text-secondary'
                )}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
                {t('properties.gridView')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewModeChange('list')}
                className={cn(
                  'h-9 px-4 rounded-md transition-all duration-200',
                  viewMode === 'list'
                    ? 'bg-white text-secondary shadow-sm'
                    : 'text-gray-600 hover:text-secondary'
                )}
                aria-label="List view"
              >
                <List className="w-4 h-4 mr-2" />
                {t('properties.listView')}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Properties Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                : 'flex flex-col gap-6'
            )}
          >
            {properties.map((property) => (
              <PropertyCard 
                key={property.uuid} 
                property={property} 
                viewMode={viewMode}
              />
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Load More Button */}
        {hasMore && onLoadMore && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg font-semibold"
              size="lg"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('properties.loadMore')
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

