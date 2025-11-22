'use client';

import { useEffect, useRef, RefObject } from 'react';
import { trapFocus, getFocusableElements } from '@/lib/accessibility';

/**
 * Hook for managing focus within a container
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement | null>, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const cleanup = trapFocus(containerRef.current);
    return cleanup;
  }, [containerRef, enabled]);
}

/**
 * Hook for auto-focus on mount
 */
export function useAutoFocus<T extends HTMLElement>(
  ref: RefObject<T | null>,
  enabled: boolean = true,
  delay: number = 0
) {
  useEffect(() => {
    if (!enabled || !ref.current) return;

    const timer = setTimeout(() => {
      ref.current?.focus();
    }, delay);

    return () => clearTimeout(timer);
  }, [ref, enabled, delay]);
}

/**
 * Hook for restoring focus after unmount
 */
export function useRestoreFocus() {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = () => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  };

  return { saveFocus, restoreFocus };
}

/**
 * Hook for focus within callback
 */
export function useFocusWithin(
  containerRef: RefObject<HTMLElement | null>,
  callback: (isFocused: boolean) => void
) {
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);

    const handleFocusIn = () => callback(true);
    const handleFocusOut = () => callback(false);

    focusableElements.forEach((el) => {
      el.addEventListener('focusin', handleFocusIn);
      el.addEventListener('focusout', handleFocusOut);
    });

    return () => {
      focusableElements.forEach((el) => {
        el.removeEventListener('focusin', handleFocusIn);
        el.removeEventListener('focusout', handleFocusOut);
      });
    };
  }, [containerRef, callback]);
}

/**
 * Hook for skipping focusable elements
 */
export function useSkipFocus(containerRef: RefObject<HTMLElement | null>, skip: boolean) {
  useEffect(() => {
    if (!containerRef.current) return;

    const focusableElements = getFocusableElements(containerRef.current);
    
    focusableElements.forEach((el) => {
      if (skip) {
        el.setAttribute('tabindex', '-1');
      } else {
        el.removeAttribute('tabindex');
      }
    });
  }, [containerRef, skip]);
}

