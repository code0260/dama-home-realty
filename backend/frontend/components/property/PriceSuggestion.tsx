'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, DollarSign, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axios';

interface PriceSuggestionProps {
  type: 'rent' | 'sale' | 'hotel';
  area: number;
  bedrooms: number;
  neighborhoodId?: string;
  onSuggestionChange?: (price: number) => void;
  className?: string;
}

interface MarketData {
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  pricePerSqm: number;
  trend: 'up' | 'down' | 'stable';
}

export function PriceSuggestion({
  type,
  area,
  bedrooms,
  neighborhoodId,
  onSuggestionChange,
  className,
}: PriceSuggestionProps) {
  const [suggestion, setSuggestion] = useState<number | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (area > 0 && bedrooms > 0) {
      fetchPriceSuggestion();
    } else {
      setSuggestion(null);
      setMarketData(null);
    }
  }, [type, area, bedrooms, neighborhoodId]);

  const fetchPriceSuggestion = async () => {
    setLoading(true);
    try {
      // Mock price calculation - replace with actual API call
      // This would typically come from market analysis or similar properties
      const pricePerSqm = type === 'rent' ? 10 : type === 'sale' ? 500 : 50; // USD per sqm
      const bedroomMultiplier = 1 + (bedrooms - 1) * 0.15; // 15% increase per additional bedroom
      const calculatedPrice = area * pricePerSqm * bedroomMultiplier;

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSuggestion(Math.round(calculatedPrice));
      
      // Mock market data
      setMarketData({
        averagePrice: calculatedPrice,
        minPrice: calculatedPrice * 0.8,
        maxPrice: calculatedPrice * 1.2,
        pricePerSqm,
        trend: 'up',
      });

      onSuggestionChange?.(calculatedPrice);
    } catch (error) {
      console.error('Error fetching price suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !suggestion || !marketData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('space-y-2', className)}
    >
      <Card className="border-2 border-secondary/20 bg-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg flex-shrink-0">
              <Lightbulb className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-primary dark:text-white">
                  Suggested Price
                </h3>
                <Badge variant="outline" className="bg-secondary/10 border-secondary text-secondary">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Market Analysis
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <DollarSign className="w-4 h-4 text-secondary" />
                  <span className="text-2xl font-bold text-secondary">
                    {suggestion.toLocaleString()} USD
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    <span>
                      Market Range: {marketData.minPrice.toLocaleString()} -{' '}
                      {marketData.maxPrice.toLocaleString()} USD
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    <span>
                      Price per sqm: {marketData.pricePerSqm.toLocaleString()} USD
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  Based on similar properties in this area. Price may vary based on condition,
                  amenities, and other factors.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

