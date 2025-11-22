'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sparkles,
  Star,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axios';

interface ServiceRatingsProps {
  service: {
    id: number;
    status: string;
    rating?: number;
    review?: string;
  };
  onRatingSubmitted?: () => void;
}

export function ServiceRatings({ service, onRatingSubmitted }: ServiceRatingsProps) {
  const [rating, setRating] = useState(service.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState(service.review || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(!!service.rating);

  const canRate = service.status === 'completed' || service.status === 'closed';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      setError('Please select a rating');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await axiosInstance.post(`/services/${service.id}/rate`, {
        rating,
        review,
      });
      setSubmitted(true);
      onRatingSubmitted?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!canRate) {
    return null;
  }

  if (submitted) {
    return (
      <Card className="border-gray-200 dark:border-primary-700">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            Service Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">
              Thank You for Your Feedback!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your rating has been submitted successfully.
            </p>
            {/* Display Submitted Rating */}
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-6 h-6',
                    i < rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  )}
                />
              ))}
            </div>
            {review && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-primary-800 rounded-lg text-left">
                <p className="text-sm text-gray-700 dark:text-gray-300">{review}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-primary-700">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-secondary" />
          Rate This Service
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const starValue = i + 1;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={cn(
                        'w-8 h-8 transition-colors',
                        starValue <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
                      )}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="ml-2 text-sm font-semibold text-primary dark:text-white">
                  {rating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Review */}
          <div className="space-y-2">
            <Label htmlFor="review">Write a Review (Optional)</Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience with this service..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !rating}
            className="w-full bg-secondary hover:bg-secondary/90 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Rating
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

