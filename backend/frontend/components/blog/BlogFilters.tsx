'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Filter,
  X,
  Search,
  Calendar,
  User,
  Tag,
  FolderOpen,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogFiltersProps {
  articles: Article[];
  onFilterChange: (filtered: Article[]) => void;
  className?: string;
}

export function BlogFilters({ articles, onFilterChange, className }: BlogFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  // Extract unique values from articles
  const categories = useMemo(() => {
    const cats = new Set<string>();
    articles.forEach((article) => {
      const articleCats = (article as any).categories || [];
      articleCats.forEach((cat: string) => cats.add(cat));
    });
    return Array.from(cats).sort();
  }, [articles]);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    articles.forEach((article) => {
      const articleTags = (article as any).tags || [];
      articleTags.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [articles]);

  const authors = useMemo(() => {
    const authorSet = new Set<string>();
    articles.forEach((article) => {
      if (article.author) {
        authorSet.add(article.author.name);
      }
    });
    return Array.from(authorSet).sort();
  }, [articles]);

  // Apply filters
  useEffect(() => {
    let filtered = [...articles];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.excerpt?.toLowerCase().includes(query) ||
          article.content?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((article) => {
        const articleCats = (article as any).categories || [];
        return articleCats.includes(selectedCategory);
      });
    }

    // Tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter((article) => {
        const articleTags = (article as any).tags || [];
        return articleTags.includes(selectedTag);
      });
    }

    // Author filter
    if (selectedAuthor !== 'all') {
      filtered = filtered.filter((article) => article.author?.name === selectedAuthor);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter((article) => {
        if (!article.published_at) return false;
        const publishDate = new Date(article.published_at);
        
        switch (dateFilter) {
          case 'today':
            return publishDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return publishDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return publishDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            return publishDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    onFilterChange(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles, searchQuery, selectedCategory, selectedTag, selectedAuthor, dateFilter]);

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedTag !== 'all' ? 1 : 0) +
    (selectedAuthor !== 'all' ? 1 : 0) +
    (dateFilter !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleClearAll = () => {
    setSelectedCategory('all');
    setSelectedTag('all');
    setSelectedAuthor('all');
    setDateFilter('all');
    setSearchQuery('');
  };

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="text-sm font-semibold text-primary dark:text-white mb-2 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-secondary" />
          Category
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tag Filter */}
      {tags.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-primary dark:text-white mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4 text-secondary" />
            Tag
          </label>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Author Filter */}
      {authors.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-primary dark:text-white mb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-secondary" />
            Author
          </label>
          <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Authors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              {authors.map((author) => (
                <SelectItem key={author} value={author}>
                  {author}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Date Filter */}
      <div>
        <label className="text-sm font-semibold text-primary dark:text-white mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-secondary" />
          Date
        </label>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear All */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={handleClearAll}
          className="w-full"
          size="sm"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card className="border-2 border-gray-200 dark:border-primary-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-secondary" />
                Filters
              </CardTitle>
              {activeFiltersCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {activeFiltersCount} active
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <FilterContent />
          </CardContent>
        </Card>
      </div>

      {/* Mobile Filters Sheet */}
      <div className="lg:hidden">
        <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="outline" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Articles</SheetTitle>
              <SheetDescription>
                Filter articles by category, tag, author, or date
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

