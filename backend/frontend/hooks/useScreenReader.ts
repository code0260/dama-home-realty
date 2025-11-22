'use client';

import { useEffect, useState, useCallback } from 'react';
import { announceToScreenReader } from '@/lib/accessibility';

/**
 * Hook for screen reader announcements
 */
export function useScreenReader() {
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' | 'off' = 'polite') => {
      announceToScreenReader(message, priority);
    },
    []
  );

  return { announce };
}

/**
 * Hook for detecting if screen reader is active
 */
export function useScreenReaderDetection() {
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  useEffect(() => {
    // Check for screen reader by detecting specific aria attributes or behaviors
    // This is a simple detection - not 100% accurate
    const checkScreenReader = () => {
      const hasAriaAttributes = document.querySelector('[aria-label], [aria-labelledby], [role]');
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Additional checks can be added here
      setIsScreenReaderActive(!!hasAriaAttributes || prefersReducedMotion);
    };

    checkScreenReader();
    const interval = setInterval(checkScreenReader, 5000);

    return () => clearInterval(interval);
  }, []);

  return isScreenReaderActive;
}

/**
 * Hook for live region announcements
 */
export function useLiveRegion(priority: 'polite' | 'assertive' = 'polite') {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const announce = useCallback((text: string) => {
    setMessage(text);
  }, []);

  return { message, announce };
}

