'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Home,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Info,
  Lightbulb,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageUpload } from './ImageUpload';
import { LocationPicker } from './LocationPicker';
import { PriceSuggestion } from './PriceSuggestion';
import axiosInstance from '@/lib/axios';
import { Property } from '@/types';

interface PropertyFormData {
  // Step 1: Basic Information
  title: string;
  type: 'rent' | 'sale' | 'hotel';
  description: string;
  
  // Step 2: Location
  neighborhood_id: string;
  address: string;
  latitude?: number;
  longitude?: number;
  
  // Step 3: Property Details
  bedrooms: number;
  bathrooms: number;
  area_sqm: number;
  price: number;
  currency: 'USD' | 'SYP';
  amenities: string[];
  
  // Step 4: Media
  images: File[];
  video_url?: string;
  
  // Step 5: Contact & Status
  owner_contact: string;
  owner_name: string;
  owner_email: string;
  reference_id?: string;
  status: 'active' | 'draft' | 'pending';
}

interface MultiStepPropertyFormProps {
  property?: Property | null;
  onSuccess?: (property: Property) => void;
  className?: string;
}

const steps = [
  { id: 1, title: 'Basic Information', icon: Home },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Property Details', icon: FileText },
  { id: 4, title: 'Media', icon: ImageIcon },
  { id: 5, title: 'Contact & Status', icon: CheckCircle2 },
];

const availableAmenities = [
  'Parking',
  'Elevator',
  'Balcony',
  'Garden',
  'Swimming Pool',
  'Security',
  'Air Conditioning',
  'Heating',
  'Furnished',
  'Internet',
  'Solar Power',
  'Generator',
];

export function MultiStepPropertyForm({
  property,
  onSuccess,
  className,
}: MultiStepPropertyFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PropertyFormData, string>>>({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [priceSuggestion, setPriceSuggestion] = useState<number | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState<PropertyFormData>({
    title: property?.title || '',
    type: property?.type || 'rent',
    description: property?.description || '',
    neighborhood_id: property?.neighborhood?.id.toString() || '',
    address: '',
    latitude: undefined,
    longitude: undefined,
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    area_sqm: property?.area_sqm || 0,
    price: property?.price || 0,
    currency: property?.currency || 'USD',
    amenities: property?.amenities || [],
    images: [],
    video_url: property?.video_url || '',
    owner_contact: property?.owner_contact || '',
    owner_name: '',
    owner_email: '',
    reference_id: property?.reference_id || '',
    status: property ? 'active' : 'draft',
  });

  const progress = (currentStep / steps.length) * 100;

  // Auto-save draft
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveDraft();
    }, 5000); // Auto-save after 5 seconds of inactivity

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData]);

  const saveDraft = useCallback(async () => {
    try {
      // Prepare draft data with only filled fields
      const draftData: any = {
        status: 'draft',
      };

      // Only include fields that have values (except empty strings and empty arrays)
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              draftData[key] = value;
            }
          } else {
            draftData[key] = value;
          }
        }
      });

      // Ensure status is draft
      draftData.status = 'draft';

      if (property?.id) {
        // Update existing property
        await axiosInstance.put(`/properties/${property.id}`, draftData).catch((err) => {
          // Fallback: save to localStorage
          if (err.response?.status === 422 || err.response?.status === 404) {
            const existingDrafts = JSON.parse(localStorage.getItem('property_drafts') || '[]');
            const draftIndex = existingDrafts.findIndex((d: any) => d.id === property.id);
            if (draftIndex >= 0) {
              existingDrafts[draftIndex] = { ...existingDrafts[draftIndex], ...draftData };
            } else {
              existingDrafts.push({ id: property.id, ...draftData });
            }
            localStorage.setItem('property_drafts', JSON.stringify(existingDrafts));
            console.warn('API draft save failed, saved to localStorage');
          }
        });
      } else {
        // Save new draft using POST to /properties with status=draft
        // Store in localStorage as fallback if API fails
        await axiosInstance.post('/properties', draftData).catch((err) => {
          // Fallback: save to localStorage if API endpoint fails
          if (err.response?.status === 422 || err.response?.status === 405 || err.response?.status === 404) {
            const existingDrafts = JSON.parse(localStorage.getItem('property_drafts') || '[]');
            const draftId = `draft_${Date.now()}`;
            localStorage.setItem('property_drafts', JSON.stringify([...existingDrafts, { id: draftId, ...draftData }]));
            console.warn('API draft save failed, saved to localStorage');
          }
        });
      }
    } catch (error) {
      // Silently handle errors - draft saving should not interrupt user flow
      console.debug('Draft save error (handled silently):', error);
    }
  }, [formData, property]);

  const handleManualSave = async () => {
    setSaving(true);
    try {
      await saveDraft();
      // Show success message
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setSaving(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof PropertyFormData, string>> = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.type) newErrors.type = 'Property type is required';
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.length < 50) {
        newErrors.description = 'Description must be at least 50 characters';
      }
    }

    if (step === 2) {
      if (!formData.neighborhood_id) {
        newErrors.neighborhood_id = 'Location is required';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
    }

    if (step === 3) {
      if (!formData.bedrooms || formData.bedrooms < 0) {
        newErrors.bedrooms = 'Number of bedrooms is required';
      }
      if (!formData.bathrooms || formData.bathrooms < 0) {
        newErrors.bathrooms = 'Number of bathrooms is required';
      }
      if (!formData.area_sqm || formData.area_sqm <= 0) {
        newErrors.area_sqm = 'Area is required';
      }
      if (!formData.price || formData.price <= 0) {
        newErrors.price = 'Price is required';
      }
    }

    if (step === 4) {
      if (formData.images.length === 0) {
        newErrors.images = 'At least one image is required';
      }
    }

    if (step === 5) {
      if (!formData.owner_contact.trim()) {
        newErrors.owner_contact = 'Contact information is required';
      }
      if (!formData.owner_name.trim()) {
        newErrors.owner_name = 'Owner name is required';
      }
      if (!formData.owner_email.trim()) {
        newErrors.owner_email = 'Owner email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.owner_email)) {
        newErrors.owner_email = 'Invalid email format';
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

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setLoading(true);
    try {
      const submitData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          formData.images.forEach((file, index) => {
            submitData.append(`images[${index}]`, file);
          });
        } else if (key === 'amenities') {
          formData.amenities.forEach((amenity, index) => {
            submitData.append(`amenities[${index}]`, amenity);
          });
        } else if (value !== undefined && value !== null) {
          submitData.append(key, String(value));
        }
      });

      // Clear previous errors and success messages
      setSubmitError(null);
      setSubmitSuccess(null);

      const response = property?.id
        ? await axiosInstance.put(`/properties/${property.id}`, submitData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await axiosInstance.post('/properties', submitData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

      // Success message
      const successMessage = property?.id 
        ? 'تم تحديث العقار بنجاح! سيتم مراجعته من قبل الإدارة قريباً.'
        : 'تم إرسال طلب إضافة العقار بنجاح! سيتم مراجعته من قبل الإدارة قريباً.';
      
      setSubmitSuccess(successMessage);
      setSuccess(true);
      onSuccess?.(response.data);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        router.push(`/properties/${response.data.slug}`);
      }, 3000);
    } catch (error: any) {
      // Extract error message from response
      let errorMessage = 'فشل إرسال طلب إضافة العقار. يرجى المحاولة مرة أخرى.';
      
      if (error.response) {
        // Backend validation errors
        if (error.response.data?.errors) {
          const validationErrors = error.response.data.errors;
          const firstError = Object.values(validationErrors)[0];
          errorMessage = Array.isArray(firstError) 
            ? firstError[0] 
            : String(firstError);
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 422) {
          errorMessage = 'البيانات المدخلة غير صحيحة. يرجى التحقق من جميع الحقول وإعادة المحاولة.';
        } else if (error.response.status === 401) {
          errorMessage = 'يجب تسجيل الدخول أولاً لإضافة عقار.';
        } else if (error.response.status === 403) {
          errorMessage = 'ليس لديك صلاحية لإضافة عقار.';
        } else if (error.response.status === 500) {
          errorMessage = 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
        }
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        errorMessage = 'فشل الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'انتهت مهلة الاتصال. يرجى المحاولة مرة أخرى.';
      }

      setSubmitError(errorMessage);
      setErrors({
        ...errors,
        title: errorMessage,
      });

      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof PropertyFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  if (success) {
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
              Property Listed Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your property has been submitted and is now under review.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Redirecting to your property page...
            </p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const CurrentStepIcon = steps[currentStep - 1].icon;

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader>
        {/* Global Success/Error Messages */}
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
                {submitSuccess}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
                {submitError}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <CurrentStepIcon className="w-5 h-5 text-secondary" />
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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {formData.status === 'draft' ? 'Draft' : 'Active'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Draft
                </>
              )}
            </Button>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Your progress is automatically saved as a draft
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Information */}
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
                <Label htmlFor="type">Property Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'rent' | 'sale' | 'hotel') =>
                    updateFormData('type', value)
                  }
                >
                  <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="hotel">Hotel/Apartment</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  placeholder="e.g., Spacious 3-bedroom apartment in Damascus"
                  className={errors.title ? 'border-red-500' : ''}
                  disabled={loading}
                  required
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Describe your property in detail..."
                  rows={6}
                  className={errors.description ? 'border-red-500' : ''}
                  disabled={loading}
                  required
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
                <p className="text-xs text-gray-500">
                  {formData.description.length} / 500 characters (min. 50)
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <LocationPicker
                neighborhoodId={formData.neighborhood_id}
                address={formData.address}
                latitude={formData.latitude}
                longitude={formData.longitude}
                onNeighborhoodChange={(id) => updateFormData('neighborhood_id', id)}
                onAddressChange={(address) => updateFormData('address', address)}
                onLocationChange={(lat, lng) => {
                  updateFormData('latitude', lat);
                  updateFormData('longitude', lng);
                }}
                error={errors.neighborhood_id || errors.address}
              />
            </motion.div>
          )}

          {/* Step 3: Property Details */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => updateFormData('bedrooms', parseInt(e.target.value) || 0)}
                    className={errors.bedrooms ? 'border-red-500' : ''}
                    disabled={loading}
                    required
                  />
                  {errors.bedrooms && (
                    <p className="text-sm text-red-500">{errors.bedrooms}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => updateFormData('bathrooms', parseInt(e.target.value) || 0)}
                    className={errors.bathrooms ? 'border-red-500' : ''}
                    disabled={loading}
                    required
                  />
                  {errors.bathrooms && (
                    <p className="text-sm text-red-500">{errors.bathrooms}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area_sqm">Area (Square Meters) *</Label>
                <Input
                  id="area_sqm"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.area_sqm}
                  onChange={(e) => updateFormData('area_sqm', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 120"
                  className={errors.area_sqm ? 'border-red-500' : ''}
                  disabled={loading}
                  required
                />
                {errors.area_sqm && <p className="text-sm text-red-500">{errors.area_sqm}</p>}
              </div>

              {/* Price Suggestion */}
              {formData.area_sqm > 0 && formData.bedrooms > 0 && (
                <PriceSuggestion
                  type={formData.type}
                  area={formData.area_sqm}
                  bedrooms={formData.bedrooms}
                  onSuggestionChange={setPriceSuggestion}
                />
              )}

              <div className="space-y-2">
                <Label htmlFor="price" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-secondary" />
                  Price *
                  {priceSuggestion && (
                    <Badge variant="outline" className="text-xs">
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Suggested: {priceSuggestion.toLocaleString()} {formData.currency}
                    </Badge>
                  )}
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.currency}
                    onValueChange={(value: 'USD' | 'SYP') => updateFormData('currency', value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="SYP">SYP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
                    placeholder={priceSuggestion ? priceSuggestion.toString() : 'Enter price'}
                    className={cn('flex-1', errors.price && 'border-red-500')}
                    disabled={loading}
                    required
                  />
                  {priceSuggestion && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => updateFormData('price', priceSuggestion)}
                      className="whitespace-nowrap"
                    >
                      Use Suggested
                    </Button>
                  )}
                </div>
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <Label>Amenities *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableAmenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFormData('amenities', [...formData.amenities, amenity]);
                          } else {
                            updateFormData(
                              'amenities',
                              formData.amenities.filter((a) => a !== amenity)
                            );
                          }
                        }}
                        disabled={loading}
                      />
                      <label
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Media */}
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
                <Label>Property Images *</Label>
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => updateFormData('images', images)}
                  maxImages={20}
                  error={errors.images}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL (optional)</Label>
                <Input
                  id="video_url"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => updateFormData('video_url', e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  Add a YouTube or Vimeo link for a property tour video
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 5: Contact & Status */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Success Message */}
              {submitSuccess && (
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    {submitSuccess}
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {submitError && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    {submitError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="owner_name">Owner Name *</Label>
                <Input
                  id="owner_name"
                  value={formData.owner_name}
                  onChange={(e) => updateFormData('owner_name', e.target.value)}
                  placeholder="John Doe"
                  className={errors.owner_name ? 'border-red-500' : ''}
                  disabled={loading}
                  required
                />
                {errors.owner_name && (
                  <p className="text-sm text-red-500">{errors.owner_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_email">Owner Email *</Label>
                <Input
                  id="owner_email"
                  type="email"
                  value={formData.owner_email}
                  onChange={(e) => updateFormData('owner_email', e.target.value)}
                  placeholder="owner@example.com"
                  className={errors.owner_email ? 'border-red-500' : ''}
                  disabled={loading}
                  required
                />
                {errors.owner_email && (
                  <p className="text-sm text-red-500">{errors.owner_email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_contact">Contact Phone *</Label>
                <Input
                  id="owner_contact"
                  type="tel"
                  value={formData.owner_contact}
                  onChange={(e) => updateFormData('owner_contact', e.target.value)}
                  placeholder="+963 123 456 789"
                  className={errors.owner_contact ? 'border-red-500' : ''}
                  disabled={loading}
                  required
                />
                {errors.owner_contact && (
                  <p className="text-sm text-red-500">{errors.owner_contact}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference_id">Reference ID (optional)</Label>
                <Input
                  id="reference_id"
                  value={formData.reference_id}
                  onChange={(e) => updateFormData('reference_id', e.target.value)}
                  placeholder="PROP-2024-001"
                  disabled={loading}
                />
              </div>

              {property && (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'draft' | 'pending') =>
                      updateFormData('status', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending Review</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
              disabled={loading}
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
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  {property ? 'Update Property' : 'Submit Property'}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

