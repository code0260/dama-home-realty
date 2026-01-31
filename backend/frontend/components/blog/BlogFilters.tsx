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
import { useLanguage } from '@/components/providers/LanguageProvider';

interface BlogFiltersProps {
  articles: Article[];
  onFilterChange: (filtered: Article[]) => void;
  className?: string;
}

export function BlogFilters({ articles, onFilterChange, className }: BlogFiltersProps) {
  const { t, locale } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

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
        <Search className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400", locale === 'ar' ? 'right-3' : 'left-3')} />
        <Input
          placeholder={getTranslation('contact.searchArticles', 'بحث في المقالات...', 'Search articles...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(locale === 'ar' ? 'pr-10' : 'pl-10', 'text-start')}
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Category Filter */}
      <div>
        <label className="text-sm font-semibold text-[#0F172A] dark:text-white mb-2 flex items-center gap-2 text-start">
          <FolderOpen className="w-4 h-4 text-[#B49162]" />
          {getTranslation('contact.category', 'الفئة', 'Category')}
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full text-start">
            <SelectValue placeholder={getTranslation('contact.allCategories', 'جميع الفئات', 'All Categories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{getTranslation('contact.allCategories', 'جميع الفئات', 'All Categories')}</SelectItem>
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
          <label className="text-sm font-semibold text-[#0F172A] dark:text-white mb-2 flex items-center gap-2 text-start">
            <Tag className="w-4 h-4 text-[#B49162]" />
            {getTranslation('contact.tag', 'الوسم', 'Tag')}
          </label>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-full text-start">
              <SelectValue placeholder={getTranslation('contact.allTags', 'جميع الأوسمة', 'All Tags')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{getTranslation('contact.allTags', 'جميع الأوسمة', 'All Tags')}</SelectItem>
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
          <label className="text-sm font-semibold text-[#0F172A] dark:text-white mb-2 flex items-center gap-2 text-start">
            <User className="w-4 h-4 text-[#B49162]" />
            {getTranslation('contact.author', 'المؤلف', 'Author')}
          </label>
          <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
            <SelectTrigger className="w-full text-start">
              <SelectValue placeholder={getTranslation('contact.allAuthors', 'جميع المؤلفين', 'All Authors')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{getTranslation('contact.allAuthors', 'جميع المؤلفين', 'All Authors')}</SelectItem>
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
        <label className="text-sm font-semibold text-[#0F172A] dark:text-white mb-2 flex items-center gap-2 text-start">
          <Calendar className="w-4 h-4 text-[#B49162]" />
          {getTranslation('contact.date', 'التاريخ', 'Date')}
        </label>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full text-start">
            <SelectValue placeholder={getTranslation('contact.allTime', 'جميع الأوقات', 'All Time')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{getTranslation('contact.allTime', 'جميع الأوقات', 'All Time')}</SelectItem>
            <SelectItem value="today">{getTranslation('contact.today', 'اليوم', 'Today')}</SelectItem>
            <SelectItem value="week">{getTranslation('contact.thisWeek', 'هذا الأسبوع', 'This Week')}</SelectItem>
            <SelectItem value="month">{getTranslation('contact.thisMonth', 'هذا الشهر', 'This Month')}</SelectItem>
            <SelectItem value="year">{getTranslation('contact.thisYear', 'هذا العام', 'This Year')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear All */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={handleClearAll}
          className={cn("w-full", locale === 'ar' && 'flex-row-reverse')}
          size="sm"
        >
          <X className={cn("w-4 h-4", locale === 'ar' ? 'ml-2' : 'mr-2')} />
          {getTranslation('contact.clearAll', 'مسح الكل', 'Clear All')} ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <Card className="border-2 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2 text-start">
                <Filter className="w-5 h-5 text-[#B49162]" />
                {getTranslation('contact.filters', 'الفلاتر', 'Filters')}
              </CardTitle>
              {activeFiltersCount > 0 && (
                <Badge variant="outline" className="text-xs">
                  {activeFiltersCount} {getTranslation('contact.active', 'نشط', 'active')}
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
            <Button variant="outline" className={cn("w-full", locale === 'ar' ? 'justify-end flex-row-reverse' : 'justify-start')}>
              <Filter className={cn("w-4 h-4", locale === 'ar' ? 'ml-2' : 'mr-2')} />
              {getTranslation('contact.filters', 'الفلاتر', 'Filters')}
              {activeFiltersCount > 0 && (
                <Badge variant="outline" className={locale === 'ar' ? 'mr-2' : 'ml-2'}>
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side={locale === 'ar' ? 'right' : 'left'} className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-start">{getTranslation('contact.filterArticles', 'تصفية المقالات', 'Filter Articles')}</SheetTitle>
              <SheetDescription className="text-start">
                {getTranslation('contact.filterArticlesDescription', 'تصفية المقالات حسب الفئة أو الوسم أو المؤلف أو التاريخ', 'Filter articles by category, tag, author, or date')}
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

