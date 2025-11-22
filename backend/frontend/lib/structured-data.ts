/**
 * Structured Data (JSON-LD) utilities for SEO
 * Provides schema.org markup generation
 */

export interface PropertySchema {
  id: number;
  title: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  floorArea?: number;
  yearBuilt?: number;
  availability?: string;
  url: string;
}

export interface ArticleSchema {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
  url: string;
}

/**
 * Generate Property schema (RealEstateAgent)
 */
export function generatePropertySchema(property: PropertySchema) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = property.url.startsWith('http') ? property.url : `${siteUrl}${property.url}`;
  const images = property.images.map((img) =>
    img.startsWith('http') ? img : `${siteUrl}${img}`
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: property.title,
    description: property.description,
    image: images,
    url: fullUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address.streetAddress || '',
      addressLocality: property.address.addressLocality,
      addressRegion: property.address.addressRegion || 'Damascus',
      postalCode: property.address.postalCode || '',
      addressCountry: property.address.addressCountry || 'SY',
    },
    price: {
      '@type': 'PriceSpecification',
      price: property.price,
      priceCurrency: property.currency || 'USD',
    },
    numberOfRooms: property.bedrooms || 0,
    numberOfBathroomsTotal: property.bathrooms || 0,
    floorSize: property.floorArea
      ? {
          '@type': 'QuantitativeValue',
          value: property.floorArea,
          unitCode: 'MTK', // Square meters
        }
      : undefined,
    yearBuilt: property.yearBuilt || undefined,
    ...(property.availability && {
      availability: property.availability,
    }),
  };
}

/**
 * Generate Article schema
 */
export function generateArticleSchema(article: ArticleSchema) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = article.url.startsWith('http') ? article.url : `${siteUrl}${article.url}`;
  const imageUrl = article.image
    ? article.image.startsWith('http')
      ? article.image
      : `${siteUrl}${article.image}`
    : `${siteUrl}/icon-192x192.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: imageUrl,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author.name,
      ...(article.author.url && { url: article.author.url }),
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisher.name || 'Dama Home Realty',
      logo: {
        '@type': 'ImageObject',
        url: article.publisher.logo || `${siteUrl}/icon-192x192.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    url: fullUrl,
  };
}

/**
 * Generate LocalBusiness schema
 */
export function generateLocalBusinessSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Dama Home Realty',
    image: `${siteUrl}/icon-192x192.png`,
    '@id': siteUrl,
    url: siteUrl,
    telephone: '+963-XXX-XXX-XXX',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Damascus',
      addressRegion: 'Damascus',
      addressCountry: 'SY',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.5138',
      longitude: '36.2765',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    priceRange: '$$',
    servesCuisine: 'Real Estate Services',
  };
}

/**
 * Generate Service schema
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  image?: string;
  url: string;
  price?: number;
  currency?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = service.url.startsWith('http') ? service.url : `${siteUrl}${service.url}`;
  const imageUrl = service.image
    ? service.image.startsWith('http')
      ? service.image
      : `${siteUrl}${service.image}`
    : `${siteUrl}/icon-192x192.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    image: imageUrl,
    url: fullUrl,
    provider: {
      '@type': 'Organization',
      name: 'Dama Home Realty',
      url: siteUrl,
    },
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: service.currency || 'USD',
      },
    }),
    areaServed: {
      '@type': 'Country',
      name: 'Syria',
    },
  };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Review schema
 */
export function generateReviewSchema(review: {
  rating: number;
  reviewBody: string;
  author: string;
  datePublished: string;
  itemReviewed?: {
    name: string;
    type: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: review.reviewBody,
    author: {
      '@type': 'Person',
      name: review.author,
    },
    datePublished: review.datePublished,
    ...(review.itemReviewed && {
      itemReviewed: {
        '@type': review.itemReviewed.type,
        name: review.itemReviewed.name,
      },
    }),
  };
}

/**
 * Generate ItemList schema for property listings
 */
export function generateItemListSchema(items: Array<{
  name: string;
  url: string;
  image?: string;
  description?: string;
}>) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: item.name,
        url: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
        ...(item.image && {
          image: item.image.startsWith('http') ? item.image : `${siteUrl}${item.image}`,
        }),
        ...(item.description && { description: item.description }),
      },
    })),
  };
}

