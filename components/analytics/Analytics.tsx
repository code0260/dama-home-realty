'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { GoogleAnalytics } from './GoogleAnalytics';

interface AnalyticsProps {
  googleAnalyticsId?: string;
}

export function Analytics({ googleAnalyticsId }: AnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && window.gtag && googleAnalyticsId) {
      window.gtag('config', googleAnalyticsId, {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      });
    }
  }, [pathname, searchParams, googleAnalyticsId]);

  // Track custom events
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // Expose trackEvent globally for use in other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).trackEvent = trackEvent;
    }
  }, []);

  return <GoogleAnalytics measurementId={googleAnalyticsId} />;
}

// TypeScript declaration for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
    trackEvent?: (
      action: string,
      category: string,
      label?: string,
      value?: number
    ) => void;
  }
}

