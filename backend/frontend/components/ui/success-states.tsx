'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { successCheckAnimation, scaleAnimations } from '@/lib/micro-interactions';
import { useEffect, useState } from 'react';

interface SuccessToastProps {
  message: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
  variant?: 'success' | 'error' | 'warning' | 'info';
  show?: boolean;
}

export function SuccessToast({
  message,
  description,
  duration = 3000,
  onClose,
  variant = 'success',
  show = true,
}: SuccessToastProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 300); // Wait for exit animation
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const variantConfig = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-700',
      iconColor: 'text-green-600 dark:text-green-400',
      textColor: 'text-green-900 dark:text-green-300',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-700',
      iconColor: 'text-red-600 dark:text-red-400',
      textColor: 'text-red-900 dark:text-red-300',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-700',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      textColor: 'text-yellow-900 dark:text-yellow-300',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-900 dark:text-blue-300',
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={scaleAnimations}
          className={cn(
            'fixed top-4 right-4 z-50 max-w-md w-full',
            'bg-white dark:bg-primary-800',
            'border-2 rounded-lg shadow-lg p-4',
            config.bgColor,
            config.borderColor
          )}
        >
          <div className="flex items-start gap-3">
            <motion.div
              variants={variant === 'success' ? successCheckAnimation : scaleAnimations}
              initial="initial"
              animate="animate"
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', config.iconColor)} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={cn('font-semibold text-sm', config.textColor)}>
                {message}
              </p>
              {description && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                if (onClose) {
                  setTimeout(onClose, 300);
                }
              }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SuccessIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export function SuccessIcon({
  size = 'md',
  className,
  animated = true,
}: SuccessIconProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <motion.div
      variants={animated ? successCheckAnimation : scaleAnimations}
      initial="initial"
      animate="animate"
      className={className}
    >
      <CheckCircle2
        className={cn(
          'text-green-600 dark:text-green-400',
          sizeClasses[size],
          className
        )}
      />
    </motion.div>
  );
}

interface SuccessMessageProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export function SuccessMessage({
  title,
  description,
  icon,
  className,
  onClose,
}: SuccessMessageProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={scaleAnimations}
      className={cn(
        'bg-green-50 dark:bg-green-900/20',
        'border-2 border-green-200 dark:border-green-700',
        'rounded-lg p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon || <SuccessIcon size="md" />}
        <div className="flex-1">
          <h3 className="font-semibold text-green-900 dark:text-green-300 mb-1">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-green-700 dark:text-green-400">
              {description}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-green-600 hover:text-green-800 dark:hover:text-green-400 transition-colors"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

interface SuccessButtonProps {
  isLoading?: boolean;
  isSuccess?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function SuccessButton({
  isLoading,
  isSuccess,
  children,
  className,
  onClick,
  disabled,
}: SuccessButtonProps) {
  return (
    <motion.button
      whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'relative px-6 py-3 rounded-lg font-semibold',
        'bg-secondary hover:bg-secondary/90 text-white',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-300',
        isSuccess && 'bg-green-500 hover:bg-green-600',
        className
      )}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </motion.span>
        ) : isSuccess ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Success!</span>
          </motion.span>
        ) : (
          <motion.span
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

