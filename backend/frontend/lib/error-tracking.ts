/**
 * Error Tracking with Sentry
 * Provides comprehensive error tracking and monitoring
 * Note: Sentry is optional - if not installed, errors will be logged to console
 */

/**
 * Check if Sentry is available
 */
function isSentryAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!process.env.NEXT_PUBLIC_SENTRY_DSN &&
    process.env.NODE_ENV === 'production'
  );
}

/**
 * Helper to safely load Sentry at runtime
 * Uses Function constructor to prevent webpack from resolving at build time
 */
function loadSentry(): Promise<any> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    try {
      // Use Function constructor to prevent webpack from resolving this at build time
      const dynamicImport = new Function('moduleName', 'return import(moduleName)');
      dynamicImport('@sentry/nextjs')
        .then((Sentry: any) => resolve(Sentry))
        .catch(() => resolve(null));
    } catch {
      resolve(null);
    }
  });
}

/**
 * Initialize Sentry
 */
export function initSentry() {
  if (!isSentryAvailable()) {
    return;
  }

  // Load Sentry asynchronously after initial render
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      loadSentry().then((Sentry: any) => {
        if (Sentry && typeof Sentry.init === 'function') {
          try {
            Sentry.init({
              dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
              environment: process.env.NODE_ENV,
              tracesSampleRate: 1.0,
              replaysSessionSampleRate: 0.1,
              replaysOnErrorSampleRate: 1.0,
              integrations: [
                Sentry.replayIntegration({
                  maskAllText: true,
                  blockAllMedia: true,
                }),
                Sentry.browserTracingIntegration(),
              ],
            });
          } catch (err) {
            // Ignore initialization errors
          }
        }
      });
    }, 100);
  }
}

/**
 * Capture exception
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (typeof window === 'undefined') {
    return;
  }

  // Always log to console
  console.error('Error captured:', error, context);

  if (isSentryAvailable()) {
    loadSentry().then((Sentry: any) => {
      if (Sentry && typeof Sentry.captureException === 'function') {
        try {
          Sentry.captureException(error, {
            contexts: {
              custom: context || {},
            },
          });
        } catch (err) {
          // Ignore errors
        }
      }
    });
  }
}

/**
 * Capture message
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  if (typeof window === 'undefined') {
    return;
  }

  const logMethod = level === 'info' ? 'log' : level === 'warning' ? 'warn' : 'error';
  console[logMethod]('Message captured:', message);

  if (isSentryAvailable()) {
    loadSentry().then((Sentry: any) => {
      if (Sentry && typeof Sentry.captureMessage === 'function') {
        try {
          Sentry.captureMessage(message, level);
        } catch (err) {
          // Ignore errors
        }
      }
    });
  }
}

/**
 * Set user context
 */
export function setUserContext(userId: string, email?: string, username?: string) {
  if (typeof window === 'undefined') {
    return;
  }

  if (isSentryAvailable()) {
    loadSentry().then((Sentry: any) => {
      if (Sentry && typeof Sentry.setUser === 'function') {
        try {
          Sentry.setUser({
            id: userId,
            email: email,
            username: username,
          });
        } catch (err) {
          // Ignore errors
        }
      }
    });
  }
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(
  message: string,
  category: string,
  level: 'info' | 'warning' | 'error' = 'info',
  data?: Record<string, any>
) {
  if (typeof window === 'undefined') {
    return;
  }

  if (isSentryAvailable()) {
    loadSentry().then((Sentry: any) => {
      if (Sentry && typeof Sentry.addBreadcrumb === 'function') {
        try {
          Sentry.addBreadcrumb({
            message: message,
            category: category,
            level: level,
            data: data,
          });
        } catch (err) {
          // Ignore errors
        }
      }
    });
  }
}
