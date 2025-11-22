'use client';

import { useEffect } from 'react';
import { initSentry, captureException } from '@/lib/error-tracking';

export function ErrorTracking() {
  useEffect(() => {
    // Initialize Sentry (will skip if not available)
    initSentry();

    // Global error handler
    const handleError = (event: ErrorEvent) => {
      captureException(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    };

    // Unhandled promise rejection handler
    const handleRejection = (event: PromiseRejectionEvent) => {
      captureException(
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason)),
        {
          type: 'unhandled_promise_rejection',
        }
      );
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
}
