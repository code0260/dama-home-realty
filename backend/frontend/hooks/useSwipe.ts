'use client';

import { useRef, useEffect, useState, useCallback } from 'react';

export interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export interface SwipeOptions {
  threshold?: number; // Minimum distance in pixels
  velocity?: number; // Minimum velocity in pixels per second
  preventDefault?: boolean;
}

const DEFAULT_OPTIONS: SwipeOptions = {
  threshold: 50,
  velocity: 300,
  preventDefault: true,
};

/**
 * Hook for swipe gestures
 */
export function useSwipe(
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    touchEnd.current = null;
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return;
    
    if (opts.preventDefault) {
      e.preventDefault();
    }
    
    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, [opts.preventDefault]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) {
      setIsSwiping(false);
      return;
    }

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = (touchEnd.current.time - touchStart.current.time) / 1000; // in seconds
    
    const distanceX = Math.abs(deltaX);
    const distanceY = Math.abs(deltaY);
    const velocityX = distanceX / deltaTime;
    const velocityY = distanceY / deltaTime;

    // Determine swipe direction
    const isHorizontalSwipe = distanceX > distanceY;
    const isVerticalSwipe = distanceY > distanceX;
    
    // Check if swipe meets threshold and velocity requirements
    if (isHorizontalSwipe && distanceX >= (opts.threshold || 50) && velocityX >= (opts.velocity || 300)) {
      if (deltaX > 0) {
        handlers.onSwipeRight?.();
      } else {
        handlers.onSwipeLeft?.();
      }
    } else if (isVerticalSwipe && distanceY >= (opts.threshold || 50) && velocityY >= (opts.velocity || 300)) {
      if (deltaY > 0) {
        handlers.onSwipeDown?.();
      } else {
        handlers.onSwipeUp?.();
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
    setIsSwiping(false);
  }, [handlers, opts.threshold, opts.velocity]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: !opts.preventDefault });
    element.addEventListener('touchmove', handleTouchMove, { passive: !opts.preventDefault });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, opts.preventDefault]);

  return { elementRef, isSwiping };
}

/**
 * Hook for pull-to-refresh gesture
 */
export function usePullToRefresh(
  onRefresh: () => void | Promise<void>,
  options: { threshold?: number; enabled?: boolean } = {}
) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const threshold = options.threshold || 80;
  const enabled = options.enabled !== false;

  const touchStart = useRef<{ y: number; scrollTop: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop === 0) {
        touchStart.current = {
          y: e.touches[0].clientY,
          scrollTop,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current) return;
      
      const deltaY = e.touches[0].clientY - touchStart.current.y;
      
      if (deltaY > 0 && window.pageYOffset === 0) {
        const distance = Math.min(deltaY * 0.5, threshold * 2);
        setPullDistance(distance);
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (!touchStart.current) return;
      
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        setPullDistance(0);
        await onRefresh();
        setIsRefreshing(false);
      } else {
        setPullDistance(0);
      }
      
      touchStart.current = null;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, pullDistance, threshold, isRefreshing, onRefresh]);

  return { isRefreshing, pullDistance, pullProgress: Math.min(pullDistance / threshold, 1) };
}

