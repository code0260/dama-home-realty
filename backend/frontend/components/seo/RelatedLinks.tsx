'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { InternalLink } from '@/lib/internal-linking';
import { cn } from '@/lib/utils';

interface RelatedLinksProps {
  links: InternalLink[];
  title?: string;
  className?: string;
  maxLinks?: number;
}

/**
 * Related links component for internal linking
 */
export function RelatedLinks({
  links,
  title = 'Related Content',
  className,
  maxLinks = 5,
}: RelatedLinksProps) {
  const displayLinks = links.slice(0, maxLinks);

  if (displayLinks.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-primary dark:text-white">{title}</h3>
      <ul className="space-y-2">
        {displayLinks.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors group"
              title={link.title}
            >
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              <span>{link.text}</span>
              {link.description && (
                <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline">
                  - {link.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

