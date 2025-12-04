'use client';

import { motion } from 'framer-motion';
import { Article } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  Eye,
  Clock,
  ArrowRight,
  User,
  Tag,
  FolderOpen,
  Star,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface BlogCardProps {
  article: Article;
  featured?: boolean;
  className?: string;
}

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

export function BlogCard({ article, featured = false, className }: BlogCardProps) {
  const imageUrl = article.image
    ? article.image.startsWith('http')
      ? article.image
      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${article.image}`
    : null;

  const readingTime = article.content
    ? calculateReadingTime(article.content)
    : calculateReadingTime(article.excerpt || '');

  // Extract categories and tags from content or use defaults
  const categories = (article as any).categories || ['Real Estate'];
  const tags = (article as any).tags || [];

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn('group cursor-pointer', className)}
      >
        <Link href={`/blog/${article.slug}`}>
          <Card className="overflow-hidden border-2 border-[#B49162]/30 hover:border-[#B49162]/60 transition-all duration-300 hover:shadow-2xl h-full">
            <div className="relative h-96 w-full overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="100vw"
                  priority
                  quality={90}
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <Badge className="bg-[#B49162] text-white border-0 shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
                {categories.length > 0 && (
                  <Badge variant="outline" className="bg-white/90 text-[#0F172A] border-0">
                    <FolderOpen className="w-3 h-3 mr-1" />
                    {categories[0]}
                  </Badge>
                )}
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h2 className="text-3xl md:text-4xl font-bold mb-3 line-clamp-2 group-hover:text-[#B49162] transition-colors">
                  {article.title}
                </h2>
                <p className="text-lg text-gray-200 mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                
                {/* Meta Info */}
                <div className="flex items-center gap-6 text-sm text-gray-300">
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-[#B49162]/20 text-[#B49162] text-xs">
                          {getInitials(article.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{article.author.name}</span>
                    </div>
                  )}
                  {article.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(article.published_at), 'MMM dd, yyyy')}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {readingTime} min read
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {article.views || 0}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('group cursor-pointer h-full', className)}
    >
      <Link href={`/blog/${article.slug}`}>
        <Card className="h-full overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-[#B49162]/50 transition-all duration-300 hover:shadow-xl flex flex-col">
          {/* Image */}
          <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-primary-800">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                quality={85}
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <FileText className="w-16 h-16 text-primary/30" />
              </div>
            )}
            
            {/* Category Badge */}
            {categories.length > 0 && (
              <Badge
                variant="outline"
                className="absolute top-3 left-3 bg-white/90 dark:bg-primary-800/90 text-primary dark:text-white border-0"
              >
                <FolderOpen className="w-3 h-3 mr-1" />
                {categories[0]}
              </Badge>
            )}

            {/* Featured Badge */}
            {article.is_featured && (
              <Badge className="absolute top-3 right-3 bg-[#B49162] text-white border-0">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          <CardContent className="p-6 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-3 line-clamp-2 group-hover:text-[#B49162] transition-colors">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
              {article.excerpt}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.slice(0, 3).map((tag: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-gray-50 dark:bg-primary-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-primary-700">
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="bg-[#B49162]/10 text-[#B49162] text-xs">
                        {getInitials(article.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{article.author.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readingTime}m
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.views || 0}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#B49162] group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

