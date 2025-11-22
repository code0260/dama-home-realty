'use client';

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/performance-monitor';

export function WebVitals() {
  useEffect(() => {
    // Only track in production or when explicitly enabled
    if (
      process.env.NODE_ENV !== 'production' &&
      !process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS
    ) {
      return;
    }

    // Use Next.js web-vitals if available
    // Load dynamically at runtime to avoid build-time resolution
    if (typeof window !== 'undefined') {
      // Use setTimeout to ensure this runs after initial render
      setTimeout(() => {
        // Dynamic import wrapped in try-catch for runtime safety
        const loadWebVitals = () => {
          // @ts-expect-error - web-vitals is optional, handled by webpack.IgnorePlugin
          return import('web-vitals').catch(() => null);
        };

        loadWebVitals().then((webVitals: any) => {
          if (webVitals) {
            try {
              const { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } = webVitals;
              if (onCLS) onCLS(reportWebVitals);
              if (onFID) onFID(reportWebVitals);
              if (onFCP) onFCP(reportWebVitals);
              if (onLCP) onLCP(reportWebVitals);
              if (onTTFB) onTTFB(reportWebVitals);
              if (onINP) onINP(reportWebVitals);
            } catch (err) {
              // Ignore errors
            }
          }
        });
      }, 100);
    }
  }, []);

  return null;
}
