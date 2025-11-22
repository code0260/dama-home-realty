'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Article } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogCard } from './BlogCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getArticles } from '@/lib/api';
import { Link2 } from 'lucide-react';

interface RelatedPostsProps {
  currentArticle: Article;
  className?: string;
}

export function RelatedPosts({ currentArticle, className }: RelatedPostsProps) {
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedArticles = async () => {
      try {
        setLoading(true);
        const data = await getArticles({ per_page: 6, locale: 'en' });
        const allArticles = data.data || [];
        
        // Filter and prioritize related articles
        const related = allArticles
          .filter((article) => article.id !== currentArticle.id)
          .slice(0, 3); // Show only 3 related articles
        
        setRelatedArticles(related);
      } catch (error) {
        console.error('Error fetching related articles:', error);
        setRelatedArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedArticles();
  }, [currentArticle.id]);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (relatedArticles.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary dark:text-white flex items-center gap-2">
          <Link2 className="w-6 h-6 text-secondary" />
          Related Articles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlogCard article={article} />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

