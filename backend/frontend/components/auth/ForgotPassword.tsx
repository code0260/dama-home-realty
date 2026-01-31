'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface ForgotPasswordProps {
  children?: React.ReactNode;
  className?: string;
}

export function ForgotPassword({ children, className }: ForgotPasswordProps) {
  const { t, locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axiosInstance.post('/forgot-password', { email });
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        getTranslation('failedToSendResetLink', 'فشل إرسال رابط إعادة التعيين. يرجى المحاولة مرة أخرى.', 'Failed to send reset link. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  const resetDialog = () => {
    setOpen(false);
    setEmail('');
    setError(null);
    setSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <button
            type="button"
            className={cn('text-sm text-secondary hover:underline', className)}
          >
            {getTranslation('forgotPassword', 'نسيت كلمة المرور؟', 'Forgot password?')}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-start">{getTranslation('resetPassword', 'إعادة تعيين كلمة المرور', 'Reset Password')}</DialogTitle>
          <DialogDescription className="text-start">
            {getTranslation('enterEmailReset', 'أدخل عنوان بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.', 'Enter your email address and we\'ll send you a link to reset your password.')}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4 py-4"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-primary dark:text-white">
                  {getTranslation('checkYourEmail', 'تحقق من بريدك الإلكتروني', 'Check Your Email')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {getTranslation('passwordResetLinkSent', 'لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى عنوان بريدك الإلكتروني.', 'We\'ve sent a password reset link to your email address.')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {getTranslation('checkInboxClickLink', 'يرجى التحقق من صندوق الوارد والنقر على الرابط لإعادة تعيين كلمة المرور.', 'Please check your inbox and click the link to reset your password.')}
                </p>
              </div>
              <Button onClick={resetDialog} className="w-full" variant="outline">
                {getTranslation('close', 'إغلاق', 'Close')}
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-start">{getTranslation('emailAddress', 'عنوان البريد الإلكتروني', 'Email Address')}</Label>
                <div className="relative">
                  <Mail className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400", locale === 'ar' ? 'right-3' : 'left-3')} />
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className={cn(locale === 'ar' ? 'pr-10' : 'pl-10', 'text-start')}
                    dir="ltr"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className={cn("w-full bg-secondary hover:bg-secondary/90", locale === 'ar' && 'flex-row-reverse')}
                disabled={loading || !email.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className={cn("w-4 h-4 animate-spin", locale === 'ar' ? 'ml-2' : 'mr-2')} />
                    {getTranslation('auth.sending', 'جاري الإرسال...', 'Sending...')}
                  </>
                ) : (
                  <>
                    <Mail className={cn("w-4 h-4", locale === 'ar' ? 'ml-2' : 'mr-2')} />
                    {getTranslation('sendResetLink', 'إرسال رابط إعادة التعيين', 'Send Reset Link')}
                  </>
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

