'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getRevenueData, RevenueData } from '@/lib/api/admin';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  period?: '7days' | '30days' | '3months' | '6months' | '12months';
}

export function RevenueChart({ period = '12months' }: RevenueChartProps) {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const revenueData = await getRevenueData(period);
        setData(revenueData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching revenue data:', err);
        setError('Failed to load revenue data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [period]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">{error || 'Failed to load revenue data'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Revenue Trend
          </CardTitle>
          <select
            value={period}
            onChange={(e) => {
              const newPeriod = e.target.value as typeof period;
              setLoading(true);
              getRevenueData(newPeriod)
                .then(setData)
                .catch((err) => {
                  console.error(err);
                  setError('Failed to load revenue data');
                })
                .finally(() => setLoading(false));
            }}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.datasets[0]?.data.map((value, index) => ({
            date: data.labels[index] || `Day ${index + 1}`,
            revenue: value,
          })) || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#B49162"
              strokeWidth={2}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

