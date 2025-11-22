/**
 * Performance monitoring utilities
 * Tracks Core Web Vitals and performance metrics
 */

export interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  fcp?: number; // First Contentful Paint
}

/**
 * Monitor Core Web Vitals
 */
export function monitorWebVitals(onPerfEntry?: (metrics: PerformanceMetrics) => void) {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }

  const metrics: PerformanceMetrics = {};

  // Monitor LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        if (onPerfEntry) onPerfEntry(metrics);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP monitoring not supported', e);
    }

    // Monitor FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          metrics.fid = entry.processingStart - entry.startTime;
          if (onPerfEntry) onPerfEntry(metrics);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID monitoring not supported', e);
    }

    // Monitor CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            metrics.cls = clsValue;
            if (onPerfEntry) onPerfEntry(metrics);
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS monitoring not supported', e);
    }
  }

  // Monitor TTFB (Time to First Byte)
  if (window.performance.timing) {
    const timing = window.performance.timing;
    metrics.ttfb = timing.responseStart - timing.requestStart;
    if (onPerfEntry) onPerfEntry(metrics);
  }

  // Monitor FCP (First Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime;
            if (onPerfEntry) onPerfEntry(metrics);
          }
        });
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP monitoring not supported', e);
    }
  }

  return metrics;
}

/**
 * Get performance score based on Core Web Vitals
 */
export function getPerformanceScore(metrics: PerformanceMetrics): {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  details: Record<string, { value: number; score: number; grade: string }>;
} {
  const details: Record<string, { value: number; score: number; grade: string }> = {};
  let totalScore = 0;
  let count = 0;

  // LCP scoring (0-100)
  if (metrics.lcp !== undefined) {
    let lcpScore = 100;
    let lcpGrade = 'A';
    if (metrics.lcp > 4000) {
      lcpScore = 0;
      lcpGrade = 'F';
    } else if (metrics.lcp > 2500) {
      lcpScore = 50;
      lcpGrade = 'C';
    } else if (metrics.lcp > 2000) {
      lcpScore = 75;
      lcpGrade = 'B';
    }
    details.lcp = { value: metrics.lcp, score: lcpScore, grade: lcpGrade };
    totalScore += lcpScore;
    count++;
  }

  // FID scoring (0-100)
  if (metrics.fid !== undefined) {
    let fidScore = 100;
    let fidGrade = 'A';
    if (metrics.fid > 300) {
      fidScore = 0;
      fidGrade = 'F';
    } else if (metrics.fid > 100) {
      fidScore = 50;
      fidGrade = 'C';
    } else if (metrics.fid > 50) {
      fidScore = 75;
      fidGrade = 'B';
    }
    details.fid = { value: metrics.fid, score: fidScore, grade: fidGrade };
    totalScore += fidScore;
    count++;
  }

  // CLS scoring (0-100)
  if (metrics.cls !== undefined) {
    let clsScore = 100;
    let clsGrade = 'A';
    if (metrics.cls > 0.25) {
      clsScore = 0;
      clsGrade = 'F';
    } else if (metrics.cls > 0.1) {
      clsScore = 50;
      clsGrade = 'C';
    } else if (metrics.cls > 0.05) {
      clsScore = 75;
      clsGrade = 'B';
    }
    details.cls = { value: metrics.cls, score: clsScore, grade: clsGrade };
    totalScore += clsScore;
    count++;
  }

  // TTFB scoring (0-100)
  if (metrics.ttfb !== undefined) {
    let ttfbScore = 100;
    let ttfbGrade = 'A';
    if (metrics.ttfb > 1000) {
      ttfbScore = 0;
      ttfbGrade = 'F';
    } else if (metrics.ttfb > 600) {
      ttfbScore = 50;
      ttfbGrade = 'C';
    } else if (metrics.ttfb > 400) {
      ttfbScore = 75;
      ttfbGrade = 'B';
    }
    details.ttfb = { value: metrics.ttfb, score: ttfbScore, grade: ttfbGrade };
    totalScore += ttfbScore;
    count++;
  }

  const averageScore = count > 0 ? Math.round(totalScore / count) : 0;
  let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'A';
  if (averageScore < 50) grade = 'F';
  else if (averageScore < 65) grade = 'D';
  else if (averageScore < 80) grade = 'C';
  else if (averageScore < 90) grade = 'B';

  return { score: averageScore, grade, details };
}

/**
 * Log performance metrics to console (development only)
 */
export function logPerformanceMetrics(metrics: PerformanceMetrics) {
  if (process.env.NODE_ENV !== 'development') return;

  console.group('🚀 Performance Metrics');
  if (metrics.lcp) console.log(`LCP: ${metrics.lcp.toFixed(2)}ms`);
  if (metrics.fid) console.log(`FID: ${metrics.fid.toFixed(2)}ms`);
  if (metrics.cls) console.log(`CLS: ${metrics.cls.toFixed(4)}`);
  if (metrics.ttfb) console.log(`TTFB: ${metrics.ttfb.toFixed(2)}ms`);
  if (metrics.fcp) console.log(`FCP: ${metrics.fcp.toFixed(2)}ms`);

  const score = getPerformanceScore(metrics);
  console.log(`Overall Score: ${score.score}/100 (${score.grade})`);
  console.groupEnd();
}

/**
 * Send performance metrics to analytics (if configured)
 */
export function sendPerformanceMetrics(metrics: PerformanceMetrics) {
  // This would typically send to your analytics service
  // Example: Google Analytics, Sentry, etc.
  if (typeof window !== 'undefined' && (window as any).gtag) {
    const score = getPerformanceScore(metrics);
    (window as any).gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      value: score.score,
      non_interaction: true,
      ...metrics,
    });
  }
}

