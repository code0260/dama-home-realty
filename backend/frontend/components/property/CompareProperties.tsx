'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { PropertyCard } from '@/components/ui-custom/PropertyCard';
import { cn } from '@/lib/utils';

const MAX_COMPARE = 3;

interface ComparePropertiesProps {
  properties: Property[];
  onRemove: (propertyId: number) => void;
  onClear: () => void;
  className?: string;
}

export function CompareProperties({ properties, onRemove, onClear, className }: ComparePropertiesProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (properties.length === 0) return null;

  return (
    <>
      {/* Compare Bar */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-primary-800 border-t border-gray-200 dark:border-primary-700 shadow-lg',
          className
        )}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 overflow-x-auto">
              <span className="text-sm font-semibold text-primary dark:text-white whitespace-nowrap">
                Comparing {properties.length} properties:
              </span>
              {properties.map((property) => (
                <Badge
                  key={property.id}
                  variant="outline"
                  className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-primary-700 border-secondary/30"
                >
                  <span className="text-sm line-clamp-1 max-w-[150px]">{property.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-secondary/10"
                    onClick={() => onRemove(property.id || 0)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClear} className="whitespace-nowrap">
                Clear All
              </Button>
              <Button
                size="sm"
                onClick={() => setIsOpen(true)}
                className="bg-secondary hover:bg-secondary/90 text-white whitespace-nowrap"
              >
                Compare <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl">Compare Properties</DialogTitle>
          </DialogHeader>
          <div className="max-h-[calc(90vh-100px)] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {properties.map((property) => (
                <div key={property.id} className="space-y-4">
                  <PropertyCard property={property} viewMode="grid" />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Hook for managing compared properties
export function useCompareProperties() {
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('comparedProperties');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setComparedProperties(Array.isArray(parsed) ? parsed : []);
      } catch {
        setComparedProperties([]);
      }
    }
  }, []);

  const addProperty = (property: Property) => {
    setComparedProperties((prev) => {
      if (prev.find((p) => (p.id || 0) === (property.id || 0))) return prev;
      if (prev.length >= MAX_COMPARE) {
        const newList = [prev[1], prev[2], property];
        localStorage.setItem('comparedProperties', JSON.stringify(newList));
        return newList;
      }
      const newList = [...prev, property];
      localStorage.setItem('comparedProperties', JSON.stringify(newList));
      return newList;
    });
  };

  const removeProperty = (propertyId: number) => {
    setComparedProperties((prev) => {
      const newList = prev.filter((p) => (p.id || 0) !== propertyId);
      localStorage.setItem('comparedProperties', JSON.stringify(newList));
      return newList;
    });
  };

  const clearProperties = () => {
    setComparedProperties([]);
    localStorage.removeItem('comparedProperties');
  };

  const isCompared = (propertyId: number) => {
    return comparedProperties.some((p) => p.id === propertyId);
  };

  const canAdd = comparedProperties.length < MAX_COMPARE;

  return {
    comparedProperties,
    addProperty,
    removeProperty,
    clearProperties,
    isCompared,
    canAdd,
  };
}

