import { MetadataRoute } from 'next';

/**
 * Robots.txt generator
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/portal/',
          '/admin/',
          '/_next/',
          '/private/',
          '/dashboard/',
          '/*.json$',
          '/*?*', // Disallow URLs with query parameters (optional)
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/portal/',
          '/admin/',
          '/_next/',
          '/private/',
          '/dashboard/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/portal/',
          '/admin/',
          '/_next/',
          '/private/',
          '/dashboard/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl.replace(/^https?:\/\//, ''), // Remove protocol
  };
}

