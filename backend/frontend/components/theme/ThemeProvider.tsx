'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Force light mode only - no dark mode support
  const [theme, setTheme] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Always use light theme - ignore localStorage
    setTheme('light');
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    // Remove dark class if exists, always add light
    root.classList.remove('dark');
    root.classList.add('light');
    
    setResolvedTheme('light');
    // Save light theme to localStorage
    localStorage.setItem('theme', 'light');
  }, [mounted]);

  // Always provide context, even before mount, to prevent errors
  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

