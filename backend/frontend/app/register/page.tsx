'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/ui-custom/Logo';
import { SocialLogin } from '@/components/auth/SocialLogin';
import { MultiStepRegistration } from '@/components/auth/MultiStepRegistration';
import axiosInstance from '@/lib/axios';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  emailVerificationCode: string;
  phoneVerificationCode: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  referralCode?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const { t, locale } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoginLoading, setSocialLoginLoading] = useState<string | null>(null);
  const hasRedirectedRef = useRef(false);

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

  // Redirect if already authenticated (only once) - but only if not currently registering
  useEffect(() => {
    if (!authLoading && isAuthenticated && !hasRedirectedRef.current && !isLoading) {
      hasRedirectedRef.current = true;
      // Use window.location to ensure full page reload
      if (typeof window !== 'undefined') {
        window.location.href = '/portal';
      } else {
        router.push('/portal');
      }
    }
  }, [isAuthenticated, authLoading, router, isLoading]);

  const handleRegister = async (data: RegistrationData) => {
    setError(null);
    setIsLoading(true);

    try {
      // Register with all the data
      await register(data.name, data.email, data.password, data.passwordConfirmation);
      // After successful registration, redirect to verification page or portal
      router.push('/portal');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.errors?.password?.[0] ||
        getTranslation('registrationFailed', 'فشل التسجيل. يرجى المحاولة مرة أخرى.', 'Registration failed. Please try again.');
      setError(errorMessage);
      throw err; // Re-throw to let MultiStepRegistration handle it
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async (email: string) => {
    try {
      await axiosInstance.post('/auth/verify-email/send', { email });
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || getTranslation('failedToSendEmailCode', 'فشل إرسال رمز التحقق من البريد الإلكتروني', 'Failed to send email verification code')
      );
    }
  };

  const handlePhoneVerification = async (phone: string) => {
    try {
      await axiosInstance.post('/auth/verify-phone/send', { phone });
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || getTranslation('failedToSendPhoneCode', 'فشل إرسال رمز التحقق من الهاتف', 'Failed to send phone verification code')
      );
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setSocialLoginLoading(provider);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
      window.location.href = `${baseUrl}/auth/${provider}/redirect`;
    } catch (err: any) {
      setError(getTranslation('failedToInitiateSocialLogin', 'فشل بدء تسجيل الدخول الاجتماعي. يرجى المحاولة مرة أخرى.', 'Failed to initiate social login. Please try again.'));
      setSocialLoginLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">{getTranslation('loading', 'جاري التحميل...', 'Loading...')}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-primary-900">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={false} />
            </div>
            <h1 className="text-3xl font-bold text-primary dark:text-white mb-2">
              {getTranslation('createAccount', 'إنشاء حساب', 'Create Account')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {getTranslation('signUpToGetStarted', 'سجل للبدء مع Dama Home Realty', 'Sign up to get started with Dama Home Realty')}
            </p>
          </div>

          {/* Social Login */}
          <div className="mb-8">
            <SocialLogin
              onSocialLogin={handleSocialLogin}
              isLoading={!!socialLoginLoading}
            />
          </div>

          {/* Multi-Step Registration Form */}
          <MultiStepRegistration
            onRegister={handleRegister}
            onEmailVerification={handleEmailVerification}
            onPhoneVerification={handlePhoneVerification}
            isLoading={isLoading}
            error={error}
          />

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-start">
              {getTranslation('alreadyHaveAccount', 'لديك حساب بالفعل؟', 'Already have an account?')}{' '}
              <Link
                href="/login"
                className="text-secondary hover:underline font-medium"
              >
                {getTranslation('signIn', 'تسجيل الدخول', 'Sign in')}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

