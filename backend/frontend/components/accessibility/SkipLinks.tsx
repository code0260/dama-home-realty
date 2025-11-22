'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useKeyboard } from '@/hooks/useKeyboard';
import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  label: string;
  id?: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#search', label: 'Skip to search' },
  { href: '#footer', label: 'Skip to footer' },
];

/**
 * Skip links component for keyboard navigation
 */
export function SkipLinks({ links = defaultLinks, className }: SkipLinksProps) {
  const router = useRouter();
  const skipLinksRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut: Alt + S to focus skip links
  useKeyboard(
    [
      {
        key: 's',
        altKey: true,
        handler: () => {
          const firstLink = skipLinksRef.current?.querySelector('a');
          firstLink?.focus();
        },
        description: 'Focus skip links',
      },
    ],
    []
  );

  const handleSkip = (href: string) => {
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      router.push(href);
    }
  };

  return (
    <div
      ref={skipLinksRef}
      className={cn(
        'sr-only focus-within:not-sr-only focus-within:absolute focus-within:z-50 focus-within:top-0 focus-within:left-0 focus-within:right-0',
        className
      )}
    >
      <nav
        aria-label="Skip navigation links"
        className="bg-primary text-white p-2 flex flex-wrap gap-2"
      >
        {links.map((link, index) => (
          <Link
            key={link.id || `skip-link-${index}`}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              handleSkip(link.href);
            }}
            className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary transition-colors"
            aria-label={link.label}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

