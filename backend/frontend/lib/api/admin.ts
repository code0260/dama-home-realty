/**
 * Admin Dashboard API Client
 * 
 * This module provides API functions for admin dashboard features.
 * All endpoints require authentication and admin role.
 */

import axiosInstance from '../axios';

export interface DashboardStats {
  revenue: {
    total: number;
    this_month: number;
    growth: number;
    trend: 'up' | 'down';
  };
  properties: {
    total: number;
    active: number;
    this_month: number;
    growth: number;
    trend: 'up' | 'down';
  };
  bookings: {
    total: number;
    this_month: number;
    growth: number;
    trend: 'up' | 'down';
  };
  leads: {
    total: number;
    new: number;
    this_month: number;
    growth: number;
    trend: 'up' | 'down';
  };
}

export interface RevenueData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

export interface PropertiesMapData {
  properties: Array<{
    id: number;
    title: string;
    latitude: number;
    longitude: number;
    type: string;
    status: string;
    price: number;
    neighborhood: string;
  }>;
  total: number;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await axiosInstance.get<{ data: DashboardStats }>(
    '/admin/dashboard/stats'
  );
  return response.data.data;
}

/**
 * Get revenue data for charts
 */
export async function getRevenueData(
  period: '7days' | '30days' | '3months' | '6months' | '12months' = '12months'
): Promise<RevenueData> {
  const response = await axiosInstance.get<{ data: RevenueData }>(
    '/admin/dashboard/revenue',
    {
      params: { period },
    }
  );
  return response.data.data;
}

/**
 * Get bookings data for charts
 */
export async function getBookingsData(
  period: '7days' | '30days' | '3months' | '6months' | '12months' = '12months'
): Promise<RevenueData> {
  const response = await axiosInstance.get<{ data: RevenueData }>(
    '/admin/dashboard/bookings',
    {
      params: { period },
    }
  );
  return response.data.data;
}

/**
 * Get leads data for charts
 */
export async function getLeadsData(
  period: '7days' | '30days' | '3months' | '6months' | '12months' = '12months'
): Promise<RevenueData> {
  const response = await axiosInstance.get<{ data: RevenueData }>(
    '/admin/dashboard/leads',
    {
      params: { period },
    }
  );
  return response.data.data;
}

/**
 * Get properties data
 */
export async function getPropertiesData(): Promise<any> {
  const response = await axiosInstance.get('/admin/dashboard/properties');
  return response.data.data;
}

/**
 * Get properties map data
 */
export async function getPropertiesMapData(): Promise<PropertiesMapData> {
  const response = await axiosInstance.get<{ data: PropertiesMapData }>(
    '/admin/dashboard/properties/map-data'
  );
  return response.data.data;
}

/**
 * Get analytics overview
 */
export async function getAnalyticsOverview(): Promise<any> {
  const response = await axiosInstance.get('/admin/analytics/overview');
  return response.data.data;
}

/**
 * Get properties analytics
 */
export async function getPropertiesAnalytics(): Promise<any> {
  const response = await axiosInstance.get('/admin/analytics/properties');
  return response.data.data;
}

/**
 * Get bookings analytics
 */
export async function getBookingsAnalytics(): Promise<any> {
  const response = await axiosInstance.get('/admin/analytics/bookings');
  return response.data.data;
}

/**
 * Get leads analytics
 */
export async function getLeadsAnalytics(): Promise<any> {
  const response = await axiosInstance.get('/admin/analytics/leads');
  return response.data.data;
}

/**
 * Get agents analytics
 */
export async function getAgentsAnalytics(): Promise<any> {
  const response = await axiosInstance.get('/admin/analytics/agents');
  return response.data.data;
}

/**
 * Get notifications
 */
export async function getNotifications(params?: {
  per_page?: number;
}): Promise<any> {
  const response = await axiosInstance.get('/admin/dashboard/notifications', {
    params,
  });
  return response.data;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(id: string | number): Promise<void> {
  await axiosInstance.post(`/admin/dashboard/notifications/${id}/read`);
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  await axiosInstance.post('/admin/dashboard/notifications/read-all');
}

/**
 * Get Google Analytics overview
 */
export async function getGoogleAnalyticsOverview(params?: {
  start_date?: string;
  end_date?: string;
}): Promise<any> {
  const response = await axiosInstance.get('/admin/google-analytics/overview', {
    params,
  });
  return response.data.data;
}

/**
 * Get Google Analytics page views
 */
export async function getGoogleAnalyticsPageViews(params?: {
  start_date?: string;
  end_date?: string;
}): Promise<any> {
  const response = await axiosInstance.get('/admin/google-analytics/page-views', {
    params,
  });
  return response.data.data;
}

/**
 * Get Google Analytics user behavior
 */
export async function getGoogleAnalyticsUserBehavior(params?: {
  start_date?: string;
  end_date?: string;
}): Promise<any> {
  const response = await axiosInstance.get('/admin/google-analytics/user-behavior', {
    params,
  });
  return response.data.data;
}

/**
 * Get Google Analytics conversions
 */
export async function getGoogleAnalyticsConversions(params?: {
  start_date?: string;
  end_date?: string;
}): Promise<any> {
  const response = await axiosInstance.get('/admin/google-analytics/conversions', {
    params,
  });
  return response.data.data;
}

/**
 * Get Google Analytics traffic sources
 */
export async function getGoogleAnalyticsTrafficSources(params?: {
  start_date?: string;
  end_date?: string;
}): Promise<any> {
  const response = await axiosInstance.get('/admin/google-analytics/traffic-sources', {
    params,
  });
  return response.data.data;
}

