'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { getOptimizedImageUrl, getImageQuality, getBlurDataURL } from '@/lib/image-optimization';
import { LoadingSkeleton } from './loading-states';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: 'thumbnail' | 'card' | 'gallery' | 'hero' | number;
  sizes?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  quality = 'card',
  sizes,
  aspectRatio,
  objectFit = 'cover',
  onLoad,
  onError,
  placeholder = 'blur',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const imageUrl = getOptimizedImageUrl(src);
  const imageQuality = typeof quality === 'number' ? quality : getImageQuality(quality);
  const placeholderData = blurDataURL || (placeholder === 'blur' ? getBlurDataURL() : undefined);

  if (!imageUrl || hasError) {
    return (
      <div
        className={cn(
          'bg-gray-200 dark:bg-primary-800 flex items-center justify-center',
          fill ? 'absolute inset-0' : '',
          className
        )}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <span className="text-gray-400 dark:text-gray-600 text-sm">Image not available</span>
      </div>
    );
  }

  const imageProps = fill
    ? {
        fill: true,
        sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
      }
    : {
        width: width || 800,
        height: height || 600,
      };

  return (
    <div className={cn('relative overflow-hidden', fill ? 'absolute inset-0' : '', className)}>
      {isLoading && !fill && (
        <div className="absolute inset-0">
          <LoadingSkeleton
            width={width || '100%'}
            height={height || '100%'}
            variant="rectangular"
          />
        </div>
      )}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full h-full"
      >
        <Image
          src={imageUrl}
          alt={alt}
          {...imageProps}
          className={cn(
            `object-${objectFit}`,
            'transition-opacity duration-300',
            isLoading && 'opacity-0'
          )}
          priority={priority}
          quality={imageQuality}
          placeholder={placeholder}
          blurDataURL={placeholderData}
          onLoad={() => {
            setIsLoading(false);
            if (onLoad) onLoad();
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
            if (onError) onError();
          }}
        />
      </motion.div>
    </div>
  );
}

