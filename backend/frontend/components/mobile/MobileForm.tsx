'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { isMobile, showKeyboard, hideKeyboard } from '@/lib/mobile';
import { useEffect, useRef } from 'react';

interface MobileFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Mobile-optimized form field wrapper
 */
export function MobileFormField({
  label,
  error,
  required,
  children,
  className,
}: MobileFormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-base font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Mobile-optimized input with better keyboard handling
 */
export function MobileInput({
  className,
  type = 'text',
  autoComplete,
  inputMode,
  ...props
}: React.ComponentProps<typeof Input>) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isMobile() || !inputRef.current) return;

    // Auto-focus and show keyboard on mobile
    const input = inputRef.current;
    
    if (type === 'tel' && !inputMode) {
      input.setAttribute('inputmode', 'tel');
    } else if (type === 'email' && !inputMode) {
      input.setAttribute('inputmode', 'email');
    } else if (type === 'number' && !inputMode) {
      input.setAttribute('inputmode', 'numeric');
    } else if (inputMode) {
      input.setAttribute('inputmode', inputMode);
    }

    return () => {
      // Hide keyboard when unmounting
      hideKeyboard(input);
    };
  }, [type, inputMode]);

  return (
    <Input
      ref={inputRef}
      type={type}
      autoComplete={autoComplete}
      inputMode={inputMode}
      className={cn(
        'min-h-[48px] text-base', // Larger touch target and text
        'focus:border-secondary focus:ring-secondary',
        className
      )}
      {...props}
    />
  );
}

/**
 * Mobile-optimized textarea
 */
export function MobileTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Textarea
      ref={textareaRef}
      className={cn(
        'min-h-[120px] text-base', // Larger touch target and text
        'focus:border-secondary focus:ring-secondary',
        'resize-none', // Prevent resize on mobile
        className
      )}
      {...props}
    />
  );
}

/**
 * Mobile-optimized select
 */
export function MobileSelect({
  placeholder,
  options,
  value,
  onChange,
  className,
}: {
  placeholder?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          'min-h-[48px] text-base w-full', // Larger touch target
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="min-h-[44px] text-base" // Touch target size
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Mobile-optimized button with haptic feedback
 */
export function MobileButton({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const isMobileDevice = isMobile();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobileDevice && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10); // Light haptic feedback
      } catch (error) {
        // Ignore vibration errors
      }
    }
    onClick?.(e);
  };

  return (
    <Button
      className={cn(
        'min-h-[48px] text-base font-medium', // Larger touch target
        'touch-manipulation', // Optimize touch response
        className
      )}
      onClick={handleClick}
      {...props}
    />
  );
}

