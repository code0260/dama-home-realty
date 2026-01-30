export type Locale = 'ar' | 'en';
export const defaultLocale: Locale = 'ar';

// Translation messages
import arMessages from '@/messages/ar.json';
import enMessages from '@/messages/en.json';

const messages = {
  ar: arMessages,
  en: enMessages,
};

// Get locale from cookie or default
export function getLocale(): Locale {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }
  
  const cookieLocale = document.cookie
    .split('; ')
    .find(row => row.startsWith('locale='))
    ?.split('=')[1] as Locale;
  
  if (cookieLocale && (cookieLocale === 'ar' || cookieLocale === 'en')) {
    return cookieLocale;
  }
  
  // Check localStorage
  const storedLocale = localStorage.getItem('locale') as Locale;
  if (storedLocale && (storedLocale === 'ar' || storedLocale === 'en')) {
    return storedLocale;
  }
  
  return defaultLocale;
}

// Set locale
export function setLocale(locale: Locale) {
  if (typeof window === 'undefined') return;
  
  // Set cookie
  document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
  
  // Set localStorage
  localStorage.setItem('locale', locale);
  
  // Update HTML dir attribute
  document.documentElement.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', locale);
  
  // Reload page to apply changes
  window.location.reload();
}

// Get translation
export function t(key: string, locale?: Locale): string {
  const currentLocale = locale || getLocale();
  const keys = key.split('.');
  let value: any = messages[currentLocale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
}

// Translation hook for React components
export function useTranslations(namespace?: string) {
  const locale = getLocale();
  
  return (key: string, params?: Record<string, string | number>) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    let translation = t(fullKey, locale);
    
    // Replace parameters
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }
    
    return translation;
  };
}

