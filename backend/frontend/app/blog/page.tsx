'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageHero } from '@/components/ui-custom/PageHero';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty/EmptyState';
import { Article } from '@/types';
import { getArticles } from '@/lib/api';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogFilters } from '@/components/blog/BlogFilters';
import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function BlogPage() {
  const { t, locale } = useLanguage();
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginatedResponse<Article> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Get featured article
  const featuredArticle = useMemo(() => {
    return allArticles.find((article) => article.is_featured) || allArticles[0] || null;
  }, [allArticles]);

  // Get regular articles (excluding featured)
  const regularArticles = useMemo(() => {
    return filteredArticles.filter((article) => article.id !== featuredArticle?.id);
  }, [filteredArticles, featuredArticle]);

  // Pagination
  const totalPages = Math.ceil(regularArticles.length / itemsPerPage);
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return regularArticles.slice(start, end);
  }, [regularArticles, currentPage, itemsPerPage]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getArticles({
          per_page: 100, // Fetch more to allow filtering
          locale: 'en',
        });
        setAllArticles(data.data || []);
        setFilteredArticles(data.data || []);
        setPagination(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setAllArticles([]);
        setFilteredArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleFilterChange = useCallback((filtered: Article[]) => {
    setFilteredArticles(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  return (
    <>
      {/* Hero Section */}
      <PageHero
        title={(() => {
          const translation = t('contact.blogTitle');
          if (translation === 'contact.blogTitle') {
            return locale === 'ar' ? 'المدونة والأخبار' : 'Blog & News';
          }
          return translation;
        })()}
        subtitle={(() => {
          const translation = t('contact.blogSubtitle');
          if (translation === 'contact.blogSubtitle') {
            return locale === 'ar' ? 'ابق على اطلاع بآخر أخبار ومعلومات العقارات' : 'Stay updated with the latest real estate news and insights';
          }
          return translation;
        })()}
        breadcrumbs={[{ label: locale === 'ar' ? 'المدونة' : 'Blog' }]}
      />

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <BlogFilters articles={allArticles} onFilterChange={handleFilterChange} />
          </aside>

          {/* Articles Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            {!loading && featuredArticle && (
              <FeaturedPost article={featuredArticle} className="mb-12" />
            )}

            {/* Articles Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-10 w-24" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : paginatedArticles.length === 0 ? (
              <EmptyState
                icon={FileText}
                title={(() => {
                  const translation = t('contact.noArticlesFound');
                  if (translation === 'contact.noArticlesFound') {
                    return locale === 'ar' ? 'لم يتم العثور على مقالات' : 'No Articles Found';
                  }
                  return translation;
                })()}
                description={(() => {
                  const translation = t('contact.noArticlesDescription');
                  if (translation === 'contact.noArticlesDescription') {
                    return locale === 'ar' ? 'حاول تعديل الفلاتر أو تحقق لاحقاً للحصول على مقالات جديدة' : 'Try adjusting your filters or check back later for new articles.';
                  }
                  return translation;
                })()}
              />
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-6 text-gray-600 dark:text-gray-400 text-start">
                  {(() => {
                    const translation = t('contact.showingArticles', { current: paginatedArticles.length, total: regularArticles.length });
                    if (translation === 'contact.showingArticles' || translation.includes('contact.showingArticles')) {
                      return locale === 'ar' ? `عرض ${paginatedArticles.length} من ${regularArticles.length} مقال` : `Showing ${paginatedArticles.length} of ${regularArticles.length} articles`;
                    }
                    return translation;
                  })()}
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {paginatedArticles.map((article) => (
                    <BlogCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={cn(locale === 'ar' && 'flex-row-reverse')}
                    >
                      <ChevronLeft className={cn("w-4 h-4", locale === 'ar' && 'rotate-180')} />
                      {(() => {
                        const translation = t('contact.previous');
                        if (translation === 'contact.previous') {
                          return locale === 'ar' ? 'السابق' : 'Previous';
                        }
                        return translation;
                      })()}
                    </Button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          // Show first page, last page, current page, and pages around current
                          return (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          );
                        })
                        .map((page, index, array) => {
                          // Add ellipsis
                          const showEllipsis = index > 0 && page - array[index - 1] > 1;
                          return (
                            <div key={page} className="flex items-center gap-2">
                              {showEllipsis && <span className="text-gray-400">...</span>}
                              <Button
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={cn(
                                  currentPage === page &&
                                  'bg-[#B49162] hover:bg-[#9A7A4F] text-white'
                                )}
                              >
                                {page}
                              </Button>
                            </div>
                          );
                        })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={cn(locale === 'ar' && 'flex-row-reverse')}
                    >
                      {(() => {
                        const translation = t('contact.next');
                        if (translation === 'contact.next') {
                          return locale === 'ar' ? 'التالي' : 'Next';
                        }
                        return translation;
                      })()}
                      <ChevronRight className={cn("w-4 h-4", locale === 'ar' && 'rotate-180')} />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

