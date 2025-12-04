'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  User,
  Mail,
  MessageSquare,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axios';
import { ApiError, isApiError, getErrorMessage } from '@/types/errors';

interface ContactFormData {
  // Step 1: Personal Info
  name: string;
  email: string;
  phone: string;
  
  // Step 2: Inquiry Details
  inquiryType: string;
  subject: string;
  message: string;
  priority: string;
  
  // Step 3: Additional Info
  propertyId?: string;
  location?: string;
  budget?: string;
  timeline?: string;
  
  // Step 4: Files & Preferences
  files: File[];
  preferredContact: string[];
  newsletter: boolean;
}

interface MultiStepContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

const steps = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Inquiry Details', icon: MessageSquare },
  { id: 3, title: 'Additional Information', icon: FileText },
  { id: 4, title: 'Files & Preferences', icon: Upload },
];

export function MultiStepContactForm({ onSuccess, className }: MultiStepContactFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: '',
    priority: 'normal',
    propertyId: '',
    location: '',
    budget: '',
    timeline: '',
    files: [],
    preferredContact: [],
    newsletter: false,
  });

  const progress = (currentStep / steps.length) * 100;

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

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
      if (!formData.inquiryType) newErrors.inquiryType = 'Inquiry type is required';
      if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
      if (!formData.message.trim()) {
        newErrors.message = 'Message is required';
      } else if (formData.message.length < 10) {
        newErrors.message = 'Message must be at least 10 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData({
        ...formData,
        files: [...formData.files, ...newFiles].slice(0, 5), // Max 5 files
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // Explicitly ensure CSRF cookie is fetched before submission
      // Import getCsrfCookie function (we'll need to export it from axios.ts)
      // For now, the interceptor will handle it, but we can add explicit call if needed
      
      // Prepare form data
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'files') {
          formData.files.forEach((file) => {
            submitData.append('files[]', file);
          });
        } else if (key === 'preferredContact') {
          formData.preferredContact.forEach((method) => {
            submitData.append('preferred_contact[]', method);
          });
        } else {
          submitData.append(key, String(value));
        }
      });

      // The axios interceptor will automatically:
      // 1. Get CSRF cookie from /sanctum/csrf-cookie (with retry logic)
      // 2. Read XSRF-TOKEN cookie (with polling verification)
      // 3. Add X-XSRF-TOKEN header
      // 4. Handle FormData Content-Type correctly
      // 5. Retry once if 419 error occurs
      await axiosInstance.post('/contact', submitData, {
        headers: {
          'Accept': 'application/json',
        },
      });

      // Track form submission (analytics)
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'contact_form_submit', {
          event_category: 'Contact',
          event_label: formData.inquiryType,
        });
      }

      onSuccess?.();
      setCurrentStep(steps.length + 1); // Success step
    } catch (error: unknown) {
      console.error('Error submitting form:', error);
      
      // Handle 419 CSRF error specifically
      // The interceptor already retries once, so if we get here, it means retry also failed
      if (isApiError(error) && (error.response?.status === 419 || error.isCsrfError)) {
        setErrors({ 
          message: 'Session expired. Please refresh the page and try again.' 
        });
      } else if (isApiError(error) && error.response?.status === 422) {
        // Validation errors from backend
        const validationErrors = error.response.data?.errors || {};
        const firstError = Object.values(validationErrors)[0];
        setErrors({ 
          message: Array.isArray(firstError) ? firstError[0] : 'Validation error. Please check your input.' 
        });
      } else if (isApiError(error) && error.isNetworkError) {
        setErrors({ 
          message: 'Unable to connect to server. Please check your internet connection and try again.' 
        });
      } else {
        setErrors({ 
          message: getErrorMessage(error)
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = <K extends keyof ContactFormData>(field: K, value: ContactFormData[K]) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  if (currentStep > steps.length) {
    // Success step
    return (
      <Card className={cn('border border-gray-200 shadow-lg bg-white', className)}>
        <CardContent className="p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
              Message Sent Successfully!
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              A confirmation email has been sent to <span className="font-semibold text-[#B49162]">{formData.email}</span>
            </p>
            <Button
              onClick={() => {
                setCurrentStep(1);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  inquiryType: '',
                  subject: '',
                  message: '',
                  priority: 'normal',
                  propertyId: '',
                  location: '',
                  budget: '',
                  timeline: '',
                  files: [],
                  preferredContact: [],
                  newsletter: false,
                });
                setErrors({});
              }}
              variant="outline"
              className="border-gray-300 text-[#0F172A] hover:bg-gray-50"
            >
              Send Another Message
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const CurrentStepIcon = steps[currentStep - 1].icon;

  return (
    <Card className={cn('border border-gray-200 shadow-lg bg-white', className)}>
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#B49162]/10 rounded-lg">
              <CurrentStepIcon className="w-6 h-6 text-[#B49162]" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-[#0F172A]">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Step {currentStep} of {steps.length}
              </CardDescription>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" />
      </CardHeader>
      <CardContent className="space-y-6 p-6">
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
                <Label htmlFor="name" className="text-sm font-semibold text-[#0F172A]">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="John Doe"
                  className={cn(
                    'h-12 bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20',
                    errors.name && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  )}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-[#0F172A]">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="john@example.com"
                  className={cn(
                    'h-12 bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20',
                    errors.email && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  )}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold text-[#0F172A]">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+963 123 456 789"
                  className={cn(
                    'h-12 bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20',
                    errors.phone && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  )}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </motion.div>
          )}

          {/* Step 2: Inquiry Details */}
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
                <Label htmlFor="inquiryType" className="text-sm font-semibold text-[#0F172A]">
                  Inquiry Type *
                </Label>
                <Select
                  value={formData.inquiryType}
                  onValueChange={(value) => updateFormData('inquiryType', value)}
                >
                  <SelectTrigger 
                    className={cn(
                      'h-12 bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20',
                      errors.inquiryType && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    )}
                  >
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property">Property Inquiry</SelectItem>
                    <SelectItem value="general">General Question</SelectItem>
                    <SelectItem value="support">Support Request</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.inquiryType && <p className="text-sm text-red-500 mt-1">{errors.inquiryType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-semibold text-[#0F172A]">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => updateFormData('subject', e.target.value)}
                  placeholder="What is this regarding?"
                  className={cn(
                    'h-12 bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20',
                    errors.subject && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  )}
                />
                {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold text-[#0F172A]">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => updateFormData('priority', value)}
                >
                  <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold text-[#0F172A]">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => updateFormData('message', e.target.value)}
                  placeholder="Tell us how we can help..."
                  rows={6}
                  className={cn(
                    'bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20 resize-none',
                    errors.message && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  )}
                />
                {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message}</p>}
                <p className="text-xs text-gray-500">
                  {formData.message.length} / 500 characters
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Additional Information */}
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
                <Label htmlFor="propertyId" className="text-sm font-semibold text-[#0F172A]">
                  Property ID (if applicable)
                </Label>
                <Input
                  id="propertyId"
                  value={formData.propertyId}
                  onChange={(e) => updateFormData('propertyId', e.target.value)}
                  placeholder="PROP-12345"
                  className="h-12 bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold text-[#0F172A]">
                  Location of Interest
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  placeholder="Damascus, Syria"
                  className="h-12 bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-semibold text-[#0F172A]">
                  Budget (optional)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateFormData('budget', e.target.value)}
                  placeholder="10000"
                  className="h-12 bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline" className="text-sm font-semibold text-[#0F172A]">
                  Timeline
                </Label>
                <Select
                  value={formData.timeline}
                  onValueChange={(value) => updateFormData('timeline', value)}
                >
                  <SelectTrigger className="h-12 bg-white border-gray-300 focus:border-[#B49162] focus:ring-[#B49162]/20">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="1month">Within 1 Month</SelectItem>
                    <SelectItem value="3months">Within 3 Months</SelectItem>
                    <SelectItem value="6months">Within 6 Months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {/* Step 4: Files & Preferences */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-[#0F172A]">
                  Upload Files (optional, max 5 files)
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#B49162] transition-colors bg-gray-50">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm text-[#B49162] font-semibold hover:underline">
                      Click to upload
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, JPG, PNG (max 10MB each)
                  </p>
                </div>
                {formData.files.length > 0 && (
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm text-[#0F172A] font-medium truncate flex-1">
                          {file.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-[#0F172A]">
                  Preferred Contact Method
                </Label>
                <div className="space-y-3">
                  {['email', 'phone', 'whatsapp'].map((method) => (
                    <div key={method} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-[#B49162] hover:bg-[#B49162]/5 transition-all">
                      <Checkbox
                        id={method}
                        checked={formData.preferredContact.includes(method)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('preferredContact', [
                              ...formData.preferredContact,
                              method,
                            ]);
                          } else {
                            updateFormData(
                              'preferredContact',
                              formData.preferredContact.filter((m) => m !== method)
                            );
                          }
                        }}
                        className="border-gray-300 data-[state=checked]:bg-[#B49162] data-[state=checked]:border-[#B49162]"
                      />
                      <label
                        htmlFor={method}
                        className="text-sm font-medium text-[#0F172A] leading-none cursor-pointer capitalize flex-1"
                      >
                        {method}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-[#B49162] hover:bg-[#B49162]/5 transition-all">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => updateFormData('newsletter', checked)}
                  className="border-gray-300 data-[state=checked]:bg-[#B49162] data-[state=checked]:border-[#B49162]"
                />
                <label
                  htmlFor="newsletter"
                  className="text-sm font-medium text-[#0F172A] leading-relaxed cursor-pointer flex-1"
                >
                  Subscribe to our newsletter for updates and offers
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="flex items-center justify-center gap-2 border-gray-300 text-[#0F172A] hover:bg-gray-50 min-w-[100px]"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back</span>
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              className="bg-[#B49162] hover:bg-[#9A7A4F] text-white flex items-center justify-center gap-2 h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-all min-w-[120px]"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#B49162] hover:bg-[#9A7A4F] text-white flex items-center justify-center gap-2 h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-all min-w-[160px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Send Message</span>
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

