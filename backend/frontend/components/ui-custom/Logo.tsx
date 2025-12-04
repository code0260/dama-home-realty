'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  textSize?: 'sm' | 'md' | 'lg' | 'xl';
  textPosition?: 'side' | 'bottom';
  variant?: 'default' | 'navbar'; // New prop for navbar-specific styling
}

export function Logo({ 
  className, 
  showText = true, 
  size = 'md', 
  href = '/', 
  textSize, 
  textPosition = 'side',
  variant = 'default'
}: LogoProps) {
  // Icon sizes - fixed and crisp
  const iconSizeClasses = {
    sm: 'w-10 h-10 md:w-12 md:h-12',
    md: 'w-12 h-12 md:w-14 md:h-14',
    lg: 'w-14 h-14 md:w-16 md:h-16',
  };

  // Text sizes - scale proportionally with responsive breakpoints
  const textSizeClasses = {
    sm: 'text-xs sm:text-sm md:text-base',
    md: 'text-sm sm:text-base md:text-lg lg:text-xl',
    lg: 'text-base sm:text-lg md:text-xl lg:text-2xl',
    xl: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
  };

  // Default text size based on position and variant
  const finalTextSize = textSize || (variant === 'navbar' ? 'lg' : textPosition === 'bottom' ? 'sm' : 'md');

  // Determine layout direction
  const isHorizontal = textPosition === 'side';

  return (
    <Link 
      href={href} 
      className={cn(
        'group transition-all duration-300',
        isHorizontal ? 'flex items-center gap-3 md:gap-4' : 'flex flex-col items-center gap-2',
        className
      )}
      aria-label="Dama Home Realty - Home"
    >
      {/* Icon Container */}
      <div className={cn(
        'relative shrink-0 transition-transform duration-300',
        'group-hover:scale-105 group-active:scale-95',
        iconSizeClasses[size]
      )}>
        <Image
          src="/icon-192x192.png"
          alt="Dama Home Realty Logo"
          fill
          className="object-contain drop-shadow-lg"
          priority
          sizes="(max-width: 768px) 40px, 48px"
        />
      </div>

      {/* Text Container - Hide on very small screens if navbar variant */}
      {showText && (
        <span className={cn(
          'font-extrabold tracking-tight leading-tight',
          'transition-colors duration-300 whitespace-nowrap',
          textSizeClasses[finalTextSize],
          // Hide text on mobile for navbar variant, show on sm and up
          variant === 'navbar' && 'hidden sm:inline-block',
          // Color styling: "Dama" in brand color, "Home" in dark
          variant === 'navbar' 
            ? '[&_.brand-primary]:text-[#B49162] [&_.brand-secondary]:text-[#0F172A] dark:[&_.brand-secondary]:text-white'
            : '[&_.brand-primary]:text-[#B49162] [&_.brand-secondary]:text-[#0F172A] dark:[&_.brand-secondary]:text-white'
        )}>
          <span className="brand-primary">Dama</span>
          <span className="brand-secondary"> Home</span>
        </span>
      )}
    </Link>
  );
}
