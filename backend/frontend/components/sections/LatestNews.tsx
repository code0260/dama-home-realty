'use client';

import { useEffect, useState } from 'react';
import { Article } from '@/types';
import { getArticles } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

// Calculate reading time based on content length
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export function LatestNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await getArticles({
          per_page: 3,
          locale: 'en',
        });
        setArticles(response.data || []);
      } catch (error: any) {
        console.error('Error fetching articles:', error);
        // Log network errors with helpful message
        if (error.isNetworkError || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          console.warn('Backend server may not be running. Please start Laravel server with: php artisan serve');
        }
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full h-64" />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link 
          key={article.id} 
          href={`/blog/${article.slug}`}
          className="group"
        >
          <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-secondary/30">
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2 hover:text-secondary transition-colors">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              
              {/* Author & Meta Info */}
              <div className="space-y-2 mb-4">
                {article.author && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-medium">{article.author.name}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {article.published_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(article.published_at), 'MMM dd, yyyy')}
                    </span>
                  )}
                  
                  {/* Reading Time */}
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {calculateReadingTime(article.content || article.excerpt)} min read
                  </span>
                  
                  {/* Views */}
                  {article.views > 0 && (
                    <span className="text-gray-400">
                      {article.views} views
                    </span>
                  )}
                </div>
              </div>
              
              {/* Read More Arrow */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-secondary">
                  Read More
                </span>
                <ArrowRight className="w-4 h-4 text-secondary group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

