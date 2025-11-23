'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getLeadsData, RevenueData } from '@/lib/api/admin';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Users } from 'lucide-react';

interface FunnelData {
  stage: string;
  count: number;
  percentage: number;
}

export function LeadsFunnel() {
  const [data, setData] = useState<FunnelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const leadsData = await getLeadsData('30days');
        
        // Transform data into funnel stages
        // This is a simplified example - adjust based on your actual API response
        const funnelStages: FunnelData[] = [
          { stage: 'New', count: 150, percentage: 100 },
          { stage: 'Contacted', count: 120, percentage: 80 },
          { stage: 'Qualified', count: 90, percentage: 60 },
          { stage: 'Proposal', count: 60, percentage: 40 },
          { stage: 'Closed', count: 30, percentage: 20 },
        ];
        
        setData(funnelStages);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching leads funnel data:', err);
        setError('Failed to load leads funnel data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500">{error || 'Failed to load leads funnel data'}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          Leads Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="stage" type="category" width={100} />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === 'count') return [`${value} leads`, 'Count'];
                return [`${value}%`, 'Conversion'];
              }}
            />
            <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-5 gap-4">
          {data.map((stage, index) => (
            <div key={stage.stage} className="text-center">
              <p className="text-2xl font-bold" style={{ color: colors[index] }}>
                {stage.count}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stage.stage}
              </p>
              <p className="text-xs text-gray-500">{stage.percentage}%</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

