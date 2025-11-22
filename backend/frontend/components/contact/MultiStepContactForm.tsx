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

interface FormData {
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
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [formData, setFormData] = useState<FormData>({
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
    const newErrors: Partial<Record<keyof FormData, string>> = {};

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
    try {
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

      await axiosInstance.post('/contact', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Track form submission (analytics)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'contact_form_submit', {
          event_category: 'Contact',
          event_label: formData.inquiryType,
        });
      }

      onSuccess?.();
      setCurrentStep(steps.length + 1); // Success step
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ message: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  if (currentStep > steps.length) {
    // Success step
    return (
      <Card className={className}>
        <CardContent className="p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-2">
              Message Sent Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              A confirmation email has been sent to {formData.email}
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
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <CurrentStepIcon className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-primary dark:text-white">
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
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="John Doe"
                  className={errors.name ? 'border-red-500' : ''}
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
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
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
                <Label htmlFor="inquiryType">Inquiry Type *</Label>
                <Select
                  value={formData.inquiryType}
                  onValueChange={(value) => updateFormData('inquiryType', value)}
                >
                  <SelectTrigger className={errors.inquiryType ? 'border-red-500' : ''}>
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
                {errors.inquiryType && <p className="text-sm text-red-500">{errors.inquiryType}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => updateFormData('subject', e.target.value)}
                  placeholder="What is this regarding?"
                  className={errors.subject ? 'border-red-500' : ''}
                />
                {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => updateFormData('priority', value)}
                >
                  <SelectTrigger>
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
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => updateFormData('message', e.target.value)}
                  placeholder="Tell us how we can help..."
                  rows={6}
                  className={errors.message ? 'border-red-500' : ''}
                />
                {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
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
                <Label htmlFor="propertyId">Property ID (if applicable)</Label>
                <Input
                  id="propertyId"
                  value={formData.propertyId}
                  onChange={(e) => updateFormData('propertyId', e.target.value)}
                  placeholder="PROP-12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location of Interest</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData('location', e.target.value)}
                  placeholder="Damascus, Syria"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget (optional)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => updateFormData('budget', e.target.value)}
                  placeholder="10000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Select
                  value={formData.timeline}
                  onValueChange={(value) => updateFormData('timeline', value)}
                >
                  <SelectTrigger>
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
                <Label>Upload Files (optional, max 5 files)</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-primary-700 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-sm text-secondary font-semibold">
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
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-primary-800 rounded-lg"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {file.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Preferred Contact Method</Label>
                <div className="space-y-2">
                  {['email', 'phone', 'whatsapp'].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
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
                      />
                      <label
                        htmlFor={method}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                      >
                        {method}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletter"
                  checked={formData.newsletter}
                  onCheckedChange={(checked) => updateFormData('newsletter', checked)}
                />
                <label
                  htmlFor="newsletter"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Subscribe to our newsletter for updates and offers
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-primary-700">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={handleNext}
              className="bg-secondary hover:bg-secondary/90 flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-secondary hover:bg-secondary/90 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Send Message
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

