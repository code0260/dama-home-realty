'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Service } from '@/types';
import { getServices, submitServiceRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, Settings, Send } from 'lucide-react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceBenefits } from '@/components/services/ServiceBenefits';
import { ServiceProcess } from '@/components/services/ServiceProcess';
import { EmptyState } from '@/components/empty/EmptyState';
import { MultiStepServiceForm } from '@/components/services/MultiStepServiceForm';
import { ServiceComparison } from '@/components/services/ServiceComparison';
import { FAQSection } from '@/components/services/FAQSection';
import { cn } from '@/lib/utils';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getServices();
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setDialogOpen(true);
    setFormData({
      name: '',
      phone: '',
      message: `I'm interested in ${service.title}.`,
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await submitServiceRequest(formData);
      setSuccess(true);
      setTimeout(() => {
        setDialogOpen(false);
        setSuccess(false);
        setFormData({ name: '', phone: '', message: '' });
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to submit request. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Hero Section */}
      <section className="py-20 md:py-24 bg-linear-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
              Premium Real Estate Services
            </h1>
            <p className="text-lg md:text-xl text-slate-600 font-light">
              Comprehensive solutions for all your real estate needs in Damascus
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[280px] rounded-xl" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <EmptyState
              icon={Settings}
              title="No Services Available"
              description="Services will be available soon. Please check back later."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ServiceCard service={service} onRequest={handleServiceClick} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Service Benefits */}
      <ServiceBenefits />

      {/* Service Process */}
      <ServiceProcess />

      {/* Service Comparison - Show if 2+ services selected */}
      {showComparison && services.length >= 2 && (
        <ServiceComparison
          services={services}
          onClose={() => setShowComparison(false)}
          onSelectService={(service) => {
            setSelectedService(service);
            setDialogOpen(true);
            setShowComparison(false);
          }}
        />
      )}

      {/* FAQ Section - Collect FAQs from all services */}
      {services.length > 0 && services.some((s) => s.faq && s.faq.length > 0) && (
        <FAQSection
          faqs={services
            .flatMap((s) => s.faq || [])
            .filter((faq, index, self) => self.findIndex((f) => f.id === faq.id) === index)}
        />
      )}

      {/* Multi-Step Service Request Form */}
      <MultiStepServiceForm
        service={selectedService}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setSuccess(true);
          setTimeout(() => {
            setDialogOpen(false);
            setSuccess(false);
            setFormData({ name: '', phone: '', message: '' });
          }, 2000);
        }}
      />
    </div>
  );
}
