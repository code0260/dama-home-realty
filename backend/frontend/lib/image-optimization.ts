/**
 * Image optimization utilities for Next.js Image component
 * Provides helper functions for optimized image handling
 */

/**
 * Get optimized image URL with proper formatting
 */
export function getOptimizedImageUrl(
  image: string | null | undefined,
  baseUrl?: string
): string | null {
  if (!image) return null;

  // If already a full URL, return as is
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  // Construct full URL from base URL
  const apiUrl =
    baseUrl || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || process.env.NEXT_PUBLIC_SITE_URL || 'https://damahomerealty.com';

  // Remove leading slash if present
  const cleanPath = image.startsWith('/') ? image.slice(1) : image;

  return `${apiUrl}/storage/${cleanPath}`;
}

/**
 * Get image dimensions for Next.js Image component
 */
export function getImageDimensions(
  width?: number,
  height?: number,
  aspectRatio?: string
): { width: number; height: number } {
  // Default dimensions
  const defaultWidth = 800;
  const defaultHeight = 600;

  if (width && height) {
    return { width, height };
  }

  if (aspectRatio && width) {
    const [w, h] = aspectRatio.split(':').map(Number);
    return { width, height: Math.round((width * h) / w) };
  }

  if (aspectRatio && height) {
    const [w, h] = aspectRatio.split(':').map(Number);
    return { width: Math.round((height * w) / h), height };
  }

  // Common aspect ratios
  const commonAspectRatios: Record<string, { width: number; height: number }> = {
    '16:9': { width: 1920, height: 1080 },
    '4:3': { width: 1600, height: 1200 },
    '3:4': { width: 1200, height: 1600 },
    '1:1': { width: 800, height: 800 },
  };

  if (aspectRatio && commonAspectRatios[aspectRatio]) {
    return commonAspectRatios[aspectRatio];
  }

  return { width: defaultWidth, height: defaultHeight };
}

/**
 * Generate responsive image sizes for Next.js Image component
 */
export function getResponsiveSizes(breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'lg'): string {
  const sizeMap = {
    sm: '(max-width: 640px) 100vw, 640px',
    md: '(max-width: 768px) 100vw, 768px',
    lg: '(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 1024px',
    xl: '(max-width: 1280px) 100vw, (max-width: 1536px) 75vw, 1280px',
  };

  return sizeMap[breakpoint];
}

/**
 * Get image quality based on context
 */
export function getImageQuality(context: 'thumbnail' | 'card' | 'gallery' | 'hero' = 'card'): number {
  const qualityMap = {
    thumbnail: 75,
    card: 85,
    gallery: 90,
    hero: 95,
  };

  return qualityMap[context];
}

/**
 * Generate placeholder for images
 */
export function generateImagePlaceholder(width: number, height: number): string {
  // Generate a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#F3F4F6"/>
      <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9CA3AF" text-anchor="middle" dy=".3em">
        Loading...
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Check if image URL is valid
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  // Check if it's a valid URL
  try {
    new URL(url);
    return true;
  } catch {
    // If not a full URL, check if it's a valid path
    return /^[\w\-\/\.]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  }
}

/**
 * Convert image to WebP format URL (if supported)
 */
export function getWebPUrl(imageUrl: string): string {
  // If the URL already has a format, return as is
  if (imageUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    return imageUrl;
  }

  // Add .webp extension if supported
  // Note: This is a placeholder - actual WebP conversion should happen on the server
  return imageUrl.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
}

/**
 * Get image blur data URL for lazy loading
 */
export function getBlurDataURL(width: number = 20, height: number = 20): string {
  // Generate a tiny blurred image data URL
  const canvas = typeof window !== 'undefined' ? document.createElement('canvas') : null;
  if (!canvas) {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI0YzRjRGNiIvPjwvc3ZnPg==';
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#F3F4F6';
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL();
}

