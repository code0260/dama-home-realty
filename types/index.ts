// Property Types
export interface Property {
  uuid: string;
  id?: number; // Add id for booking
  slug: string;
  title: string; // Translatable - will be the current locale
  description: string; // Translatable - will be the current locale
  price: number;
  currency: 'USD' | 'SYP';
  type: 'rent' | 'sale' | 'hotel';
  neighborhood?: Neighborhood;
  agent?: Agent;
  reference_id?: string | null;
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  is_verified: boolean;
  is_featured: boolean;
  amenities: string[];
  images: string[];
  video_url?: string | null;
  owner_contact: string;
  status: 'active' | 'sold' | 'rented';
  created_at: string;
  updated_at: string;
}

// Neighborhood Types
export interface Neighborhood {
  id: number;
  name: string; // Translatable - will be the current locale
  slug: string;
  description?: string | null; // Translatable
  image?: string | null;
  city: string;
  created_at?: string;
  updated_at?: string;
}

// Lead Types
export interface Lead {
  id: number;
  name: string;
  phone: string;
  message?: string | null;
  property_id?: number | null;
  property?: Property | null;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
  updated_at: string;
}

// Booking Types
export interface Booking {
  id: number;
  property_id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  nights: number;
  total_price: number;
  amount_paid: number;
  payment_status: 'pending' | 'paid' | 'partial' | 'refunded';
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string | null;
  property?: Property & {
    tenant_details?: {
      wifi_password?: string | null;
      door_code?: string | null;
      house_rules?: string | null;
      full_address?: string | null;
    } | null;
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PropertyAvailability {
  property_id: number;
  blocked_dates: string[];
  available: boolean;
}

// User Type
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Agent Type
export interface Agent {
  id: number;
  name: string;
  photo?: string | null;
  role: string;
  phone: string;
  languages?: string[];
  license_no?: string | null;
}

// Service Type
export interface Service {
  id: number;
  title: string;
  description?: string | null;
  icon?: string | null;
  sort_order: number;
}

// Testimonial Type
export interface Testimonial {
  id: number;
  client_name: string;
  country_flag?: string | null;
  comment: string;
  rating: number;
  photo?: string | null;
  is_featured: boolean;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Filter Types
export interface PropertyFilters {
  type?: 'rent' | 'sale' | 'hotel' | 'all';
  min_price?: number;
  max_price?: number;
  neighborhood_id?: number | string; // Can be 'all' or number
  bedrooms?: number | string; // Can be 'all' or number
  bathrooms?: number | string; // Can be 'all' or number
  amenities?: string[];
  featured?: boolean;
  status?: 'active' | 'sold' | 'rented';
  per_page?: number;
  page?: number;
  locale?: 'en' | 'ar';
  sort_by?: 'newest' | 'price_asc' | 'price_desc';
}
