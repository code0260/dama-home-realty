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
  textPosition?: 'side' | 'bottom'; // New prop: side (horizontal) or bottom (vertical)
}

export function Logo({ className, showText = true, size = 'md', href = '/', textSize, textPosition = 'bottom' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-20 w-20',
    md: 'h-36 w-36', // Very large logo for Navbar
    lg: 'h-40 w-40',
  };

  // Fixed text sizes - independent of logo size
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  // Default text size is 'sm' (text-xs) when below logo, 'md' (text-sm) when on side
  const finalTextSize = textSize || (textPosition === 'bottom' ? 'sm' : 'md');

  return (
    <Link 
      href={href} 
      className={cn(
        'group transition-opacity hover:opacity-80',
        textPosition === 'side' ? 'flex items-center gap-2' : 'flex flex-col items-center gap-1',
        className
      )}
      aria-label="Dama Home Realty - Home"
    >
      <div className={cn('relative shrink-0 transition-transform group-hover:scale-105', sizeClasses[size])}>
        <Image
          src="/logo.png"
          alt="Dama Home Realty Logo"
          fill
          className="object-contain drop-shadow-sm"
          priority
          sizes="(max-width: 768px) 144px, 160px"
        />
      </div>
      {showText && (
        <span className={cn(
          'font-bold text-[#0F172A] dark:text-white transition-colors whitespace-nowrap text-center',
          textSizeClasses[finalTextSize]
        )}>
          Dama Home Realty
        </span>
      )}
    </Link>
  );
}

