'use client';

import { useState, useEffect } from 'react';
import { getLocale, setLocale, type Locale } from '@/lib/i18n';
import { useTranslations as useI18nTranslations } from '@/lib/i18n';

export function useTranslation(namespace?: string) {
  const [locale, setCurrentLocale] = useState<Locale>(getLocale());
  const t = useI18nTranslations(namespace);
  
  useEffect(() => {
    // Update locale on mount
    const currentLocale = getLocale();
    setCurrentLocale(currentLocale);
    
    // Set HTML attributes
    document.documentElement.setAttribute('dir', currentLocale === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', currentLocale);
  }, []);
  
  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setCurrentLocale(newLocale);
  };
  
  return { t, locale, changeLocale };
}

