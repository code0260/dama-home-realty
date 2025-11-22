'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, trackPageView } from '@/lib/analytics';

interface AnalyticsProps {
  googleAnalyticsId?: string;
}

export function Analytics({ googleAnalyticsId }: AnalyticsProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Google Analytics if ID is provided
    if (googleAnalyticsId && typeof window !== 'undefined') {
      initGA(googleAnalyticsId);
    }
  }, [googleAnalyticsId]);

  useEffect(() => {
    // Track page view on route change
    if (pathname && googleAnalyticsId) {
      trackPageView(pathname);
    }
  }, [pathname, googleAnalyticsId]);

  return null;
}
