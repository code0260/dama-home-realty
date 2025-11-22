'use client';

import { useEffect } from 'react';
import { useLiveRegion } from '@/hooks/useScreenReader';
import { cn } from '@/lib/utils';

interface AnnounceProps {
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

/**
 * Screen reader announcement component
 */
export function Announce({ message, priority = 'polite', className }: AnnounceProps) {
  const { message: liveMessage } = useLiveRegion(priority);

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className={cn('sr-only', className)}
    >
      {liveMessage || message}
    </div>
  );
}

/**
 * Hook-based announcement component
 */
export function useAnnounce() {
  const { announce } = useLiveRegion();

  return {
    announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      announce(message);
    },
  };
}

