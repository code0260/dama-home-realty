'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Minus, Plus, Type } from 'lucide-react';

type TextSize = 'small' | 'medium' | 'large' | 'xlarge';

interface TextSizeControlsProps {
  className?: string;
  showLabel?: boolean;
}

/**
 * Text size controls component for accessibility
 */
export function TextSizeControls({ className, showLabel = true }: TextSizeControlsProps) {
  const [textSize, setTextSize] = useState<TextSize>('medium');

  useEffect(() => {
    // Load saved text size from localStorage
    const saved = localStorage.getItem('text-size') as TextSize;
    if (saved) {
      setTextSize(saved);
      applyTextSize(saved);
    }
  }, []);

  const applyTextSize = (size: TextSize) => {
    const root = document.documentElement;
    
    // Remove all text size classes
    root.classList.remove('text-size-small', 'text-size-medium', 'text-size-large', 'text-size-xlarge');
    
    // Add new text size class
    root.classList.add(`text-size-${size}`);
    
    // Save to localStorage
    localStorage.setItem('text-size', size);
  };

  const handleIncrease = () => {
    const sizes: TextSize[] = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(textSize);
    if (currentIndex < sizes.length - 1) {
      const newSize = sizes[currentIndex + 1];
      setTextSize(newSize);
      applyTextSize(newSize);
    }
  };

  const handleDecrease = () => {
    const sizes: TextSize[] = ['small', 'medium', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(textSize);
    if (currentIndex > 0) {
      const newSize = sizes[currentIndex - 1];
      setTextSize(newSize);
      applyTextSize(newSize);
    }
  };

  const handleReset = () => {
    setTextSize('medium');
    applyTextSize('medium');
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
          <Type className="w-4 h-4" />
          Text Size:
        </span>
      )}
      <div className="flex items-center gap-1 border rounded-md p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDecrease}
          disabled={textSize === 'small'}
          aria-label="Decrease text size"
          className="h-8 w-8 p-0"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 px-2 min-w-[60px] text-center">
          {textSize.charAt(0).toUpperCase() + textSize.slice(1)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleIncrease}
          disabled={textSize === 'xlarge'}
          aria-label="Increase text size"
          className="h-8 w-8 p-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        aria-label="Reset text size to default"
        className="h-8 text-xs"
      >
        Reset
      </Button>
    </div>
  );
}

