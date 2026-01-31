'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface TwoFactorAuthProps {
  onVerify: (code: string) => Promise<void>;
  onResend?: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export function TwoFactorAuth({
  onVerify,
  onResend,
  isLoading = false,
  error,
  className,
}: TwoFactorAuthProps) {
  const { t, locale } = useLanguage();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const digits = pastedData.split('').filter((char) => /^\d$/.test(char));

    if (digits.length === 6) {
      const newCode = [...digits];
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      await onVerify(fullCode);
    }
  };

  const handleResend = async () => {
    if (!onResend) return;

    setIsResending(true);
    setResendSuccess(false);

    try {
      await onResend();
      setResendSuccess(true);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      console.error('Error resending code:', err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-secondary/10 rounded-full">
            <ShieldCheck className="w-8 h-8 text-secondary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-primary dark:text-white">
          {getTranslation('twoFactorAuthentication', 'المصادقة الثنائية', 'Two-Factor Authentication')}
        </CardTitle>
        <CardDescription className="text-base">
          {getTranslation('enter6DigitCodeEmail', 'أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك الإلكتروني', 'Enter the 6-digit code sent to your email')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resendSuccess && (
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {getTranslation('codeResentSuccessfully', 'تم إعادة إرسال الرمز بنجاح!', 'Code resent successfully!')}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="2fa-code" className="text-center block">
              {getTranslation('verificationCode', 'رمز التحقق', 'Verification Code')}
            </Label>
            <div
              className="flex justify-center gap-2"
              onPaste={handlePaste}
            >
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={cn(
                    'w-12 h-12 text-center text-lg font-bold',
                    'focus:ring-2 focus:ring-secondary',
                    error && 'border-red-500'
                  )}
                  disabled={isLoading}
                  required
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className={cn("w-full bg-secondary hover:bg-secondary/90", locale === 'ar' && 'flex-row-reverse')}
            disabled={isLoading || code.join('').length !== 6}
          >
            {isLoading ? (
              <>
                <Loader2 className={cn("w-4 h-4 animate-spin", locale === 'ar' ? 'ml-2' : 'mr-2')} />
                {getTranslation('verifying', 'جاري التحقق...', 'Verifying...')}
              </>
            ) : (
              <>
                <ShieldCheck className={cn("w-4 h-4", locale === 'ar' ? 'ml-2' : 'mr-2')} />
                {getTranslation('verifyCode', 'التحقق من الرمز', 'Verify Code')}
              </>
            )}
          </Button>

          {onResend && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm text-secondary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? getTranslation('resending', 'جاري إعادة الإرسال...', 'Resending...') : getTranslation('didntReceiveCode', 'لم تستلم رمزاً؟ إعادة الإرسال', 'Didn\'t receive a code? Resend')}
              </button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

