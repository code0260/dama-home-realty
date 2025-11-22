'use client';

import { useEffect } from 'react';
import { monitorWebVitals, logPerformanceMetrics, sendPerformanceMetrics } from '@/lib/performance-monitor';

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Monitor Core Web Vitals
    const metrics = monitorWebVitals((metrics) => {
      // Log in development
      if (process.env.NODE_ENV === 'development') {
        logPerformanceMetrics(metrics);
      }

      // Send to analytics in production
      if (process.env.NODE_ENV === 'production') {
        sendPerformanceMetrics(metrics);
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return <>{children}</>;
}

