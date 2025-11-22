'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ServiceReview } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ServiceReviewsProps {
  reviews: ServiceReview[];
  serviceTitle?: string;
  className?: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export function ServiceReviews({ reviews, serviceTitle, className }: ServiceReviewsProps) {
  const [displayedReviews, setDisplayedReviews] = useState<ServiceReview[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      setDisplayedReviews(showAll ? reviews : reviews.slice(0, 6));
    }
  }, [reviews, showAll]);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Calculate average rating
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingCount = reviews.length;

  return (
    <section className={cn('py-12 md:py-16 bg-gray-50 dark:bg-primary-900/30', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="w-8 h-8 text-secondary" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white">
              Customer Reviews
            </h2>
          </div>
          {serviceTitle && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              What our clients say about {serviceTitle}
            </p>
          )}

          {/* Average Rating */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-6 h-6',
                      star <= Math.round(averageRating)
                        ? 'fill-secondary text-secondary'
                        : 'fill-gray-200 text-gray-200 dark:fill-primary-700 dark:text-primary-700'
                    )}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-primary dark:text-white">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <div className="h-8 w-px bg-gray-300 dark:bg-primary-700" />
            <span className="text-lg text-gray-600 dark:text-gray-400">
              {ratingCount} {ratingCount === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-12 h-12">
                      {review.photo ? (
                        <AvatarImage
                          src={review.photo}
                          alt={review.client_name}
                        />
                      ) : (
                        <AvatarFallback className="bg-secondary/10 text-secondary font-semibold">
                          {getInitials(review.client_name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-primary dark:text-white mb-1">
                        {review.client_name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {/* Star Rating */}
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'w-4 h-4',
                                star <= review.rating
                                  ? 'fill-secondary text-secondary'
                                  : 'fill-gray-200 text-gray-200 dark:fill-primary-700 dark:text-primary-700'
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {reviews.length > 6 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-secondary hover:text-secondary/80 font-semibold underline transition-colors"
            >
              {showAll ? 'Show Less' : `Show All ${reviews.length} Reviews`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

