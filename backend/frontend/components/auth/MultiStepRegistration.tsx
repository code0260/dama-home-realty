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

const steps = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Password & Security', icon: Lock },
  { id: 3, title: 'Verification', icon: ShieldCheck },
  { id: 4, title: 'Terms & Referral', icon: CheckCircle2 },
];

export function MultiStepRegistration({
  onRegister,
  onEmailVerification,
  onPhoneVerification,
  isLoading = false,
  error,
  className,
}: MultiStepRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
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
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required';
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone format';
      }
    }

    if (step === 2) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }
      if (formData.password !== formData.passwordConfirmation) {
        newErrors.passwordConfirmation = 'Passwords do not match';
      }
    }

    if (step === 3) {
      if (!formData.emailVerificationCode) {
        newErrors.emailVerificationCode = 'Email verification code is required';
      }
      if (!formData.phoneVerificationCode) {
        newErrors.phoneVerificationCode = 'Phone verification code is required';
      }
    }

    if (step === 4) {
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms of service';
      }
      if (!formData.acceptPrivacy) {
        newErrors.acceptPrivacy = 'You must accept the privacy policy';
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
      setErrors({ ...errors, email: 'Please enter a valid email address' });
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
      setErrors({ ...errors, phone: 'Please enter a valid phone number' });
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
              <CardTitle className="text-xl font-bold text-primary dark:text-white">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-sm">
                Step {currentStep} of {steps.length}
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
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="John Doe"
                  className={errors.name ? 'border-red-500' : ''}
                  disabled={isLoading}
                  required
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="john@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                  disabled={isLoading}
                  required
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+963 123 456 789"
                  className={errors.phone ? 'border-red-500' : ''}
                  disabled={isLoading}
                  required
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
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
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  placeholder="At least 8 characters"
                  className={errors.password ? 'border-red-500' : ''}
                  disabled={isLoading}
                  required
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                <p className="text-xs text-gray-500">
                  Must contain uppercase, lowercase, and number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirmation">Confirm Password *</Label>
                <Input
                  id="passwordConfirmation"
                  type="password"
                  value={formData.passwordConfirmation}
                  onChange={(e) => updateFormData('passwordConfirmation', e.target.value)}
                  placeholder="Confirm your password"
                  className={errors.passwordConfirmation ? 'border-red-500' : ''}
                  disabled={isLoading}
                  required
                />
                {errors.passwordConfirmation && (
                  <p className="text-sm text-red-500">{errors.passwordConfirmation}</p>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailCode">Email Verification Code *</Label>
                  {!emailCodeSent && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSendEmailCode}
                      disabled={sendingEmailCode || !formData.email}
                    >
                      {sendingEmailCode ? 'Sending...' : 'Send Code'}
                    </Button>
                  )}
                </div>
                <Input
                  id="emailCode"
                  type="text"
                  value={formData.emailVerificationCode}
                  onChange={(e) => updateFormData('emailVerificationCode', e.target.value)}
                  placeholder="Enter 6-digit code"
                  className={errors.emailVerificationCode ? 'border-red-500' : ''}
                  disabled={isLoading}
                  required
                />
                {errors.emailVerificationCode && (
                  <p className="text-sm text-red-500">{errors.emailVerificationCode}</p>
                )}
                {emailCodeSent && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Code sent to {formData.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phoneCode">Phone Verification Code *</Label>
                  {!phoneCodeSent && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSendPhoneCode}
                      disabled={sendingPhoneCode || !formData.phone}
                    >
                      {sendingPhoneCode ? 'Sending...' : 'Send Code'}
                    </Button>
                  )}
                </div>
                <Input
                  id="phoneCode"
                  type="text"
                  value={formData.phoneVerificationCode}
                  onChange={(e) => updateFormData('phoneVerificationCode', e.target.value)}
                  placeholder="Enter 6-digit code"
                  className={errors.phoneVerificationCode ? 'border-red-500' : ''}
                  disabled={isLoading}
                  required
                />
                {errors.phoneVerificationCode && (
                  <p className="text-sm text-red-500">{errors.phoneVerificationCode}</p>
                )}
                {phoneCodeSent && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Code sent to {formData.phone}
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
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{' '}
                    <a href="/terms" target="_blank" className="text-secondary hover:underline">
                      Terms of Service
                    </a>{' '}
                    *
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                )}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={formData.acceptPrivacy}
                    onCheckedChange={(checked) => updateFormData('acceptPrivacy', checked)}
                    disabled={isLoading}
                    required
                  />
                  <label
                    htmlFor="privacy"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I accept the{' '}
                    <a href="/privacy" target="_blank" className="text-secondary hover:underline">
                      Privacy Policy
                    </a>{' '}
                    *
                  </label>
                </div>
                {errors.acceptPrivacy && (
                  <p className="text-sm text-red-500">{errors.acceptPrivacy}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referralCode" className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-secondary" />
                  Referral Code (optional)
                </Label>
                <Input
                  id="referralCode"
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) => updateFormData('referralCode', e.target.value)}
                  placeholder="Enter referral code"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Have a referral code? Enter it here to get a special discount.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-primary-700">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              className="bg-secondary hover:bg-secondary/90 flex items-center gap-2"
              disabled={isLoading}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-secondary hover:bg-secondary/90 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  Creating Account...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Create Account
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

