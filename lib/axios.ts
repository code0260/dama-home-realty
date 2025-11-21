import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Sanctum SPA authentication
});

// CSRF cookie cache to avoid multiple requests
let csrfCookiePromise: Promise<void> | null = null;

// Function to get CSRF cookie
async function getCsrfCookie(): Promise<void> {
  if (csrfCookiePromise) {
    return csrfCookiePromise;
  }

  const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  csrfCookiePromise = axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
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

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get CSRF cookie before POST/PUT/DELETE requests
    if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '')) {
      try {
        await getCsrfCookie();
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
          await getCsrfCookie();
          
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

