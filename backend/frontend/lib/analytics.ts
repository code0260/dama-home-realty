/**
 * Google Analytics Integration
 * Provides comprehensive analytics tracking for user behavior, events, and conversions
 */

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Initialize Google Analytics
 * @param measurementId Optional GA Measurement ID (overrides env var)
 */
export function initGA(measurementId?: string) {
  const gaId = measurementId || GA_MEASUREMENT_ID;
  
  if (typeof window === 'undefined' || !gaId) {
    return;
  }

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script1);

  // Initialize gtag
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  function gtag(...args: any[]) {
    if (window.dataLayer) {
      window.dataLayer.push(args);
    }
  }
  gtag('js', new Date());
  gtag('config', gaId, {
    page_path: window.location.pathname,
  });

  // Make gtag available globally
  window.gtag = gtag;
}

/**
 * Track page view
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined' || !window.gtag || !GA_MEASUREMENT_ID) {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

/**
 * Track custom event
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

/**
 * Track property search
 */
export function trackPropertySearch(
  query: string,
  filters?: Record<string, any>,
  resultsCount?: number
) {
  trackEvent('search', 'property', query, resultsCount);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'property_search', {
      search_term: query,
      filters: JSON.stringify(filters || {}),
      results_count: resultsCount,
    });
  }
}

/**
 * Track property view
 */
export function trackPropertyView(propertyId: string, propertyTitle: string) {
  trackEvent('view_property', 'property', propertyTitle);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'property_view', {
      property_id: propertyId,
      property_title: propertyTitle,
    });
  }
}

/**
 * Track property save/favorite
 */
export function trackPropertySave(propertyId: string, action: 'save' | 'unsave') {
  trackEvent(action === 'save' ? 'save_property' : 'unsave_property', 'property', propertyId);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action === 'save' ? 'save_property' : 'unsave_property', {
      property_id: propertyId,
    });
  }
}

/**
 * Track conversion (booking, contact, etc.)
 */
export function trackConversion(
  type: 'booking' | 'contact' | 'inquiry',
  value?: number,
  currency?: string
) {
  trackEvent('conversion', type, type, value);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      conversion_type: type,
      value: value,
      currency: currency || 'USD',
    });
  }
}

/**
 * Track user engagement
 */
export function trackEngagement(action: string, element?: string) {
  trackEvent('engagement', 'user', element || action);

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_engagement', {
      engagement_type: action,
      element: element,
    });
  }
}

/**
 * Track error
 */
export function trackError(error: Error, context?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      ...context,
    });
  }
}

/**
 * Track performance metrics
 */
export function trackPerformance(metricName: string, value: number, unit: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: metricName,
      value: value,
      event_category: 'Performance',
      event_label: unit,
    });
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}
