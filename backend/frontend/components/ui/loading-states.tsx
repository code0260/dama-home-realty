'use client';

import { motion } from 'framer-motion';
import { Loader2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pulseAnimation } from '@/lib/micro-interactions';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'secondary' | 'white';
}

export function LoadingSpinner({
  size = 'md',
  className,
  variant = 'default',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    default: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
  };

  return (
    <Loader2
      className={cn(
        'animate-spin',
        sizeClasses[size],
        colorClasses[variant],
        className
      )}
    />
  );
}

interface LoadingDotsProps {
  className?: string;
  variant?: 'default' | 'secondary' | 'white';
}

export function LoadingDots({ className, variant = 'default' }: LoadingDotsProps) {
  const colorClasses = {
    default: 'bg-primary',
    secondary: 'bg-secondary',
    white: 'bg-white',
  };

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn('w-2 h-2 rounded-full', colorClasses[variant])}
          animate={{
            y: [0, -8, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function LoadingSkeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: LoadingSkeletonProps) {
  const variantClasses = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  return (
    <motion.div
      className={cn(
        'bg-gray-200 dark:bg-primary-800',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
      variants={animation === 'pulse' ? pulseAnimation : undefined}
      animate={animation === 'pulse' ? 'animate' : undefined}
    />
  );
}

interface LoadingProgressProps {
  value?: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'secondary' | 'success';
}

export function LoadingProgress({
  value,
  max = 100,
  showLabel = false,
  className,
  variant = 'default',
}: LoadingProgressProps) {
  const percentage = value !== undefined ? (value / max) * 100 : undefined;

  const variantClasses = {
    default: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-green-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && percentage !== undefined && (
        <div className="flex justify-between items-center mb-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Loading...</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-primary-800 rounded-full h-2 overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', variantClasses[variant])}
          initial={{ width: 0 }}
          animate={{
            width: percentage !== undefined ? `${percentage}%` : '100%',
          }}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  text = 'Loading...',
  children,
  className,
}: LoadingOverlayProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn('relative', className)}>
      {children}
      <div className="absolute inset-0 bg-white/80 dark:bg-primary-900/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" variant="secondary" />
          {text && (
            <p className="text-sm font-medium text-primary dark:text-white">
              {text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

