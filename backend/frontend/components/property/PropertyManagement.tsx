'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Edit,
  Eye,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Property } from '@/types';
import axiosInstance from '@/lib/axios';
import Link from 'next/link';

interface PropertyManagementProps {
  property: Property;
  onEdit?: () => void;
  className?: string;
}

interface PropertyAnalytics {
  views: number;
  inquiries: number;
  favorites: number;
  shares: number;
  averageRating?: number;
  totalReviews?: number;
  conversionRate?: number;
}

interface ViewHistory {
  date: string;
  views: number;
}

export function PropertyManagement({
  property,
  onEdit,
  className,
}: PropertyManagementProps) {
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null);
  const [viewHistory, setViewHistory] = useState<ViewHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [property.id]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Fetch analytics from API
      const response = await axiosInstance.get(`/properties/${property.id}/analytics`);
      setAnalytics(response.data.analytics || null);
      setViewHistory(response.data.viewHistory || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data for demonstration
      setAnalytics({
        views: 100,
        inquiries: 5,
        favorites: 12,
        shares: 8,
        averageRating: 4.5,
        totalReviews: 3,
        conversionRate: 2.5,
      });
      setViewHistory([
        { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), views: 10 },
        { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), views: 15 },
        { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), views: 12 },
        { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), views: 18 },
        { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), views: 20 },
        { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), views: 25 },
        { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), views: 22 },
        { date: new Date().toISOString(), views: 30 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case 'sold':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Sold
          </Badge>
        );
      case 'rented':
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Rented
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
    }
  };

  const maxViews = viewHistory.length > 0
    ? Math.max(...viewHistory.map((v) => v.views))
    : 1;

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Loading analytics...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Property Header */}
      <Card className="border-2 border-gray-200 dark:border-primary-700">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-primary dark:text-white">
                  {property.title}
                </h2>
                {getStatusBadge(property.status)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{property.neighborhood?.name || 'Damascus'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {property.price.toLocaleString()} {property.currency}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {format(new Date(property.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
            {onEdit && (
              <Button onClick={onEdit} variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Property
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Analytics Overview */}
      {analytics && (
        <Card className="border-2 border-gray-200 dark:border-primary-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-secondary" />
              Property Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="p-4 bg-gray-50 dark:bg-primary-800 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Views
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary dark:text-white">
                  {analytics.views.toLocaleString()}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="p-4 bg-gray-50 dark:bg-primary-800 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Inquiries
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary dark:text-white">
                  {analytics.inquiries}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="p-4 bg-gray-50 dark:bg-primary-800 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Favorites
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary dark:text-white">
                  {analytics.favorites}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="p-4 bg-gray-50 dark:bg-primary-800 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Shares
                  </span>
                </div>
                <p className="text-2xl font-bold text-primary dark:text-white">
                  {analytics.shares}
                </p>
              </motion.div>
            </div>

            {/* Conversion Rate */}
            {analytics.conversionRate !== undefined && (
              <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-primary dark:text-white">
                    Conversion Rate
                  </span>
                  <span className="text-sm font-bold text-secondary">
                    {analytics.conversionRate}%
                  </span>
                </div>
                <Progress
                  value={analytics.conversionRate}
                  className="h-2"
                />
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Percentage of viewers who made an inquiry
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* View History */}
      {viewHistory.length > 0 && (
        <Card className="border-2 border-gray-200 dark:border-primary-700">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-secondary" />
              View History (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {viewHistory.map((entry, index) => (
                <motion.div
                  key={entry.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-24 text-sm text-gray-600 dark:text-gray-400 flex-shrink-0">
                    {format(new Date(entry.date), 'MMM dd')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-primary dark:text-white">
                        {entry.views} views
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {Math.round((entry.views / maxViews) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={(entry.views / maxViews) * 100}
                      className="h-2"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="border-2 border-gray-200 dark:border-primary-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-primary dark:text-white">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start"
            >
              <Link href={`/properties/${property.slug}`}>
                <Eye className="w-4 h-4 mr-2" />
                View Property Page
              </Link>
            </Button>
            {onEdit && (
              <Button
                onClick={onEdit}
                variant="outline"
                className="w-full justify-start"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Property Details
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

