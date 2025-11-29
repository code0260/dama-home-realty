'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, User, LogOut, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
// ThemeToggle removed - Light mode only
import { Logo } from '@/components/ui-custom/Logo';
import { MobileDrawerNavigation } from '@/components/mobile/MobileNavigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'ar'>('en');
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties?type=sale', label: 'Buy' },
    { href: '/properties?type=rent', label: 'Rent' },
    { href: '/services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
  ];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Language switcher handler
  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setCurrentLang(lang);
    // Here you can implement actual language switching logic
    // For now, it's just a state change
  };

  // Navbar background: transparent on home page when not scrolled, solid on other pages
  const shouldBeTransparent = isHomePage && !isScrolled;
  
  // Navbar classes based on page and scroll state
  const navbarClasses = cn(
    'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
    shouldBeTransparent
      ? 'bg-transparent backdrop-blur-sm'
      : 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200/50',
    'supports-backdrop-filter:backdrop-blur-md'
  );

  // Text color: white on home page when transparent, dark/white on other pages or when scrolled
  const textColorClasses = shouldBeTransparent
    ? 'text-white'
    : 'text-primary';

  return (
    <motion.nav
      className={navbarClasses}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 md:h-24 items-center justify-between">
          {/* Left: Logo + Brand Text */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-opacity hover:opacity-90"
            aria-label="Dama Home Realty - Home"
          >
            <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/icon-192x192.png"
                alt="Dama Home Logo"
                fill
                className="object-contain drop-shadow-sm"
                priority
                sizes="(max-width: 768px) 48px, 56px"
              />
            </div>
            <span
              className={cn(
                'font-bold tracking-wide transition-colors whitespace-nowrap',
                textColorClasses,
                'text-lg md:text-xl lg:text-2xl'
              )}
            >
              Dama Home
            </span>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href.split('?')[0];
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative group text-sm font-medium transition-colors',
                    shouldBeTransparent
                      ? 'text-white'
                      : 'text-primary',
                    'hover:text-secondary'
                  )}
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Bronze underline hover effect */}
                  <span
                    className={cn(
                      'absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full'
                    )}
                  />
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'hidden sm:flex items-center gap-2 h-9 px-3',
                    textColorClasses,
                    'hover:bg-gray-100'
                  )}
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {currentLang.toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('en')}
                  className={cn(
                    'cursor-pointer',
                    currentLang === 'en' && 'bg-secondary/10 text-secondary'
                  )}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleLanguageChange('ar')}
                  className={cn(
                    'cursor-pointer',
                    currentLang === 'ar' && 'bg-secondary/10 text-secondary'
                  )}
                >
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* List Property Button */}
            <Button
              asChild
              className={cn(
                'hidden sm:flex rounded-full px-6 h-10',
                'bg-secondary hover:bg-secondary/90 text-white',
                'shadow-lg hover:shadow-xl transition-all duration-300',
                'hover:scale-105 active:scale-95',
                'font-semibold tracking-wide'
              )}
            >
              <Link href="/list-property">List Property</Link>
            </Button>

            {/* Auth Buttons / User Menu */}
            {!loading && (
              <>
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'hidden sm:flex items-center gap-2 h-9',
                          textColorClasses,
                          'hover:bg-gray-100'
                        )}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {user.name?.split(' ')[0] || 'Account'}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/portal" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          My Portal
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          await logout();
                        }}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'hidden sm:flex h-9',
                        textColorClasses,
                        'hover:bg-gray-100'
                      )}
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        'hidden md:flex rounded-full px-5 h-9',
                        shouldBeTransparent
                          ? 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
                          : 'bg-primary hover:bg-primary/90 text-white',
                        'transition-all duration-300'
                      )}
                    >
                      <Link href="/register">Register</Link>
                    </Button>
                  </>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'lg:hidden h-9 w-9 p-0',
                    textColorClasses,
                    'hover:bg-gray-100'
                  )}
                  aria-label="Open menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-3">
                    <Logo size="sm" showText={false} className="w-10 h-10" />
                    <span className="text-xl font-bold text-primary">
                      Dama Home
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-8 flex flex-col gap-6">
                  {/* Mobile Navigation Links */}
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => {
                      const isActive = pathname === link.href.split('?')[0];
                      return (
                        <SheetClose key={link.href} asChild>
                          <Link
                            href={link.href}
                            className={cn(
                              'text-base font-medium transition-colors py-2',
                              isActive
                                ? 'text-secondary border-l-4 border-secondary pl-4'
                                : 'text-gray-700 hover:text-secondary pl-4',
                              'hover:border-l-4 hover:border-secondary/50'
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>

                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    {/* List Property Button */}
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="w-full rounded-full bg-secondary hover:bg-secondary/90 text-white h-11 font-semibold"
                      >
                        <Link href="/list-property" onClick={() => setIsMobileMenuOpen(false)}>
                          List Property
                        </Link>
                      </Button>
                    </SheetClose>

                    {/* Language Switcher */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        Language
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant={currentLang === 'en' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleLanguageChange('en')}
                          className={cn(
                            'h-8 px-3',
                            currentLang === 'en' && 'bg-secondary hover:bg-secondary/90'
                          )}
                        >
                          EN
                        </Button>
                        <Button
                          variant={currentLang === 'ar' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleLanguageChange('ar')}
                          className={cn(
                            'h-8 px-3',
                            currentLang === 'ar' && 'bg-secondary hover:bg-secondary/90'
                          )}
                        >
                          AR
                        </Button>
                      </div>
                    </div>

                    {/* Auth Buttons */}
                    {!loading && (
                      <>
                        {isAuthenticated && user ? (
                          <div className="space-y-2">
                            <SheetClose asChild>
                              <Link
                                href="/portal"
                                className="block text-center text-sm font-medium text-gray-700 hover:text-secondary transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                My Portal
                              </Link>
                            </SheetClose>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={async () => {
                                setIsMobileMenuOpen(false);
                                await logout();
                              }}
                            >
                              <LogOut className="w-4 h-4 mr-2" />
                              Logout
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            <SheetClose asChild>
                              <Button
                                asChild
                                variant="outline"
                                className="w-full h-11"
                              >
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                  Login
                                </Link>
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                              <Button
                                asChild
                                className="w-full h-11 bg-primary hover:bg-primary/90 text-white"
                              >
                                <Link
                                  href="/register"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  Register
                                </Link>
                              </Button>
                            </SheetClose>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
