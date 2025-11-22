/**
 * Mobile optimization utilities for Dama Home Realty
 * Provides helper functions for mobile UX, touch targets, and mobile-specific features
 */

/**
 * Minimum touch target size (WCAG 2.1 AA: 44x44 pixels)
 */
export const MIN_TOUCH_TARGET_SIZE = 44;

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if device is iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Check if device is Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android/.test(navigator.userAgent);
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Check if PWA is installable
 */
export function isPWAInstallable(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if already installed
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return false;
  }
  
  // Check for beforeinstallprompt event support
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * Check if PWA is installed (standalone mode)
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://');
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  
  return navigator.onLine;
}

/**
 * Get viewport size
 */
export function getViewportSize(): { width: number; height: number } {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Get safe area insets (for devices with notches)
 */
export function getSafeAreaInsets(): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  if (typeof window === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0', 10),
    right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0', 10),
    left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0', 10),
  };
}

/**
 * Prevent zoom on double tap (iOS)
 */
export function preventDoubleTapZoom(element: HTMLElement): () => void {
  let lastTouchEnd = 0;
  
  const handleTouchEnd = (event: TouchEvent) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  };
  
  element.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  return () => {
    element.removeEventListener('touchend', handleTouchEnd);
  };
}

/**
 * Lock screen orientation (for full-screen mobile experience)
 */
export async function lockOrientation(
  orientation: 'portrait' | 'landscape' | 'any' = 'portrait'
): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const screen = (window.screen as any).orientation;
    if (screen && screen.lock) {
      await screen.lock(orientation);
      return true;
    }
  } catch (error) {
    console.warn('Failed to lock orientation:', error);
  }
  
  return false;
}

/**
 * Unlock screen orientation
 */
export async function unlockOrientation(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const screen = (window.screen as any).orientation;
    if (screen && screen.unlock) {
      await screen.unlock();
      return true;
    }
  } catch (error) {
    console.warn('Failed to unlock orientation:', error);
  }
  
  return false;
}

/**
 * Vibrate device (haptic feedback)
 */
export function vibrate(pattern: number | number[]): boolean {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return false;
  }
  
  try {
    return navigator.vibrate(pattern);
  } catch (error) {
    console.warn('Failed to vibrate:', error);
    return false;
  }
}

/**
 * Show mobile keyboard (focus input)
 */
export function showKeyboard(element: HTMLElement): void {
  if (!isMobile()) return;
  
  element.focus();
  
  // For iOS, trigger a click event to show keyboard
  if (isIOS()) {
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    element.dispatchEvent(clickEvent);
  }
}

/**
 * Hide mobile keyboard (blur input)
 */
export function hideKeyboard(element: HTMLElement): void {
  element.blur();
  
  // For iOS, remove focus from active element
  if (isIOS() && document.activeElement) {
    (document.activeElement as HTMLElement).blur();
  }
}

/**
 * Scroll to element with mobile-friendly behavior
 */
export function scrollToElement(
  element: HTMLElement,
  options: ScrollIntoViewOptions = {}
): void {
  const defaultOptions: ScrollIntoViewOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  };
  
  element.scrollIntoView({ ...defaultOptions, ...options });
  
  // For mobile, account for fixed headers
  if (isMobile()) {
    const headerHeight = 80; // Adjust based on your header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

/**
 * Prevent body scroll (for modals on mobile)
 */
export function preventBodyScroll(): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const body = document.body;
  const scrollY = window.scrollY;
  
  body.style.position = 'fixed';
  body.style.top = `-${scrollY}px`;
  body.style.width = '100%';
  body.style.overflow = 'hidden';
  
  return () => {
    body.style.position = '';
    body.style.top = '';
    body.style.width = '';
    body.style.overflow = '';
    window.scrollTo(0, scrollY);
  };
}

/**
 * Restore body scroll (for modals on mobile)
 */
export function restoreBodyScroll(scrollY: number = 0): void {
  if (typeof window === 'undefined') return;
  
  const body = document.body;
  body.style.position = '';
  body.style.top = '';
  body.style.width = '';
  body.style.overflow = '';
  window.scrollTo(0, scrollY);
}

/**
 * Format phone number for mobile display
 */
export function formatPhoneNumber(phone: string, country: string = 'SY'): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format based on country
  if (country === 'SY' && digits.length === 9) {
    return `+963 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  return phone;
}

/**
 * Get mobile-friendly date format
 */
export function formatMobileDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return 'Today';
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
    });
  }
}

