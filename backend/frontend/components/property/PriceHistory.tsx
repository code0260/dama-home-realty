'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Property } from '@/types';
import { Card } from '@/components/ui/card';

interface PriceHistoryProps {
  property: Property;
  priceHistory?: Array<{ date: string; price: number }>;
}

export function PriceHistory({ property, priceHistory }: PriceHistoryProps) {
  // Mock data if no history provided
  const data = priceHistory || [
    { date: '2024-01', price: property.price * 1.1 },
    { date: '2024-02', price: property.price * 1.05 },
    { date: '2024-03', price: property.price },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: property.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const currentPrice = property.price;
  const previousPrice = data.length > 1 ? data[data.length - 2].price : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice > 0 ? ((priceChange / previousPrice) * 100).toFixed(1) : '0';

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-primary dark:text-white mb-2">Price History</h3>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Current Price</p>
            <p className="text-2xl font-bold text-secondary">{formatPrice(currentPrice)}</p>
          </div>
          {data.length > 1 && (
            <div className="flex items-center gap-2">
              {priceChange >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
              <span
                className={`text-sm font-semibold ${
                  priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {priceChange >= 0 ? '+' : ''}
                {priceChangePercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => formatPrice(value)}
          />
          <Tooltip
            formatter={(value: number) => formatPrice(value)}
            labelStyle={{ color: '#1f2937' }}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#B49162"
            strokeWidth={2}
            dot={{ fill: '#B49162', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

