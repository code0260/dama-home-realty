/**
 * Internal linking utilities for SEO
 * Provides helper functions for generating internal links and related content
 */

export interface InternalLink {
  text: string;
  href: string;
  title?: string;
  description?: string;
  priority?: number;
}

/**
 * Generate internal links for properties
 */
export function generatePropertyLinks(properties: Array<{
  title: string;
  slug: string;
  neighborhood?: { name: string };
}>, currentSlug?: string, limit: number = 5): InternalLink[] {
  return properties
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit)
    .map((property) => ({
      text: property.title,
      href: `/properties/${property.slug}`,
      title: `${property.title}${property.neighborhood ? ` in ${property.neighborhood.name}` : ''}`,
      priority: 0.8,
    }));
}

/**
 * Generate internal links for articles
 */
export function generateArticleLinks(articles: Array<{
  title: string;
  slug: string;
  excerpt?: string;
}>, currentSlug?: string, limit: number = 5): InternalLink[] {
  return articles
    .filter((a) => a.slug !== currentSlug)
    .slice(0, limit)
    .map((article) => ({
      text: article.title,
      href: `/blog/${article.slug}`,
      title: article.title,
      description: article.excerpt,
      priority: 0.7,
    }));
}

/**
 * Generate internal links for services
 */
export function generateServiceLinks(services: Array<{
  name: string;
  slug: string;
  description?: string;
}>, currentSlug?: string, limit: number = 5): InternalLink[] {
  return services
    .filter((s) => s.slug !== currentSlug)
    .slice(0, limit)
    .map((service) => ({
      text: service.name,
      href: `/services/${service.slug}`,
      title: service.name,
      description: service.description,
      priority: 0.7,
    }));
}

/**
 * Generate contextual internal links based on keywords
 */
export function generateContextualLinks(
  text: string,
  allLinks: InternalLink[],
  maxLinks: number = 3
): InternalLink[] {
  // Simple keyword matching (can be enhanced with NLP)
  const words = text.toLowerCase().split(/\s+/);
  
  const matchedLinks = allLinks
    .map((link) => {
      const linkWords = `${link.text} ${link.title || ''} ${link.description || ''}`
        .toLowerCase()
        .split(/\s+/);
      
      const matches = words.filter((word) => 
        linkWords.some((lw) => lw.includes(word) || word.includes(lw))
      );
      
      return {
        link,
        score: matches.length,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxLinks)
    .map((item) => item.link);
  
  return matchedLinks;
}

/**
 * Generate breadcrumb links
 */
export function generateBreadcrumbs(path: string): InternalLink[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: InternalLink[] = [
    {
      text: 'Home',
      href: '/',
      priority: 1.0,
    },
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Format segment name
    let text = segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    
    // Special cases
    if (segment === 'properties') text = 'Properties';
    else if (segment === 'services') text = 'Services';
    else if (segment === 'blog') text = 'Blog';
    else if (segment === 'about') text = 'About Us';
    else if (segment === 'contact') text = 'Contact';
    
    breadcrumbs.push({
      text,
      href: currentPath,
      priority: index === segments.length - 1 ? 0.5 : 0.7,
    });
  });

  return breadcrumbs;
}

/**
 * Generate related content links
 */
export function generateRelatedLinks(
  type: 'property' | 'article' | 'service',
  items: Array<{
    title?: string;
    name?: string;
    slug: string;
    category?: string;
    tags?: string[];
  }>,
  currentSlug: string,
  criteria?: {
    category?: string;
    tags?: string[];
    limit?: number;
  }
): InternalLink[] {
  const limit = criteria?.limit || 5;
  const currentItem = items.find((item) => item.slug === currentSlug);
  
  if (!currentItem) return [];

  // Filter by category or tags
  let related = items.filter((item) => {
    if (item.slug === currentSlug) return false;
    
    if (criteria?.category && item.category === criteria.category) return true;
    
    if (criteria?.tags && item.tags) {
      return criteria.tags.some((tag) => item.tags?.includes(tag));
    }
    
    // If no criteria, use category/tags from current item
    if (currentItem.category && item.category === currentItem.category) return true;
    if (currentItem.tags && item.tags) {
      return currentItem.tags.some((tag) => item.tags?.includes(tag));
    }
    
    return true;
  });

  // Determine URL prefix based on type
  const urlPrefix = type === 'property' ? '/properties' : type === 'article' ? '/blog' : '/services';

  return related
    .slice(0, limit)
    .map((item) => ({
      text: item.title || item.name || '',
      href: `${urlPrefix}/${item.slug}`,
      priority: 0.8,
    }));
}

/**
 * Extract keywords from text for internal linking
 */
export function extractKeywords(text: string, minLength: number = 4): string[] {
  // Remove common stop words and punctuation
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= minLength && !stopWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
}

/**
 * Generate anchor text variations for internal links
 */
export function generateAnchorTexts(baseText: string): string[] {
  const variations: string[] = [baseText];
  
  // Add variations
  variations.push(`Learn more about ${baseText}`);
  variations.push(`Read about ${baseText}`);
  variations.push(`Check out ${baseText}`);
  variations.push(baseText.toLowerCase());
  
  return variations.filter((v, i, arr) => arr.indexOf(v) === i); // Remove duplicates
}

