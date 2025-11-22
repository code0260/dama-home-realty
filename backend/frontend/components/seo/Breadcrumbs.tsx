'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbs, InternalLink } from '@/lib/internal-linking';
import { usePathname } from 'next/navigation';
import { StructuredData } from './StructuredData';
import { generateBreadcrumbSchema } from '@/lib/seo';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  customPath?: string;
  customItems?: BreadcrumbItem[];
  showSchema?: boolean;
  className?: string;
}

/**
 * Breadcrumbs component with schema markup
 */
export function Breadcrumbs({
  customPath,
  customItems,
  showSchema = true,
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const path = customPath || pathname;
  
  // Convert InternalLink[] to BreadcrumbItem[] if needed
  const internalBreadcrumbs = generateBreadcrumbs(path);
  const breadcrumbItems: BreadcrumbItem[] = customItems || internalBreadcrumbs.map(item => ({
    name: item.text,
    url: item.href,
  }));

  const schema = showSchema ? generateBreadcrumbSchema(breadcrumbItems) : null;

  return (
    <>
      {schema && <StructuredData data={schema} id="breadcrumb-schema" />}
      <nav
        aria-label="Breadcrumb"
        className={className}
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          {breadcrumbItems.map((crumb, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <li
                key={crumb.url}
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {index === 0 ? (
                  <Home className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                )}
                {isLast ? (
                  <span
                    className="font-medium text-primary dark:text-white"
                    itemProp="name"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.url}
                    className="hover:text-primary dark:hover:text-white transition-colors"
                    itemProp="item"
                  >
                    <span itemProp="name">{crumb.name}</span>
                  </Link>
                )}
                <meta itemProp="position" content={(index + 1).toString()} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

