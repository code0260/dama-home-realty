import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Sanctum SPA authentication
  timeout: 30000, // 30 seconds timeout (increased for slow connections)
});

// CSRF cookie cache to avoid multiple requests
let csrfCookiePromise: Promise<void> | null = null;

// Function to get CSRF cookie
async function getCsrfCookie(forceRefresh: boolean = false): Promise<void> {
  // If forcing refresh, clear cache
  if (forceRefresh) {
    csrfCookiePromise = null;
  }
  
  if (csrfCookiePromise) {
    return csrfCookiePromise;
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  
  csrfCookiePromise = axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
    timeout: 15000, // 15 seconds for CSRF cookie (increased)
  }).then(() => {
    // Small delay to ensure cookie is properly set
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 50);
    });
  }).then(() => {
    // Reset promise after 5 minutes to refresh cookie
    setTimeout(() => {
      csrfCookiePromise = null;
    }, 5 * 60 * 1000);
  }).catch((error) => {
    csrfCookiePromise = null;
    
    // Log error but don't throw - allow request to proceed without CSRF token
    // The backend will handle CSRF validation and return 419 if needed
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.warn('CSRF cookie request timed out. Request may fail CSRF validation.', {
        baseURL,
        timeout: '15s',
        hint: 'Backend server may be slow or unreachable. Check if server is running.',
      });
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.warn('CSRF cookie request failed due to network error. Request may fail CSRF validation.', {
        baseURL,
        hint: 'Backend server may be down. Check if server is running.',
      });
    } else {
      console.warn('CSRF cookie request failed:', error.message);
    }
    
    // Don't throw - allow the request to proceed
    // The backend will handle CSRF validation appropriately
  });

  return csrfCookiePromise;
}

// Helper function to get cookie value by name
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
  } catch (error) {
    console.error('Error reading cookie:', error);
  }
  return null;
}

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get CSRF cookie before POST/PUT/DELETE requests
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      try {
        // Get CSRF cookie first (non-blocking - won't throw on timeout)
        await getCsrfCookie().catch(() => {
          // Error already logged in getCsrfCookie
          // Continue with request anyway
        });
        
        // Wait a bit to ensure cookie is accessible (but don't wait too long)
        await Promise.race([
          new Promise(resolve => setTimeout(resolve, 100)),
          new Promise(resolve => setTimeout(resolve, 500)), // Max wait 500ms
        ]);
        
        // Get XSRF-TOKEN cookie and set it as X-XSRF-TOKEN header
        const xsrfToken = getCookie('XSRF-TOKEN');
        if (xsrfToken) {
          config.headers['X-XSRF-TOKEN'] = xsrfToken;
        } else {
          // Only warn in development
          if (process.env.NODE_ENV === 'development') {
            console.warn('XSRF-TOKEN cookie not found. CSRF protection may fail. The request will proceed anyway.');
          }
        }
      } catch (error: any) {
        // Log error but don't block the request
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to get CSRF cookie:', error.message || error);
        }
        // Request will proceed without CSRF token - backend will handle validation
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle network errors (connection issues)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.code === 'ECONNREFUSED') {
      const baseURL = axiosInstance.defaults.baseURL;
      const backendURL = baseURL?.replace('/api', '') || 'http://localhost:8000';
      
      // Only log once per session to avoid console spam
      if (!(window as any).__networkErrorLogged) {
        console.warn(
          `%c⚠️ Backend Server Not Available%c\n\n` +
          `The Laravel backend server is not running or unreachable.\n` +
          `Expected URL: ${backendURL}\n\n` +
          `To fix this:\n` +
          `1. Open a terminal in the 'backend' folder\n` +
          `2. Run: php artisan serve\n` +
          `3. Make sure it's running on port 8000\n\n` +
          `The application will continue to work, but API calls will fail.`,
          'color: #f59e0b; font-weight: bold; font-size: 14px;',
          'color: #6b7280; font-size: 12px;'
        );
        (window as any).__networkErrorLogged = true;
        
        // Clear the flag after 30 seconds to allow re-logging if server comes back online
        setTimeout(() => {
          (window as any).__networkErrorLogged = false;
        }, 30000);
      }
      
      // For GET requests, we'll let the component handle the error gracefully
      // but provide a more helpful error message
      const networkError = {
        ...error,
        isNetworkError: true,
        message: `Unable to connect to backend server. Please ensure the Laravel server is running at ${backendURL}`,
        code: error.code || 'NETWORK_ERROR',
        backendURL,
      };
      
      return Promise.reject(networkError);
    }
    
    // Handle timeout errors with retry logic
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      const originalRequest = error.config;
      
      // Only retry GET requests (safe to retry)
      if (originalRequest && originalRequest.method?.toLowerCase() === 'get' && !originalRequest._retryCount) {
        const retryCount = (originalRequest._retryCount || 0) + 1;
        const maxRetries = 2; // Retry up to 2 times
        
        if (retryCount <= maxRetries) {
          originalRequest._retryCount = retryCount;
          originalRequest._retry = true;
          
          // Wait before retry (exponential backoff)
          const delay = retryCount * 1000; // 1s, 2s
          
          console.warn(`Request timeout (attempt ${retryCount}/${maxRetries}). Retrying in ${delay}ms...`, {
            url: originalRequest.url,
          });
          
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(axiosInstance(originalRequest));
            }, delay);
          });
        }
      }
      
      // If no retry or max retries reached, reject with error
      console.error('Request timeout (max retries reached):', {
        baseURL: axiosInstance.defaults.baseURL,
        url: originalRequest?.url,
        retryCount: originalRequest?._retryCount || 0,
      });
      
      return Promise.reject({
        ...error,
        isTimeoutError: true,
        message: 'Request timed out. The server may be slow or unreachable. Please check if the backend is running.',
      });
    }
    
    // Handle CSRF token mismatch (419)
    if (error.response?.status === 419) {
      // Clear CSRF cookie cache and retry once
      csrfCookiePromise = null;
      
      const originalRequest = error.config;
      
      // Only retry if not already retried
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Get fresh CSRF cookie
          await getCsrfCookie(true); // Force refresh
          
          // Wait to ensure cookie is set and accessible
          await new Promise(resolve => setTimeout(resolve, 200));
          
          // Get XSRF-TOKEN cookie and set it as X-XSRF-TOKEN header
          const xsrfToken = getCookie('XSRF-TOKEN');
          if (xsrfToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['X-XSRF-TOKEN'] = xsrfToken;
          }
          
          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (retryError) {
          return Promise.reject(retryError);
        }
      }
    }
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Only redirect to login for protected routes
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const protectedRoutes = ['/portal', '/bookings'];
        
        // Check if current path is a protected route
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        
        if (isProtectedRoute && !pathname.includes('/login')) {
          const currentPath = window.location.pathname + window.location.search;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

