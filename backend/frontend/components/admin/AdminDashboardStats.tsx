'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDashboardStats, DashboardStats } from '@/lib/api/admin';
import { TrendingUp, TrendingDown, DollarSign, Home, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">{error || 'Failed to load statistics'}</p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.total.toLocaleString()}`,
      change: stats.revenue.growth,
      trend: stats.revenue.trend,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Properties',
      value: stats.properties.total.toLocaleString(),
      change: stats.properties.growth,
      trend: stats.properties.trend,
      icon: Home,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Bookings',
      value: stats.bookings.total.toLocaleString(),
      change: stats.bookings.growth,
      trend: stats.bookings.trend,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Leads',
      value: stats.leads.total.toLocaleString(),
      change: stats.leads.growth,
      trend: stats.leads.trend,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = stat.trend === 'up';
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={cn('p-2 rounded-lg', stat.bgColor)}>
                <Icon className={cn('h-4 w-4', stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs mt-1">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                )}
                <span className={cn(isPositive ? 'text-green-600' : 'text-red-600')}>
                  {Math.abs(stat.change).toFixed(1)}%
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
