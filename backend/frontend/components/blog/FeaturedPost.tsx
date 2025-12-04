'use client';

import { Article } from '@/types';
import { BlogCard } from './BlogCard';
import { motion } from 'framer-motion';

interface FeaturedPostProps {
  article: Article | null;
  className?: string;
}

export function FeaturedPost({ article, className }: FeaturedPostProps) {
  if (!article) {
    return null;
  }

  return (
    <section className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4 flex items-center gap-3">
          <span className="text-[#B49162]">Featured</span>
          <span>Article</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Discover our top picks and most popular articles
        </p>
      </motion.div>
      <BlogCard article={article} featured={true} />
    </section>
  );
}

