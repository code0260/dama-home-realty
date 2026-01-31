'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface ResultsPerPageProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

const defaultOptions = [12, 24, 48, 96];

export function ResultsPerPage({
  value,
  onChange,
  options = defaultOptions,
  className,
}: ResultsPerPageProps) {
  const { t, locale } = useLanguage();

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

  return (
    <div className={cn('flex items-center gap-2', className, locale === 'ar' && 'flex-row-reverse')}>
      <Label htmlFor="per-page" className="text-sm text-gray-600 dark:text-gray-300 font-light whitespace-nowrap text-start">
        {getTranslation('contact.resultsPerPage', 'النتائج في الصفحة:', 'Results per page:')}
      </Label>
      <Select value={value.toString()} onValueChange={(val) => onChange(parseInt(val))}>
        <SelectTrigger id="per-page" className="w-20 h-9 border-gray-300 rounded-lg bg-white dark:bg-primary-800">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

