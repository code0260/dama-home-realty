import axios from 'axios';
import axiosInstance from './axios';
import { Property, PaginatedResponse, Booking, PropertyAvailability, Neighborhood, User, Service, Testimonial, Agent, Article } from '@/types';

/**
 * Get a property by slug
 */
export async function getPropertyBySlug(slug: string, locale: string = 'en'): Promise<Property> {
  const response = await axiosInstance.get<Property>(`/properties/${slug}`, {
    params: { locale },
  });
  // Laravel Resource returns the property directly (not wrapped in data)
  return response.data;
}

/**
 * Get featured properties
 */
export async function getFeaturedProperties(
  limit: number = 3,
  excludeUuid?: string,
  locale: string = 'en'
): Promise<Property[]> {
  const response = await axiosInstance.get<PaginatedResponse<Property>>('/properties', {
    params: {
      featured: true,
      status: 'active',
      per_page: limit,
      locale,
    },
  });
  
  let properties = response.data.data || [];
  
  // Exclude current property if provided
  if (excludeUuid) {
    properties = properties.filter((p) => p.uuid !== excludeUuid);
  }
  
  return properties.slice(0, limit);
}

/**
 * Get properties with filters
 */
export async function getProperties(filters: {
  type?: string;
  neighborhood_id?: number;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  status?: string;
  per_page?: number;
  page?: number;
  locale?: string;
}): Promise<PaginatedResponse<Property>> {
  const response = await axiosInstance.get<PaginatedResponse<Property>>('/properties', {
    params: filters,
  });
  return response.data;
}

export async function getNeighborhoods(filters?: { city?: string; locale?: string }): Promise<Neighborhood[]> {
  const response = await axiosInstance.get<{ data: Neighborhood[] }>('/neighborhoods', {
    params: filters,
  });
  return response.data?.data || [];
}

export async function submitContactForm(formData: { name: string; email: string; subject: string; message: string }) {
  const response = await axiosInstance.post('/contact', formData);
  return response.data;
}

export async function submitLeadForm(formData: { name: string; phone: string; property_type: string; location: string; message?: string }) {
  const response = await axiosInstance.post('/leads', formData);
  return response.data;
}

/**
 * Get property availability (blocked dates)
 */
export async function getPropertyAvailability(identifier: string): Promise<PropertyAvailability> {
  const response = await axiosInstance.get<PropertyAvailability>(`/properties/${identifier}/availability`);
  return response.data;
}

/**
 * Create a new booking
 */
export async function createBooking(formData: {
  property_id: number;
  check_in: string;
  check_out: string;
  notes?: string;
}): Promise<Booking> {
  const response = await axiosInstance.post<Booking>('/bookings', formData);
  return response.data;
}

/**
 * Get user's bookings
 */
export async function getMyBookings(): Promise<PaginatedResponse<Booking>> {
  const response = await axiosInstance.get<PaginatedResponse<Booking>>('/bookings');
  return response.data;
}

/**
 * Get a single booking by ID
 */
export async function getBooking(id: number): Promise<Booking> {
  const response = await axiosInstance.get<Booking>(`/bookings/${id}`);
  return response.data;
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(bookingId: number): Promise<{ checkout_url: string; session_id: string }> {
  const response = await axiosInstance.post<{ checkout_url: string; session_id: string }>(
    `/bookings/${bookingId}/checkout`
  );
  return response.data;
}

/**
 * Verify payment status
 */
export async function verifyPayment(bookingId: number): Promise<{ paid: boolean; status: string }> {
  const response = await axiosInstance.get<{ paid: boolean; status: string }>(
    `/bookings/${bookingId}/payment/verify`
  );
  return response.data;
}

/**
 * Authentication API functions
 */

/**
 * Get CSRF cookie (required before login/register)
 */
export async function getCsrfCookie(): Promise<void> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

/**
 * Register a new user
 */
export async function register(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<{ message: string; user: User }> {
  // Ensure CSRF cookie is obtained before register
  // Clear any cached promise to force fresh cookie
  const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
  
  // Wait a bit longer to ensure cookie is set and accessible
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // The axios interceptor will automatically add X-XSRF-TOKEN header
  const response = await axiosInstance.post<{ message: string; user: User }>('/register', data);
  return response.data;
}

/**
 * Login user
 */
export async function login(data: {
  email: string;
  password: string;
  remember?: boolean;
}): Promise<{ message: string; user: User }> {
  // Ensure CSRF cookie is obtained before login
  // Clear any cached promise to force fresh cookie
  const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
  await axios.get(`${baseURL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
  
  // Wait a bit longer to ensure cookie is set and accessible
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // The axios interceptor will automatically add X-XSRF-TOKEN header
  const response = await axiosInstance.post<{ message: string; user: User }>('/login', data);
  return response.data;
}

/**
 * Logout user
 */
export async function logout(): Promise<{ message: string }> {
  const response = await axiosInstance.post<{ message: string }>('/logout');
  return response.data;
}

/**
 * Get authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  try {
    const response = await axiosInstance.get<User>('/user');
    return response.data;
  } catch (error: any) {
    // Re-throw with better error message
    if (error.isNetworkError || error.isTimeoutError) {
      throw {
        ...error,
        message: 'Unable to connect to backend server. Please ensure the Laravel server is running.',
      };
    }
    throw error;
  }
}

/**
 * Get all active services
 */
/**
 * Get all services
 */
export async function getServices(locale: string = 'en'): Promise<Service[]> {
  const response = await axiosInstance.get<{ data: Service[] }>('/services', {
    params: { locale },
  });
  // Laravel API returns { success: true, data: [...], message: "..." }
  return response.data?.data || [];
}

/**
 * Get all agents
 */
export async function getAgents(): Promise<Agent[]> {
  const response = await axiosInstance.get<{ data: Agent[] }>('/agents');
  return response.data?.data || [];
}

/**
 * Get testimonials
 */
export async function getTestimonials(featured: boolean = false, locale: string = 'en'): Promise<Testimonial[]> {
  try {
    const response = await axiosInstance.get<{ data: Testimonial[]; message?: string }>('/testimonials', {
      params: { featured, locale },
    });
    // Handle both response formats: direct array or wrapped in data
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data?.data || [];
  } catch (error: any) {
    // Log network errors but return empty array for graceful degradation
    if (error.isNetworkError || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.warn('Network error fetching testimonials. Backend server may not be running.');
    }
    return []; // Return empty array on error
  }
}

/**
 * Submit live tour request
 */
export async function submitLiveTourRequest(data: {
  name: string;
  phone: string;
  preferred_date: string;
  preferred_time: string;
  property_id: number;
  message?: string;
}): Promise<{ message: string; success: boolean }> {
  const response = await axiosInstance.post('/leads', {
    ...data,
    type: 'live_tour_request',
  });
  return response.data;
}

/**
 * Get a service by slug
 */
export async function getServiceBySlug(slug: string, locale: string = 'en'): Promise<Service> {
  const response = await axiosInstance.get<Service>(`/services/${slug}`, {
    params: { locale },
  });
  return response.data;
}

/**
 * Submit service request
 */
export async function submitServiceRequest(
  data: FormData | {
  name: string;
  phone: string;
  message: string;
}): Promise<{ message: string; success: boolean }> {
  // Check if data is FormData (has append method) or plain object
  const isFormData = data instanceof FormData;
  
  if (isFormData) {
    // Append type for FormData
    data.append('type', 'service_request');
    const response = await axiosInstance.post('/leads', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } else {
    const response = await axiosInstance.post('/leads', {
      ...data,
      type: 'service_request',
    });
    return response.data;
  }
}

/**
 * Get user's service requests
 */
export async function getMyServices(): Promise<any[]> {
  const response = await axiosInstance.get<{ data: any[] }>('/my-services');
  return response.data?.data || [];
}

/**
 * Get articles (blog posts)
 */
export async function getArticles(filters?: {
  featured?: boolean;
  per_page?: number;
  page?: number;
  locale?: string;
}): Promise<PaginatedResponse<Article>> {
  try {
    const response = await axiosInstance.get<PaginatedResponse<Article>>('/articles', {
      params: filters,
    });
    return response.data;
  } catch (error: any) {
    // Log network errors but return empty paginated response for graceful degradation
    if (error.isNetworkError || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.warn('Network error fetching articles. Backend server may not be running.');
    }
    // Return empty paginated response structure
    return {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: filters?.per_page || 12,
      total: 0,
    };
  }
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string, locale: string = 'en'): Promise<Article> {
  const response = await axiosInstance.get<Article>(`/articles/${slug}`, {
    params: { locale },
  });
  return response.data;
}

/**
 * AI Concierge Chat
 */
export async function chatWithConcierge(data: {
  message: string;
  conversation_history?: Array<{ role: string; content: string }>;
  current_page?: string;
  property_slug?: string | null;
}): Promise<{ message: string; tool_calls?: boolean }> {
  const response = await axiosInstance.post<{ message: string; tool_calls?: boolean }>(
    '/ai-concierge/chat',
    data
  );
  return response.data;
}
