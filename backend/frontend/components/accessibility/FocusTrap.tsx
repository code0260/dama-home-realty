'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { useFocusTrap } from '@/hooks/useFocus';
import { useAutoFocus } from '@/hooks/useFocus';
import { cn } from '@/lib/utils';

interface FocusTrapProps {
  children: ReactNode;
  enabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  onEscape?: () => void;
}

/**
 * Focus trap component for modals and dialogs
 */
export function FocusTrap({
  children,
  enabled = true,
  autoFocus = true,
  className,
  onEscape,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);

  useFocusTrap(containerRef, enabled);
  useAutoFocus(firstFocusableRef, autoFocus);

  // Handle Escape key
  useEffect(() => {
    if (!enabled || !onEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [enabled, onEscape]);

  return (
    <div ref={containerRef} className={cn('outline-none', className)} tabIndex={-1}>
      <div ref={firstFocusableRef as any} tabIndex={-1} className="sr-only" aria-hidden="true" />
      {children}
    </div>
  );
}

