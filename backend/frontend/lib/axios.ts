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
    timeout: 10000, // 10 seconds for CSRF cookie (shorter than main requests)
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
    throw error;
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
        // Get CSRF cookie first
        await getCsrfCookie();
        
        // Wait a bit to ensure cookie is accessible
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Get XSRF-TOKEN cookie and set it as X-XSRF-TOKEN header
        const xsrfToken = getCookie('XSRF-TOKEN');
        if (xsrfToken) {
          config.headers['X-XSRF-TOKEN'] = xsrfToken;
        } else {
          console.warn('XSRF-TOKEN cookie not found. CSRF protection may fail.');
        }
      } catch (error) {
        console.error('Failed to get CSRF cookie:', error);
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
      console.error('Network Error - Backend server may be down or unreachable:', {
        baseURL,
        url: error.config?.url,
        message: error.message,
        code: error.code,
        hint: `Make sure the backend server is running at ${baseURL?.replace('/api', '') || 'http://localhost:8000'}`,
      });
      
      // For GET requests, we'll let the component handle the error gracefully
      // but provide a more helpful error message
      const networkError = {
        ...error,
        isNetworkError: true,
        message: `Unable to connect to backend server at ${baseURL}. Please ensure the Laravel server is running.`,
        code: error.code || 'NETWORK_ERROR',
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

