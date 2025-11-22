/**
 * SEO utilities for Dama Home Realty
 * Provides helper functions for meta tags, Open Graph, Twitter Cards, and structured data
 */

import { Metadata } from 'next';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * Generate metadata for Next.js pages
 */
export function generateMetadata(seoData: SEOData): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    noindex = false,
    nofollow = false,
  } = seoData;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/icon-192x192.png`;

  return {
    title: {
      default: title,
      template: '%s | Dama Home Realty',
    },
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : undefined,
    creator: 'Dama Home Realty',
    publisher: 'Dama Home Realty',
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: type === 'article' ? 'article' : 'website',
      locale: 'en_US',
      url: fullUrl,
      siteName: 'Dama Home Realty',
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@damahomerealty',
      site: '@damahomerealty',
    },
    alternates: {
      canonical: fullUrl,
    },
    ...(publishedTime && {
      other: {
        'article:published_time': publishedTime,
        ...(modifiedTime && { 'article:modified_time': modifiedTime }),
      },
    }),
  };
}

/**
 * Generate Open Graph tags
 */
export function generateOpenGraphTags(seoData: SEOData): Record<string, string> {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags: articleTags = [],
  } = seoData;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = url ? (url.startsWith('http') ? url : `${siteUrl}${url}`) : siteUrl;
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/icon-192x192.png`;

  const ogTags: Record<string, string> = {
    'og:title': title,
    'og:description': description,
    'og:type': type,
    'og:url': fullUrl,
    'og:image': imageUrl,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:site_name': 'Dama Home Realty',
    'og:locale': 'en_US',
  };

  if (type === 'article') {
    if (publishedTime) ogTags['og:published_time'] = publishedTime;
    if (modifiedTime) ogTags['og:modified_time'] = modifiedTime;
    if (author) ogTags['og:author'] = author;
    if (section) ogTags['article:section'] = section;
    if (articleTags.length > 0) {
      articleTags.forEach((tag, index) => {
        ogTags[`article:tag:${index + 1}`] = tag;
      });
    }
  }

  return ogTags;
}

/**
 * Generate Twitter Card tags
 */
export function generateTwitterCardTags(seoData: SEOData): Record<string, string> {
  const { title, description, image } = seoData;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${siteUrl}${image}`
    : `${siteUrl}/icon-192x192.png`;

  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': imageUrl,
    'twitter:site': '@damahomerealty',
    'twitter:creator': '@damahomerealty',
  };
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path?: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  if (!path) return siteUrl;
  return path.startsWith('http') ? path : `${siteUrl}${path}`;
}

/**
 * Generate meta robots tag
 */
export function generateRobotsTag(
  noindex: boolean = false,
  nofollow: boolean = false
): string {
  const directives: string[] = [];

  if (noindex) {
    directives.push('noindex');
  } else {
    directives.push('index');
  }

  if (nofollow) {
    directives.push('nofollow');
  } else {
    directives.push('follow');
  }

  return directives.join(', ');
}

/**
 * Generate keywords string from array
 */
export function generateKeywordsString(keywords: string[]): string {
  return keywords.join(', ');
}

/**
 * Truncate description for SEO (max 160 characters)
 */
export function truncateDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3) + '...';
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generate organization schema
 */
export function generateOrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dama Home Realty',
    url: siteUrl,
    logo: `${siteUrl}/icon-192x192.png`,
    description: 'Find your perfect home in Damascus. Rent, buy, or book properties in Syria\'s capital.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SY',
      addressLocality: 'Damascus',
    },
    sameAs: [
      // Add social media links here
      'https://www.facebook.com/damahomerealty',
      'https://www.twitter.com/damahomerealty',
      'https://www.instagram.com/damahomerealty',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+963-XXX-XXX-XXX',
      contactType: 'Customer Service',
      areaServed: 'SY',
      availableLanguage: ['en', 'ar'],
    },
  };
}

/**
 * Generate website schema
 */
export function generateWebsiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Dama Home Realty',
    url: siteUrl,
    description: 'Find your perfect home in Damascus. Rent, buy, or book properties in Syria\'s capital.',
    publisher: {
      '@type': 'Organization',
      name: 'Dama Home Realty',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon-192x192.png`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/properties?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

