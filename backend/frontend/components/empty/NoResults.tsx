'use client';

import { Search, Filter } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { cn } from '@/lib/utils';

interface NoResultsProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export function NoResults({ 
  title,
  description,
  onReset 
}: NoResultsProps) {
  const { t, locale } = useLanguage();

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

  const defaultTitle = getTranslation('contact.noResultsFound', 'لم يتم العثور على نتائج', 'No Results Found');
  const defaultDescription = getTranslation('contact.tryAdjustingFilters', 'حاول تعديل الفلاتر أو مصطلحات البحث للعثور على ما تبحث عنه.', 'Try adjusting your filters or search terms to find what you\'re looking for.');

  return (
    <EmptyState
      icon={Search}
      title={title || defaultTitle}
      description={description || defaultDescription}
      action={onReset ? {
        label: getTranslation('contact.resetFilters', 'إعادة تعيين الفلاتر', 'Reset Filters'),
        onClick: onReset,
      } : undefined}
    >
      <div className={cn("mt-6 flex gap-2", locale === 'ar' && 'flex-row-reverse')}>
        <Button variant="outline" size="sm" className={cn(locale === 'ar' && 'flex-row-reverse')}>
          <Filter className={cn("w-4 h-4", locale === 'ar' ? 'ml-2' : 'mr-2')} />
          {getTranslation('contact.adjustFilters', 'تعديل الفلاتر', 'Adjust Filters')}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="/properties">{getTranslation('contact.browseAll', 'تصفح الكل', 'Browse All')}</a>
        </Button>
      </div>
    </EmptyState>
  );
}

