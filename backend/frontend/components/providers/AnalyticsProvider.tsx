'use client';

import { useEffect } from 'react';
import { initPerformanceMonitoring } from '@/lib/performance-monitor';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
  }, []);

  return <>{children}</>;
}

