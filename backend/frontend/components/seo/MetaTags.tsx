'use client';

import { useEffect } from 'react';
import Head from 'next/head';
import { SEOData, generateOpenGraphTags, generateTwitterCardTags, generateCanonicalUrl, generateRobotsTag } from '@/lib/seo';

interface MetaTagsProps {
  seoData: SEOData;
}

/**
 * MetaTags component for dynamic meta tags
 */
export function MetaTags({ seoData }: MetaTagsProps) {
  const { title, description, keywords = [], noindex = false, nofollow = false, url } = seoData;

  const canonicalUrl = generateCanonicalUrl(url);
  const robotsTag = generateRobotsTag(noindex, nofollow);
  const ogTags = generateOpenGraphTags(seoData);
  const twitterTags = generateTwitterCardTags(seoData);

  // Update document title
  useEffect(() => {
    document.title = `${title} | Dama Home Realty`;
  }, [title]);

  // Update meta tags
  useEffect(() => {
    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty: boolean = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);

      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }

      meta.setAttribute('content', content);
    };

    // Update description
    updateMetaTag('description', description);

    // Update keywords
    if (keywords.length > 0) {
      updateMetaTag('keywords', keywords.join(', '));
    }

    // Update robots
    updateMetaTag('robots', robotsTag);

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Update Open Graph tags
    Object.entries(ogTags).forEach(([key, value]) => {
      updateMetaTag(key, value, true);
    });

    // Update Twitter Card tags
    Object.entries(twitterTags).forEach(([key, value]) => {
      updateMetaTag(key, value);
    });
  }, [description, keywords, robotsTag, canonicalUrl, ogTags, twitterTags]);

  return null; // This component only updates meta tags, doesn't render anything
}

/**
 * Static MetaTags component for Next.js app directory
 */
export function StaticMetaTags({ seoData }: MetaTagsProps) {
  const canonicalUrl = generateCanonicalUrl(seoData.url);
  const robotsTag = generateRobotsTag(seoData.noindex, seoData.nofollow);
  const ogTags = generateOpenGraphTags(seoData);
  const twitterTags = generateTwitterCardTags(seoData);

  return (
    <>
      {/* Basic Meta Tags */}
      <meta name="description" content={seoData.description} />
      {seoData.keywords && seoData.keywords.length > 0 && (
        <meta name="keywords" content={seoData.keywords.join(', ')} />
      )}
      <meta name="robots" content={robotsTag} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      {Object.entries(ogTags).map(([key, value]) => (
        <meta key={key} property={key} content={value} />
      ))}

      {/* Twitter Card Tags */}
      {Object.entries(twitterTags).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}
    </>
  );
}

