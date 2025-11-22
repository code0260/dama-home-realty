/**
 * Accessibility utilities for Dama Home Realty
 * Provides helper functions for ARIA labels, keyboard navigation, and accessibility features
 */

/**
 * Generate ARIA label from text
 */
export function generateAriaLabel(text: string, context?: string): string {
  if (context) {
    return `${text} ${context}`;
  }
  return text;
}

/**
 * Generate unique ID for ARIA attributes
 */
export function generateAriaId(prefix: string = 'aria'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get ARIA label for button based on action
 */
export function getButtonAriaLabel(
  action: string,
  itemName?: string,
  context?: string
): string {
  const labels: Record<string, string> = {
    close: 'Close',
    open: 'Open',
    submit: 'Submit',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    next: 'Next',
    previous: 'Previous',
    expand: 'Expand',
    collapse: 'Collapse',
    menu: 'Menu',
    share: 'Share',
    favorite: 'Add to favorites',
    unfavorite: 'Remove from favorites',
    compare: 'Compare',
    view: 'View',
    download: 'Download',
    print: 'Print',
    copy: 'Copy',
    back: 'Back',
    forward: 'Forward',
  };

  const baseLabel = labels[action.toLowerCase()] || action;
  
  if (itemName) {
    return `${baseLabel} ${itemName}`;
  }
  
  if (context) {
    return `${baseLabel} ${context}`;
  }
  
  return baseLabel;
}

/**
 * Get ARIA label for navigation items
 */
export function getNavigationAriaLabel(
  item: string,
  current?: boolean,
  expanded?: boolean
): string {
  let label = item;
  
  if (current) {
    label += ', current page';
  }
  
  if (expanded !== undefined) {
    label += expanded ? ', expanded' : ', collapsed';
  }
  
  return label;
}

/**
 * Get ARIA live region announcement
 */
export function getAriaLiveAnnouncement(
  message: string,
  priority: 'polite' | 'assertive' | 'off' = 'polite'
): string {
  return message;
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex === -1) return false;
  
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');
  
  return element.matches(focusableSelectors);
}

/**
 * Get all focusable elements within container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');
  
  return Array.from(container.querySelectorAll<HTMLElement>(selectors));
}

/**
 * Trap focus within container
 */
export function trapFocus(
  container: HTMLElement,
  firstFocusable?: HTMLElement,
  lastFocusable?: HTMLElement
): () => void {
  const focusableElements = getFocusableElements(container);
  
  const first = firstFocusable || focusableElements[0];
  const last = lastFocusable || focusableElements[focusableElements.length - 1];
  
  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  };
  
  container.addEventListener('keydown', handleTab);
  
  return () => {
    container.removeEventListener('keydown', handleTab);
  };
}

/**
 * Calculate color contrast ratio
 */
export function calculateContrastRatio(
  foreground: string,
  background: string
): number {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((val) => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 1;

  const l1 = getLuminance(fg.r, fg.g, fg.b);
  const l2 = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color contrast meets WCAG standards
 */
export function meetsContrastStandards(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Get accessible color for text on background
 */
export function getAccessibleTextColor(
  background: string,
  light: string = '#FFFFFF',
  dark: string = '#000000'
): string {
  const lightContrast = calculateContrastRatio(light, background);
  const darkContrast = calculateContrastRatio(dark, background);
  
  return lightContrast > darkContrast ? light : dark;
}

/**
 * Announce message to screen reader
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' | 'off' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Get keyboard shortcuts description
 */
export function getKeyboardShortcutsDescription(
  shortcuts: Array<{ key: string; description: string }>
): string {
  return shortcuts
    .map((shortcut) => `${shortcut.key}: ${shortcut.description}`)
    .join(', ');
}

/**
 * Format time for screen reader
 */
export function formatTimeForScreenReader(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}

/**
 * Generate heading level based on nesting
 */
export function getHeadingLevel(baseLevel: number = 1, nesting: number = 0): number {
  const level = baseLevel + nesting;
  return Math.min(Math.max(level, 1), 6);
}

/**
 * Generate landmark roles
 */
export const landmarkRoles = {
  banner: 'banner',
  navigation: 'navigation',
  main: 'main',
  complementary: 'complementary',
  contentinfo: 'contentinfo',
  search: 'search',
  form: 'form',
  article: 'article',
  region: 'region',
} as const;

/**
 * Generate common ARIA attributes
 */
export function generateAriaAttributes(options: {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  hidden?: boolean;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  controls?: string;
  owns?: string;
  required?: boolean;
  invalid?: boolean;
}): Record<string, string | boolean> {
  const attrs: Record<string, string | boolean> = {};

  if (options.label) attrs['aria-label'] = options.label;
  if (options.labelledBy) attrs['aria-labelledby'] = options.labelledBy;
  if (options.describedBy) attrs['aria-describedby'] = options.describedBy;
  if (options.expanded !== undefined) attrs['aria-expanded'] = options.expanded;
  if (options.hidden !== undefined) attrs['aria-hidden'] = options.hidden;
  if (options.live) attrs['aria-live'] = options.live;
  if (options.atomic !== undefined) attrs['aria-atomic'] = options.atomic;
  if (options.current !== undefined) {
    attrs['aria-current'] = options.current === true ? 'page' : options.current;
  }
  if (options.controls) attrs['aria-controls'] = options.controls;
  if (options.owns) attrs['aria-owns'] = options.owns;
  if (options.required !== undefined) attrs['aria-required'] = options.required;
  if (options.invalid !== undefined) attrs['aria-invalid'] = options.invalid;

  return attrs;
}

