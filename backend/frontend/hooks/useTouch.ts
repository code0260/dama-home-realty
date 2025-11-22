'use client';

import { useCallback, useEffect, useRef } from 'react';
import { vibrate } from '@/lib/mobile';

export interface TouchHandlers {
  onTap?: (e: TouchEvent) => void;
  onDoubleTap?: (e: TouchEvent) => void;
  onLongPress?: (e: TouchEvent) => void;
  onPinch?: (scale: number) => void;
}

export interface TouchOptions {
  longPressDelay?: number;
  doubleTapDelay?: number;
  preventDoubleTapZoom?: boolean;
  hapticFeedback?: boolean;
}

const DEFAULT_OPTIONS: TouchOptions = {
  longPressDelay: 500,
  doubleTapDelay: 300,
  preventDoubleTapZoom: true,
  hapticFeedback: false,
};

/**
 * Hook for touch interactions
 */
export function useTouch(
  handlers: TouchHandlers,
  options: TouchOptions = {}
) {
  const elementRef = useRef<HTMLElement>(null);
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const lastTap = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosition = useRef<{ x: number; y: number } | null>(null);
  const initialDistance = useRef<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartPosition.current = { x: touch.clientX, y: touch.clientY };

    // Long press
    if (handlers.onLongPress) {
      longPressTimer.current = setTimeout(() => {
        if (opts.hapticFeedback) {
          vibrate(50);
        }
        handlers.onLongPress?.(e);
      }, opts.longPressDelay || 500);
    }

    // Pinch gesture (two touches)
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      initialDistance.current = distance;
    }
  }, [handlers, opts.longPressDelay, opts.hapticFeedback]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Cancel long press if moved
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Pinch gesture
    if (e.touches.length === 2 && handlers.onPinch && initialDistance.current > 0) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scale = currentDistance / initialDistance.current;
      handlers.onPinch(scale);
    }
  }, [handlers]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Cancel long press
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Reset pinch
    initialDistance.current = 0;

    if (!touchStartPosition.current) return;

    const touch = e.changedTouches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPosition.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartPosition.current.y);
    
    // If moved too much, don't trigger tap
    if (deltaX > 10 || deltaY > 10) {
      touchStartPosition.current = null;
      return;
    }

    // Single tap
    const now = Date.now();
    const timeSinceLastTap = now - lastTap.current;

    if (timeSinceLastTap < (opts.doubleTapDelay || 300)) {
      // Double tap
      if (opts.hapticFeedback) {
        vibrate([50, 50, 50]);
      }
      handlers.onDoubleTap?.(e);
      lastTap.current = 0;
    } else {
      // Single tap
      lastTap.current = now;
      setTimeout(() => {
        if (lastTap.current === now) {
          if (opts.hapticFeedback) {
            vibrate(10);
          }
          handlers.onTap?.(e);
        }
      }, opts.doubleTapDelay || 300);
    }

    touchStartPosition.current = null;
  }, [handlers, opts.doubleTapDelay, opts.hapticFeedback]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    if (opts.preventDoubleTapZoom) {
      let lastTouchEnd = 0;
      const preventZoom = (e: TouchEvent) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      };
      element.addEventListener('touchend', preventZoom, { passive: false });

      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchend', preventZoom);
        
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
        }
      };
    }

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, opts.preventDoubleTapZoom]);

  return elementRef;
}

