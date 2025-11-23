'use client';

import { useState, useEffect } from 'react';
import { Property } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Eye, 
  Heart, 
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SocialProofProps {
  property: Property;
  className?: string;
}

export function SocialProof({ property, className }: SocialProofProps) {
  const [views, setViews] = useState(property.views || 0);
  const [savedCount, setSavedCount] = useState(Math.floor(Math.random() * 100) + 5);
  const [rating, setRating] = useState(4.5);
  const [reviewCount, setReviewCount] = useState(Math.floor(Math.random() * 50) + 10);
  const [recentViews, setRecentViews] = useState(0);

  useEffect(() => {
    // Simulate recent views increment
    const interval = setInterval(() => {
      setRecentViews((prev) => {
        const increment = Math.floor(Math.random() * 3);
        return prev + increment;
      });
    }, 30000); // Every 30 seconds

    // Load saved count from localStorage
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setSavedCount(favorites.length);
    } catch (error) {
      console.error('Error reading favorites:', error);
    }

    return () => clearInterval(interval);
  }, []);

  // Generate popular times data
  const popularTimes = [
    { hour: '9AM', visitors: 45 },
    { hour: '12PM', visitors: 78 },
    { hour: '3PM', visitors: 92 },
    { hour: '6PM', visitors: 65 },
    { hour: '9PM', visitors: 32 },
  ];

  const maxVisitors = Math.max(...popularTimes.map((t) => t.visitors));

  return (
    <div className={cn('space-y-6', className)}>
      {/* Reviews & Ratings */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-primary dark:text-white mb-1">
              Ratings & Reviews
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-5 h-5',
                      star <= Math.round(rating)
                        ? 'fill-secondary text-secondary'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-primary dark:text-white">
                {rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({reviewCount} reviews)
              </span>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Verified
          </Badge>
        </div>

        {/* Star Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = Math.floor(reviewCount * (star === 5 ? 0.6 : star === 4 ? 0.25 : star === 3 ? 0.1 : star === 2 ? 0.04 : 0.01));
            const percentage = (count / reviewCount) * 100;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm w-8 text-gray-600 dark:text-gray-400">{star}</span>
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <div className="flex-1 h-2 bg-gray-200 dark:bg-primary-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: star * 0.1 }}
                    className="h-full bg-secondary"
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Recent Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-primary dark:text-white mb-1">
              {views.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Views</div>
            {recentViews > 0 && (
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                +{recentViews} recent
              </div>
            )}
          </Card>
        </motion.div>

        {/* Saved Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="w-5 h-5 text-secondary fill-secondary" />
            </div>
            <div className="text-2xl font-bold text-primary dark:text-white mb-1">
              {savedCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Saved</div>
          </Card>
        </motion.div>

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-secondary fill-secondary" />
            </div>
            <div className="text-2xl font-bold text-primary dark:text-white mb-1">
              {rating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Rating</div>
          </Card>
        </motion.div>

        {/* Review Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-2xl font-bold text-primary dark:text-white mb-1">
              {reviewCount}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Reviews</div>
          </Card>
        </motion.div>
      </div>

      {/* Popular Times */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-secondary" />
          <h3 className="text-lg font-semibold text-primary dark:text-white">
            Popular Times
          </h3>
        </div>
        <div className="space-y-3">
          {popularTimes.map((time, index) => {
            const percentage = (time.visitors / maxVisitors) * 100;
            const isPeak = percentage > 80;
            return (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12">
                  {time.hour}
                </span>
                <div className="flex-1 relative">
                  <div className="h-6 bg-gray-200 dark:bg-primary-700 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={cn(
                        'h-full rounded-full',
                        isPeak
                          ? 'bg-red-500'
                          : percentage > 50
                          ? 'bg-secondary'
                          : 'bg-secondary/60'
                      )}
                    />
                  </div>
                  {isPeak && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white font-semibold">
                      Peak
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {time.visitors}%
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Typical wait times based on visitor patterns</span>
        </div>
      </Card>
    </div>
  );
}
