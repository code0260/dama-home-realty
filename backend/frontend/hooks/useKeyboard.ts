'use client';

import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: (event: KeyboardEvent) => void;
  description?: string;
}

/**
 * Hook for keyboard navigation and shortcuts
 */
export function useKeyboard(shortcuts: KeyboardShortcut[], deps: any[] = []) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if event.key exists to prevent errors
      if (!event.key) {
        return;
      }

      shortcuts.forEach((shortcut) => {
        const matchesKey = event.key && shortcut.key && event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
        const matchesShift = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;
        const matchesAlt = shortcut.altKey === undefined || event.altKey === shortcut.altKey;
        const matchesMeta = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey;

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt && matchesMeta) {
          event.preventDefault();
          shortcut.handler(event);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shortcuts, ...deps]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * Hook for Escape key handler
 */
export function useEscape(handler: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handler();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [handler, enabled]);
}

/**
 * Hook for Enter key handler
 */
export function useEnter(handler: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleEnter = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', handleEnter);
    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  }, [handler, enabled]);
}

/**
 * Hook for arrow keys navigation
 */
export function useArrowKeys(
  handlers: {
    up?: () => void;
    down?: () => void;
    left?: () => void;
    right?: () => void;
  },
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleArrow = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (handlers.up) {
            event.preventDefault();
            handlers.up();
          }
          break;
        case 'ArrowDown':
          if (handlers.down) {
            event.preventDefault();
            handlers.down();
          }
          break;
        case 'ArrowLeft':
          if (handlers.left) {
            event.preventDefault();
            handlers.left();
          }
          break;
        case 'ArrowRight':
          if (handlers.right) {
            event.preventDefault();
            handlers.right();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleArrow);
    return () => {
      window.removeEventListener('keydown', handleArrow);
    };
  }, [handlers, enabled]);
}

