'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Article } from '@/types';
import { getArticleBySlug } from '@/lib/api';
import Image from 'next/image';
import { Calendar, Eye, Clock, FolderOpen, Tag, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { CommentsSection } from '@/components/blog/CommentsSection';
import { AuthorBio } from '@/components/blog/AuthorBio';
import { SubscribeForm } from '@/components/blog/SubscribeForm';

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticleBySlug(slug, 'en');
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="w-full h-96 mb-8" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Article Not Found</h1>
          <p className="text-gray-600">The article you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const imageUrl = article.image
    ? article.image.startsWith('http')
      ? article.image
      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${article.image}`
    : null;

  const readingTime = article.content ? calculateReadingTime(article.content) : 5;
  const categories = (article as any).categories || ['Real Estate'];
  const tags = (article as any).tags || [];

  return (
    <>
        {/* Article Header */}
        <section className="bg-linear-to-br from-primary via-primary/95 to-secondary/20 text-white py-16 dark:bg-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map((category: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      <FolderOpen className="w-3 h-3 mr-1" />
                      {category}
                    </Badge>
                  ))}
                </div>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 dark:text-white">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-200 dark:text-gray-300 mb-6">
                {article.author && (
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border-2 border-white/20">
                      <AvatarFallback className="bg-secondary/20 text-white">
                        {getInitials(article.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{article.author.name}</span>
                  </div>
                )}
                {article.published_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(article.published_at), 'MMMM dd, yyyy')}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {readingTime} min read
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {article.views || 0} views
                </div>
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Article Content */}
            <article className="lg:col-span-3 space-y-8">
              {/* Featured Image */}
              {imageUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden shadow-xl"
                >
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                    sizes="100vw"
                  />
                </motion.div>
              )}

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Share Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-8 border-t border-gray-200 dark:border-primary-700"
              >
                <ShareButtons
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={article.title}
                  description={article.excerpt}
                />
              </motion.div>

              {/* Author Bio */}
              {article.author && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <AuthorBio author={article.author} />
                </motion.div>
              )}

              {/* Comments Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <CommentsSection articleId={article.id} />
              </motion.div>

              {/* Related Posts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <RelatedPosts currentArticle={article} />
              </motion.div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              {/* Table of Contents */}
              {article.content && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="hidden lg:block"
                >
                  <TableOfContents content={article.content} />
                </motion.div>
              )}

              {/* Subscribe Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <SubscribeForm />
              </motion.div>
            </aside>
          </div>
        </section>
    </>
  );
}

