'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  User,
  Lock,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Gift,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface RegistrationData {
  // Step 1: Personal Information
  name: string;
  email: string;
  phone: string;

  // Step 2: Password & Security
  password: string;
  passwordConfirmation: string;

  // Step 3: Verification
  emailVerificationCode: string;
  phoneVerificationCode: string;

  // Step 4: Terms & Referral
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  referralCode?: string;
}

interface MultiStepRegistrationProps {
  onRegister: (data: RegistrationData) => Promise<void>;
  onEmailVerification: (email: string) => Promise<void>;
  onPhoneVerification: (phone: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export function MultiStepRegistration({
  onRegister,
  onEmailVerification,
  onPhoneVerification,
  isLoading = false,
  error,
  className,
}: MultiStepRegistrationProps) {
  const { t, locale } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

  const steps = [
    { id: 1, title: getTranslation('personalInformation', 'المعلومات الشخصية', 'Personal Information'), icon: User },
    { id: 2, title: getTranslation('passwordSecurity', 'كلمة المرور والأمان', 'Password & Security'), icon: Lock },
    { id: 3, title: getTranslation('verification', 'التحقق', 'Verification'), icon: ShieldCheck },
    { id: 4, title: getTranslation('termsReferral', 'الشروط والكود المرجعي', 'Terms & Referral'), icon: CheckCircle2 },
  ];
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    emailVerificationCode: '',
    phoneVerificationCode: '',
    acceptTerms: false,
    acceptPrivacy: false,
    referralCode: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [sendingEmailCode, setSendingEmailCode] = useState(false);
  const [sendingPhoneCode, setSendingPhoneCode] = useState(false);

  const progress = (currentStep / steps.length) * 100;

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = getTranslation('nameRequired', 'الاسم مطلوب', 'Name is required');
      if (!formData.email.trim()) {
        newErrors.email = getTranslation('emailRequired', 'البريد الإلكتروني مطلوب', 'Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = getTranslation('invalidEmailFormat', 'صيغة البريد الإلكتروني غير صحيحة', 'Invalid email format');
      }
      if (!formData.phone.trim()) {
        newErrors.phone = getTranslation('phoneRequired', 'رقم الهاتف مطلوب', 'Phone is required');
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = getTranslation('invalidPhoneFormat', 'صيغة رقم الهاتف غير صحيحة', 'Invalid phone format');
      }
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = getTranslation('passwordRequired', 'كلمة المرور مطلوبة', 'Password is required');
      } else if (formData.password.length < 8) {
        newErrors.password = getTranslation('passwordMinLength', 'يجب أن تكون كلمة المرور 8 أحرف على الأقل', 'Password must be at least 8 characters');
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = getTranslation('passwordComplexity', 'يجب أن تحتوي كلمة المرور على أحرف كبيرة وصغيرة ورقم', 'Password must contain uppercase, lowercase, and number');
      }
      if (formData.password !== formData.passwordConfirmation) {
        newErrors.passwordConfirmation = getTranslation('passwordsDoNotMatch', 'كلمات المرور غير متطابقة', 'Passwords do not match');
      }
    }

    if (step === 3) {
      if (!formData.emailVerificationCode) {
        newErrors.emailVerificationCode = getTranslation('emailCodeRequired', 'رمز التحقق من البريد الإلكتروني مطلوب', 'Email verification code is required');
      }
      if (!formData.phoneVerificationCode) {
        newErrors.phoneVerificationCode = getTranslation('phoneCodeRequired', 'رمز التحقق من الهاتف مطلوب', 'Phone verification code is required');
      }
    }

    if (step === 4) {
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = getTranslation('mustAcceptTerms', 'يجب عليك الموافقة على شروط الخدمة', 'You must accept the terms of service');
      }
      if (!formData.acceptPrivacy) {
        newErrors.acceptPrivacy = getTranslation('mustAcceptPrivacy', 'يجب عليك الموافقة على سياسة الخصوصية', 'You must accept the privacy policy');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Auto-send verification codes when moving to step 3
      if (currentStep === 2 && !emailCodeSent) {
        handleSendEmailCode();
      }
      if (currentStep === 2 && !phoneCodeSent) {
        handleSendPhoneCode();
      }
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSendEmailCode = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors({ ...errors, email: getTranslation('pleaseEnterValidEmail', 'يرجى إدخال عنوان بريد إلكتروني صحيح', 'Please enter a valid email address') });
      return;
    }

    setSendingEmailCode(true);
    try {
      await onEmailVerification(formData.email);
      setEmailCodeSent(true);
    } catch (error) {
      console.error('Error sending email verification code:', error);
    } finally {
      setSendingEmailCode(false);
    }
  };

  const handleSendPhoneCode = async () => {
    if (!formData.phone || !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      setErrors({ ...errors, phone: getTranslation('pleaseEnterValidPhone', 'يرجى إدخال رقم هاتف صحيح', 'Please enter a valid phone number') });
      return;
    }

    setSendingPhoneCode(true);
    try {
      await onPhoneVerification(formData.phone);
      setPhoneCodeSent(true);
    } catch (error) {
      console.error('Error sending phone verification code:', error);
    } finally {
      setSendingPhoneCode(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    await onRegister(formData);
  };

  const updateFormData = (field: keyof RegistrationData, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const CurrentStepIcon = steps[currentStep - 1]?.icon || User;

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              {CurrentStepIcon && <CurrentStepIcon className="w-5 h-5 text-secondary" />}
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-primary dark:text-white text-start">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-sm text-start">
                {(() => {
                  const translation = t('stepOf', { current: currentStep, total: steps.length });
                  if (translation === 'stepOf' || translation.includes('stepOf')) {
                    return locale === 'ar' ? `الخطوة ${currentStep} من ${steps.length}` : `Step ${currentStep} of ${steps.length}`;
                  }
                  return translation;
                })()}
              </CardDescription>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-start">{getTranslation('fullName', 'الاسم الكامل', 'Full Name')} *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder={locale === 'ar' ? 'أحمد محمد' : 'John Doe'}
                  className={cn(errors.name ? 'border-red-500' : '', 'text-start')}
                  disabled={isLoading}
                  required
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                />
                {errors.name && <p className="text-sm text-red-500 text-start">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-start">{getTranslation('emailAddress', 'عنوان البريد الإلكتروني', 'Email Address')} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="john@example.com"
                  className={cn(errors.email ? 'border-red-500' : '', 'text-start')}
                  disabled={isLoading}
                  required
                  dir="ltr"
                />
                {errors.email && <p className="text-sm text-red-500 text-start">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-start">{getTranslation('phoneNumber', 'رقم الهاتف', 'Phone Number')} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+963 123 456 789"
                  className={cn(errors.phone ? 'border-red-500' : '', 'text-start')}
                  disabled={isLoading}
                  required
                  dir="ltr"
                />
                {errors.phone && <p className="text-sm text-red-500 text-start">{errors.phone}</p>}
              </div>
            </motion.div>
          )}

          {/* Step 2: Password & Security */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="password" className="text-start">{getTranslation('password', 'كلمة المرور', 'Password')} *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder={getTranslation('atLeast8Characters', '8 أحرف على الأقل', 'At least 8 characters')}
                  className={cn(errors.password ? 'border-red-500' : '', 'text-start')}
                  disabled={isLoading}
                  required
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                />
                {errors.password && <p className="text-sm text-red-500 text-start">{errors.password}</p>}
                <p className="text-xs text-gray-500 text-start">
                  {getTranslation('mustContainUppercaseLowercaseNumber', 'يجب أن يحتوي على أحرف كبيرة وصغيرة ورقم', 'Must contain uppercase, lowercase, and number')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirmation" className="text-start">{getTranslation('confirmPassword', 'تأكيد كلمة المرور', 'Confirm Password')} *</Label>
                <Input
                  id="passwordConfirmation"
                  type="password"
                  value={formData.passwordConfirmation}
                  onChange={(e) => updateFormData('passwordConfirmation', e.target.value)}
                  placeholder={getTranslation('confirmYourPassword', 'أكد كلمة المرور الخاصة بك', 'Confirm your password')}
                  className={cn(errors.passwordConfirmation ? 'border-red-500' : '', 'text-start')}
                  disabled={isLoading}
                  required
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                />
                {errors.passwordConfirmation && (
                  <p className="text-sm text-red-500 text-start">{errors.passwordConfirmation}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Verification */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <div className={cn("flex items-center justify-between", locale === 'ar' && 'flex-row-reverse')}>
                  <Label htmlFor="emailCode" className="text-start">{getTranslation('emailVerificationCode', 'رمز التحقق من البريد الإلكتروني', 'Email Verification Code')} *</Label>
                  {!emailCodeSent && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSendEmailCode}
                      disabled={sendingEmailCode || !formData.email}
                      className={cn(locale === 'ar' && 'flex-row-reverse')}
                    >
                      {sendingEmailCode ? getTranslation('sending', 'جاري الإرسال...', 'Sending...') : getTranslation('sendCode', 'إرسال الرمز', 'Send Code')}
                    </Button>
                  )}
                </div>
                <Input
                  id="emailCode"
                  type="text"
                  value={formData.emailVerificationCode}
                  onChange={(e) => updateFormData('emailVerificationCode', e.target.value)}
                  placeholder={getTranslation('enter6DigitCode', 'أدخل رمزاً مكوناً من 6 أرقام', 'Enter 6-digit code')}
                  className={cn(errors.emailVerificationCode ? 'border-red-500' : '', 'text-start')}
                  disabled={isLoading}
                  required
                  dir="ltr"
                />
                {errors.emailVerificationCode && (
                  <p className="text-sm text-red-500 text-start">{errors.emailVerificationCode}</p>
                )}
                {emailCodeSent && (
                  <p className="text-xs text-green-600 dark:text-green-400 text-start">
                    {(() => {
                      const translation = t('codeSentTo', { email: formData.email });
                      if (translation === 'codeSentTo' || translation.includes('codeSentTo')) {
                        return locale === 'ar' ? `تم إرسال الرمز إلى ${formData.email}` : `Code sent to ${formData.email}`;
                      }
                      return translation;
                    })()}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className={cn("flex items-center justify-between", locale === 'ar' && 'flex-row-reverse')}>
                  <Label htmlFor="phoneCode" className="text-start">{getTranslation('phoneVerificationCode', 'رمز التحقق من الهاتف', 'Phone Verification Code')} *</Label>
                  {!phoneCodeSent && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSendPhoneCode}
                      disabled={sendingPhoneCode || !formData.phone}
                      className={cn(locale === 'ar' && 'flex-row-reverse')}
                    >
                      {sendingPhoneCode ? getTranslation('sending', 'جاري الإرسال...', 'Sending...') : getTranslation('sendCode', 'إرسال الرمز', 'Send Code')}
                    </Button>
                  )}
                </div>
                <Input
                  id="phoneCode"
                  type="text"
                  value={formData.phoneVerificationCode}
                  onChange={(e) => updateFormData('phoneVerificationCode', e.target.value)}
                  placeholder={getTranslation('enter6DigitCode', 'أدخل رمزاً مكوناً من 6 أرقام', 'Enter 6-digit code')}
                  className={cn(errors.phoneVerificationCode ? 'border-red-500' : '', 'text-start')}
                  disabled={isLoading}
                  required
                  dir="ltr"
                />
                {errors.phoneVerificationCode && (
                  <p className="text-sm text-red-500 text-start">{errors.phoneVerificationCode}</p>
                )}
                {phoneCodeSent && (
                  <p className="text-xs text-green-600 dark:text-green-400 text-start">
                    {(() => {
                      const translation = t('codeSentToPhone', { phone: formData.phone });
                      if (translation === 'codeSentToPhone' || translation.includes('codeSentToPhone')) {
                        return locale === 'ar' ? `تم إرسال الرمز إلى ${formData.phone}` : `Code sent to ${formData.phone}`;
                      }
                      return translation;
                    })()}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Terms & Referral */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptTerms}
                    onCheckedChange={(checked) => updateFormData('acceptTerms', checked)}
                    disabled={isLoading}
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-start"
                  >
                    {getTranslation('iAcceptTerms', 'أوافق على', 'I accept the')}{' '}
                    <a href="/terms" target="_blank" className="text-secondary hover:underline">
                      {getTranslation('termsOfService', 'شروط الخدمة', 'Terms of Service')}
                    </a>{' '}
                    *
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-500 text-start">{errors.acceptTerms}</p>
                )}

                <div className={cn("flex items-start", locale === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2')}>
                  <Checkbox
                    id="privacy"
                    checked={formData.acceptPrivacy}
                    onCheckedChange={(checked) => updateFormData('acceptPrivacy', checked)}
                    disabled={isLoading}
                    required
                  />
                  <label
                    htmlFor="privacy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-start"
                  >
                    {getTranslation('iAcceptTerms', 'أوافق على', 'I accept the')}{' '}
                    <a href="/privacy" target="_blank" className="text-secondary hover:underline">
                      {getTranslation('privacyPolicy', 'سياسة الخصوصية', 'Privacy Policy')}
                    </a>{' '}
                    *
                  </label>
                </div>
                {errors.acceptPrivacy && (
                  <p className="text-sm text-red-500 text-start">{errors.acceptPrivacy}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode" className={cn("flex items-center gap-2", locale === 'ar' && 'flex-row-reverse', 'text-start')}>
                  <Gift className="w-4 h-4 text-secondary" />
                  {getTranslation('referralCode', 'الكود المرجعي (اختياري)', 'Referral Code (optional)')}
                </Label>
                <Input
                  id="referralCode"
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => updateFormData('referralCode', e.target.value)}
                  placeholder={getTranslation('enterReferralCode', 'أدخل الكود المرجعي', 'Enter referral code')}
                  disabled={isLoading}
                  className="text-start"
                  dir={locale === 'ar' ? 'rtl' : 'ltr'}
                />
                <p className="text-xs text-gray-500 text-start">
                  {getTranslation('referralCodeDescription', 'هل لديك كود مرجعي؟ أدخله هنا للحصول على خصم خاص.', 'Have a referral code? Enter it here to get a special discount.')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className={cn("flex items-center justify-between pt-4 border-t border-gray-200 dark:border-primary-700", locale === 'ar' && 'flex-row-reverse')}>
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
            className={cn("flex items-center gap-2", locale === 'ar' && 'flex-row-reverse')}
          >
            <ArrowLeft className={cn("w-4 h-4", locale === 'ar' && 'rotate-180')} />
            {getTranslation('back', 'رجوع', 'Back')}
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              className={cn("bg-secondary hover:bg-secondary/90 flex items-center gap-2", locale === 'ar' && 'flex-row-reverse')}
              disabled={isLoading}
            >
              {getTranslation('next', 'التالي', 'Next')}
              <ArrowRight className={cn("w-4 h-4", locale === 'ar' && 'rotate-180')} />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={cn("bg-secondary hover:bg-secondary/90 flex items-center gap-2", locale === 'ar' && 'flex-row-reverse')}
            >
              {isLoading ? (
                <>
                  {getTranslation('creatingAccount', 'جاري إنشاء الحساب...', 'Creating Account...')}
                </>
              ) : (
                <>
                  <CheckCircle2 className={cn("w-4 h-4", locale === 'ar' ? 'ml-2' : 'mr-2')} />
                  {getTranslation('createAccount', 'إنشاء حساب', 'Create Account')}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

