'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Square, X, RotateCcw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawSearchAreaProps {
  map: google.maps.Map | null;
  onAreaDrawn?: (bounds: google.maps.LatLngBounds | null) => void;
  enabled: boolean;
  onToggle: () => void;
  className?: string;
}

export function DrawSearchArea({
  map,
  onAreaDrawn,
  enabled,
  onToggle,
  className,
}: DrawSearchAreaProps) {
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const rectangleRef = useRef<google.maps.Rectangle | null>(null);
  const [hasDrawnArea, setHasDrawnArea] = useState(false);

  useEffect(() => {
    if (!map || !enabled) {
      // Cleanup when disabled
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null);
        drawingManagerRef.current = null;
      }
      if (rectangleRef.current) {
        rectangleRef.current.setMap(null);
        rectangleRef.current = null;
      }
      return;
    }

    // Initialize drawing manager
    if (!drawingManagerRef.current) {
      drawingManagerRef.current = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
        drawingControl: false,
        rectangleOptions: {
          fillColor: '#B49162',
          fillOpacity: 0.2,
          strokeColor: '#B49162',
          strokeWeight: 2,
          clickable: false,
          editable: true,
          draggable: true,
        },
      });

      drawingManagerRef.current.setMap(map);

      // Listen for rectangle complete event
      google.maps.event.addListener(
        drawingManagerRef.current,
        'rectanglecomplete',
        (rectangle: google.maps.Rectangle) => {
          // Remove previous rectangle if exists
          if (rectangleRef.current) {
            rectangleRef.current.setMap(null);
          }

          rectangleRef.current = rectangle;
          setHasDrawnArea(true);

          // Get bounds and notify parent
          const bounds = rectangle.getBounds();
          if (bounds && onAreaDrawn) {
            onAreaDrawn(bounds);
          }

          // Listen for bounds changes
          rectangle.addListener('bounds_changed', () => {
            const updatedBounds = rectangle.getBounds();
            if (updatedBounds && onAreaDrawn) {
              onAreaDrawn(updatedBounds);
            }
          });

          // Disable drawing mode after rectangle is drawn
          drawingManagerRef.current?.setDrawingMode(null);
        }
      );
    }

    // Enable rectangle drawing mode
    drawingManagerRef.current.setDrawingMode(google.maps.drawing.OverlayType.RECTANGLE);
  }, [map, enabled, onAreaDrawn]);

  const handleClear = () => {
    if (rectangleRef.current) {
      rectangleRef.current.setMap(null);
      rectangleRef.current = null;
      setHasDrawnArea(false);
      if (onAreaDrawn) {
        onAreaDrawn(null);
      }
    }
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  };

  const handleSearch = () => {
    if (rectangleRef.current) {
      const bounds = rectangleRef.current.getBounds();
      if (bounds && onAreaDrawn) {
        onAreaDrawn(bounds);
      }
    }
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <Button
        variant={enabled ? 'default' : 'outline'}
        size="sm"
        onClick={onToggle}
        className={cn(
          enabled && 'bg-secondary hover:bg-secondary/90 text-white',
          'bg-white hover:bg-gray-50 shadow-lg border-gray-200 dark:bg-primary-800 dark:border-primary-700'
        )}
      >
        <Square className="w-4 h-4 mr-2" />
        {enabled ? 'Drawing...' : 'Draw Area'}
      </Button>
      {hasDrawnArea && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSearch}
            className="bg-white hover:bg-gray-50 shadow-lg border-gray-200 dark:bg-primary-800 dark:border-primary-700"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="bg-white hover:bg-gray-50 shadow-lg border-gray-200 dark:bg-primary-800 dark:border-primary-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </>
      )}
    </div>
  );
}

