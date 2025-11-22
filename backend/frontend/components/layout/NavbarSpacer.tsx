'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function NavbarSpacer() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Don't add spacer on home page (Hero section is full-screen)
  if (isHomePage) {
    return null;
  }

  // Add spacer for all other pages to prevent navbar overlap
  // Match navbar height: ~80px (h-20) on mobile, ~96px (h-24) on desktop
  // This spacer ensures content starts below the fixed navbar
  return (
    <div 
      className={cn(
        'w-full transition-all duration-300',
        'h-20 md:h-24', // Match navbar height exactly (80px mobile, 96px desktop)
        'bg-transparent', // Transparent spacer - matches body background
        'pointer-events-none' // Allow clicks to pass through
      )}
      aria-hidden="true"
    />
  );
}

