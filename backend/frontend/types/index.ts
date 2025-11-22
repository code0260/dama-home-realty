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
  total_price: number;
  amount_paid: number;
  payment_status: 'pending' | 'paid' | 'partial' | 'refunded';
  booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  stripe_checkout_session_id?: string | null;
  notes?: string | null;
  nights?: number; // Calculated from check_in and check_out dates
  property?: Property & {
    tenant_details?: {
      wifi_password?: string | null;
      door_code?: string | null;
      house_rules?: string | null;
      full_address?: string | null;
    };
  };
  created_at: string;
  updated_at: string;
}

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Agent Types
export interface Agent {
  id: number;
  name: string;
  photo?: string | null;
  role?: string | null;
  phone?: string | null;
  languages?: string[] | null;
  license_no?: string | null;
}

// Service Types
export interface Service {
  id: number;
  title: string;
  description: string;
  icon?: string | null;
  sort_order?: number | null;
  slug?: string | null;
  category?: string | null;
  price?: number | null;
  currency?: 'USD' | 'SYP' | null;
  duration?: string | null;
  availability?: 'available' | 'limited' | 'unavailable' | null;
  locations?: string[] | null;
  packages?: ServicePackage[] | null;
  faq?: FAQ[] | null;
  image?: string | null;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ServicePackage {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'SYP';
  duration?: string | null;
  features: string[];
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface ServiceReview {
  id: number;
  service_id: number;
  client_name: string;
  rating: number;
  comment: string;
  photo?: string | null;
  created_at: string;
}

// Testimonial Types
export interface Testimonial {
  id: number;
  client_name: string;
  country_flag?: string | null;
  comment: string;
  rating: number;
  photo?: string | null;
  is_featured: boolean;
}

// Article Types
export interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  image: string | null;
  author: {
    id: number;
    name: string;
  } | null;
  published_at: string | null;
  is_featured: boolean;
  views: number;
  excerpt: string;
  created_at?: string;
  updated_at?: string;
}

// Utility Types
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PropertyAvailability {
  property_id: number;
  blocked_dates: string[];
  available: boolean;
}
