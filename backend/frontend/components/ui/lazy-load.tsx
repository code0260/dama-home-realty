'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { fadeInAnimations } from '@/lib/micro-interactions';

interface LazyLoadProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
  fallback?: ReactNode;
}

/**
 * Lazy load component that only renders when in viewport
 */
export function LazyLoad({
  children,
  className,
  threshold = 0.1,
  triggerOnce = true,
  fallback,
}: LazyLoadProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: triggerOnce, amount: threshold });
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isInView && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isInView, hasLoaded]);

  return (
    <div ref={ref} className={className}>
      {hasLoaded ? (
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInAnimations}
        >
          {children}
        </motion.div>
      ) : (
        fallback || <div className="min-h-[200px]" />
      )}
    </div>
  );
}

/**
 * Lazy load images with intersection observer
 */
export function LazyImage({
  src,
  alt,
  className,
  width,
  height,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  [key: string]: any;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
}

