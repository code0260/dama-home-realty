/**
 * Performance Monitoring
 * Tracks Core Web Vitals and custom performance metrics
 */

/**
 * Core Web Vitals metrics
 */
export interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  navigationType?: string;
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  // Report to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
      metric_rating: metric.rating,
      ...(metric.delta !== undefined && { metric_delta: metric.delta }),
    });
  }

  // Report to Sentry (dynamically loaded)
  if (process.env.NODE_ENV === 'production') {
    // Load error-tracking dynamically to avoid build-time resolution
    if (typeof window !== 'undefined') {
      import('./error-tracking')
        .then(({ captureMessage }) => {
          if (metric.rating === 'poor') {
            captureMessage(`Poor ${metric.name}: ${metric.value}ms`, 'warning');
          }
        })
        .catch(() => {
          // Ignore errors
        });
    }
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }
}

/**
 * Measure custom performance metric
 */
export function measurePerformance(
  name: string,
  fn: () => void | Promise<void>
): Promise<number> {
  return new Promise(async (resolve) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    const duration = end - start;

    // Report to analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(duration),
        event_category: 'Performance',
      });
    }

    resolve(duration);
  });
}

/**
 * Track page load performance
 */
export function trackPageLoad() {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('load', () => {
    // Navigation Timing
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
    const domInteractive = perfData.domInteractive - perfData.navigationStart;

    // Resource Timing
    const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const totalTransferSize = resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);

    // Report metrics
    if ((window as any).gtag) {
      (window as any).gtag('event', 'page_load', {
        page_load_time: pageLoadTime,
        dom_content_loaded: domContentLoaded,
        dom_interactive: domInteractive,
        total_transfer_size: totalTransferSize,
        resource_count: resources.length,
      });
    }
  });
}

/**
 * Monitor long tasks
 */
export function monitorLongTasks() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const duration = entry.duration;
        if (duration > 50) {
          // Long task detected (> 50ms)
          if ((window as any).gtag) {
            (window as any).gtag('event', 'long_task', {
              duration: Math.round(duration),
              start_time: entry.startTime,
            });
          }

          // Report to Sentry if significant (dynamically loaded)
          if (duration > 100 && process.env.NODE_ENV === 'production') {
            import('./error-tracking')
              .then(({ captureMessage }) => {
                captureMessage(`Long task detected: ${duration}ms`, 'warning');
              })
              .catch(() => {
                // Ignore errors
              });
          }
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Long task API not supported
    console.warn('Long task monitoring not supported');
  }
}

/**
 * Track memory usage
 */
export function trackMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in (performance as any))) {
    return;
  }

  const memory = (performance as any).memory;
  if (memory) {
    const usedMB = memory.usedJSHeapSize / 1048576;
    const totalMB = memory.totalJSHeapSize / 1048576;
    const limitMB = memory.jsHeapSizeLimit / 1048576;

    if ((window as any).gtag) {
      (window as any).gtag('event', 'memory_usage', {
        used_mb: Math.round(usedMB),
        total_mb: Math.round(totalMB),
        limit_mb: Math.round(limitMB),
        usage_percentage: Math.round((usedMB / limitMB) * 100),
      });
    }
  }
}

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') {
    return;
  }

  // Track page load
  trackPageLoad();

  // Monitor long tasks
  monitorLongTasks();

  // Track memory usage periodically
  if ('memory' in (performance as any)) {
    setInterval(trackMemoryUsage, 60000); // Every minute
  }
}
