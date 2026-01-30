'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getLocale, setLocale, type Locale } from '@/lib/i18n';
import arMessages from '@/messages/ar.json';
import enMessages from '@/messages/en.json';

interface LanguageContextType {
  locale: Locale;
  changeLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with default locale (Arabic) for SSR
  const [locale, setCurrentLocale] = useState<Locale>(() => {
    // Try to get locale on initial render (client-side only)
    if (typeof window !== 'undefined') {
      try {
        return getLocale();
      } catch {
        return 'ar';
      }
    }
    return 'ar';
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Get locale from cookie or default to Arabic
    try {
      const currentLocale = getLocale();
      setCurrentLocale(currentLocale);

      // Set HTML attributes
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('dir', currentLocale === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', currentLocale);
      }
    } catch (error) {
      console.error('Error initializing locale:', error);
      setCurrentLocale('ar');
    } finally {
      setMounted(true);
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setCurrentLocale(newLocale);
    // Update HTML attributes
    document.documentElement.setAttribute('dir', newLocale === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    try {
      // Always use current locale (default to 'ar' if not mounted yet)
      const currentLocale = locale || 'ar';
      const messages = currentLocale === 'ar' ? arMessages : enMessages;

      const keys = key.split('.');
      let value: any = messages;

      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }

      if (!value || typeof value !== 'string') {
        // If translation not found, return key (only log in dev)
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
          console.warn(`Translation key not found: ${key}`);
        }
        return key;
      }

      // Replace parameters
      if (params) {
        Object.entries(params).forEach(([param, val]) => {
          value = value.replace(`{${param}}`, String(val));
        });
      }

      return value;
    } catch (error) {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.error('Translation error:', error);
      }
      return key;
    }
  };

  // Always provide context, even during SSR
  return (
    <LanguageContext.Provider value={{ locale, changeLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

