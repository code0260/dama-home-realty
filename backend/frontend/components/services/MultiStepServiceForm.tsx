'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  AlertCircle,
  CheckCircle2,
  Send,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Upload,
  FileText,
  User,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { submitServiceRequest } from '@/lib/api';

interface MultiStepServiceFormProps {
  service: Service | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FormData {
  // Step 1: Personal Info
  name: string;
  email: string;
  phone: string;
  
  // Step 2: Service Details
  preferredDate: string;
  preferredTime: string;
  urgency: 'low' | 'medium' | 'high';
  location?: string;
  
  // Step 3: Additional Info
  message: string;
  files: File[];
  
  // Step 4: Confirmation
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Service Details', icon: Calendar },
  { id: 3, title: 'Additional Info', icon: MessageSquare },
  { id: 4, title: 'Confirmation', icon: CheckCircle2 },
];

export function MultiStepServiceForm({
  service,
  open,
  onOpenChange,
  onSuccess,
}: MultiStepServiceFormProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    urgency: 'medium',
    location: '',
    message: '',
    files: [],
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-fill from profile
  useEffect(() => {
    if (user && open && currentStep === 1) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user, open, currentStep]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        urgency: 'medium',
        location: '',
        message: service?.title ? `I'm interested in ${service.title}.` : '',
        files: [],
        agreeToTerms: false,
        agreeToMarketing: false,
      });
      setErrors({});
      setSuccess(false);
    }
  }, [open, service]);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    }

    if (step === 2) {
      if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
    }

    if (step === 4) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...files].slice(0, 5), // Max 5 files
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    try {
      // Prepare form data for submission
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('email', formData.email);
      submissionData.append('phone', formData.phone);
      submissionData.append('message', formData.message);
      
      if (service?.id) {
        submissionData.append('service_id', service.id.toString());
      }
      
      if (formData.preferredDate) {
        submissionData.append('preferred_date', formData.preferredDate);
      }
      if (formData.preferredTime) {
        submissionData.append('preferred_time', formData.preferredTime);
      }
      if (formData.urgency) {
        submissionData.append('urgency', formData.urgency);
      }
      if (formData.location) {
        submissionData.append('location', formData.location);
      }

      // Append files
      formData.files.forEach((file) => {
        submissionData.append('files[]', file);
      });

      await submitServiceRequest(submissionData);
      
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      setErrors({
        message: error.response?.data?.message || 'Failed to submit request. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-primary dark:text-white">
            Request Service
          </DialogTitle>
          <DialogDescription className="text-base text-slate-600 dark:text-slate-400">
            {service?.title && (
              <span className="font-semibold text-secondary">{service.title}</span>
            )}
            <br />
            Fill out the form below and we'll get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
                        isActive
                          ? 'bg-secondary text-white shadow-lg scale-110'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-primary-700 text-gray-500 dark:text-gray-400'
                      )}
                    >
                      <StepIcon className="w-5 h-5" />
                    </div>
                    <span
                      className={cn(
                        'text-xs mt-1 hidden sm:block',
                        isActive
                          ? 'font-semibold text-secondary'
                          : 'text-gray-500 dark:text-gray-400'
                      )}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        'h-1 flex-1 mx-2 transition-all duration-300',
                        isCompleted ? 'bg-secondary' : 'bg-gray-200 dark:bg-primary-700'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="mt-2" />
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
                Request submitted successfully! We will contact you soon.
              </AlertDescription>
            </Alert>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-secondary" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>
                        Please provide your contact information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="John Doe"
                          className={cn(errors.name && 'border-red-500')}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="john@example.com"
                          className={cn(errors.email && 'border-red-500')}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Phone / WhatsApp <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+963 123 456 789"
                          className={cn(errors.phone && 'border-red-500')}
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-500">{errors.phone}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Service Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-secondary" />
                        Service Details
                      </CardTitle>
                      <CardDescription>
                        When and where do you need the service?
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate">
                          Preferred Date <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="preferredDate"
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) =>
                            setFormData({ ...formData, preferredDate: e.target.value })
                          }
                          min={new Date().toISOString().split('T')[0]}
                          className={cn(errors.preferredDate && 'border-red-500')}
                        />
                        {errors.preferredDate && (
                          <p className="text-sm text-red-500">{errors.preferredDate}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Time</Label>
                        <Input
                          id="preferredTime"
                          type="time"
                          value={formData.preferredTime}
                          onChange={(e) =>
                            setFormData({ ...formData, preferredTime: e.target.value })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="urgency">Urgency Level</Label>
                        <RadioGroup
                          value={formData.urgency}
                          onValueChange={(value: 'low' | 'medium' | 'high') =>
                            setFormData({ ...formData, urgency: value })
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="low" id="low" />
                            <Label htmlFor="low" className="font-normal cursor-pointer">
                              Low - Flexible timing
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium" className="font-normal cursor-pointer">
                              Medium - Within a week
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high" id="high" />
                            <Label htmlFor="high" className="font-normal cursor-pointer">
                              High - Urgent (24-48 hours)
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {service?.locations && service.locations.length > 0 && (
                        <div className="space-y-2">
                          <Label htmlFor="location">Location (optional)</Label>
                          <select
                            id="location"
                            value={formData.location}
                            onChange={(e) =>
                              setFormData({ ...formData, location: e.target.value })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select location</option>
                            {service.locations.map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Additional Info */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-secondary" />
                        Additional Information
                      </CardTitle>
                      <CardDescription>
                        Tell us more about your requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="message">
                          Message <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          rows={5}
                          placeholder="Tell us about your requirements..."
                          className={cn(errors.message && 'border-red-500')}
                        />
                        {errors.message && (
                          <p className="text-sm text-red-500">{errors.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="files">
                          Attachments (optional, max 5 files)
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="files"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('files')?.click()}
                            className="w-full"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Files
                          </Button>
                        </div>
                        {formData.files.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {formData.files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-primary-800 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {file.name}
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                        Review & Confirm
                      </CardTitle>
                      <CardDescription>
                        Please review your information before submitting
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3 p-4 bg-gray-50 dark:bg-primary-800 rounded-lg">
                        <div>
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Name:
                          </span>
                          <p className="text-primary dark:text-white">{formData.name}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Email:
                          </span>
                          <p className="text-primary dark:text-white">{formData.email}</p>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Phone:
                          </span>
                          <p className="text-primary dark:text-white">{formData.phone}</p>
                        </div>
                        {formData.preferredDate && (
                          <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              Preferred Date:
                            </span>
                            <p className="text-primary dark:text-white">
                              {new Date(formData.preferredDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {formData.message && (
                          <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              Message:
                            </span>
                            <p className="text-primary dark:text-white">{formData.message}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, agreeToTerms: !!checked })
                            }
                          />
                          <Label
                            htmlFor="terms"
                            className="text-sm font-normal cursor-pointer leading-relaxed"
                          >
                            I agree to the{' '}
                            <a href="/terms" className="text-secondary hover:underline">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-secondary hover:underline">
                              Privacy Policy
                            </a>
                            <span className="text-red-500">*</span>
                          </Label>
                        </div>
                        {errors.agreeToTerms && (
                          <p className="text-sm text-red-500">{errors.agreeToTerms}</p>
                        )}

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="marketing"
                            checked={formData.agreeToMarketing}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, agreeToMarketing: !!checked })
                            }
                          />
                          <Label
                            htmlFor="marketing"
                            className="text-sm font-normal cursor-pointer leading-relaxed"
                          >
                            I would like to receive updates and marketing communications
                          </Label>
                        </div>
                      </div>

                      {errors.message && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{errors.message}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-secondary hover:bg-secondary/90"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 bg-secondary hover:bg-secondary/90"
                >
                  {submitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Request
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

