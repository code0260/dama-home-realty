'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Search, Calendar, User, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { preventBodyScroll } from '@/lib/mobile';
import { useSwipe } from '@/hooks/useSwipe';

interface MobileNavigationProps {
  className?: string;
}

/**
 * Mobile-optimized bottom navigation bar
 */
export function MobileNavigation({ className }: MobileNavigationProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/properties', label: 'Properties', icon: Search },
    { href: '/services', label: 'Services', icon: Calendar },
    { href: isAuthenticated ? '/portal' : '/login', label: 'Account', icon: User },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-primary-900 border-t border-gray-200 dark:border-gray-800',
        'safe-area-bottom', // For devices with home indicator
        className
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full',
                'min-w-[44px] min-h-[44px]', // WCAG touch target size
                'transition-colors duration-200',
                isActive
                  ? 'text-secondary dark:text-secondary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * Mobile drawer navigation (slide from side)
 */
export function MobileDrawerNavigation({ className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      return preventBodyScroll();
    }
  }, [isOpen]);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/properties?type=sale', label: 'Buy', icon: Search },
    { href: '/properties?type=rent', label: 'Rent', icon: Search },
    { href: '/services', label: 'Services', icon: Calendar },
    { href: '/blog', label: 'Blog', icon: Home },
  ];

  // Swipe to close
  const { elementRef } = useSwipe({
    onSwipeLeft: () => setIsOpen(false),
  }, { threshold: 50 });

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden min-w-[44px] min-h-[44px]" // Touch target size
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 p-0"
        >
          <div
            ref={elementRef as any}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-primary dark:text-white">
                Menu
              </h2>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href ||
                    (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]));

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg',
                          'min-h-[44px]', // Touch target size
                          'transition-colors duration-200',
                          isActive
                            ? 'bg-secondary/10 text-secondary dark:text-secondary'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary-800'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    href="/portal"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary-800 min-h-[44px]"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">My Account</span>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full justify-start min-h-[44px]"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-secondary text-white hover:bg-secondary/90 min-h-[44px] font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-primary-800 min-h-[44px] font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

