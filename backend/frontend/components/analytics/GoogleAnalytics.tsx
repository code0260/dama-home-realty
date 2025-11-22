'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, trackPageView } from '@/lib/analytics';

export function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Google Analytics
    initGA();
  }, []);

  useEffect(() => {
    // Track page view on route change
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return null;
}
