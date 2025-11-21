'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Service } from '@/types';
import { getServices, submitServiceRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, Settings } from 'lucide-react';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceBenefits } from '@/components/services/ServiceBenefits';
import { ServiceProcess } from '@/components/services/ServiceProcess';
import { EmptyState } from '@/components/empty/EmptyState';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getServices();
        // Ensure data is always an array
        setServices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setDialogOpen(true);
    setFormData({ name: '', phone: '', message: `I'm interested in ${service.title}` });
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
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Blob 1 - Top Left */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-[#B49162]/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Blob 2 - Top Right */}
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-[#B49162]/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />

        {/* Blob 3 - Bottom Left */}
        <motion.div
          className="absolute bottom-0 left-0 w-72 h-72 bg-[#B49162]/10 rounded-full blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Geometric Lines */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B49162" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>
          <line x1="0" y1="200" x2="200" y2="0" stroke="url(#lineGradient)" strokeWidth="2" />
          <line x1="200" y1="0" x2="400" y2="200" stroke="url(#lineGradient)" strokeWidth="2" />
          <line x1="100%" y1="300" x2="calc(100% - 200)" y2="100" stroke="url(#lineGradient)" strokeWidth="2" />
          <line x1="calc(100% - 200)" y1="100" x2="calc(100% - 400)" y2="300" stroke="url(#lineGradient)" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Comprehensive real estate services for expats in Damascus
            </motion.p>
          </div>
        </section>

        {/* Services Section with Zig-Zag Layout */}
        <section className="py-20 bg-white relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[300px] rounded-2xl" />
                ))}
              </div>
            ) : services.length === 0 ? (
              <EmptyState
                icon={Settings}
                title="No Services Available"
                description="Services will be available soon. Please check back later."
              />
            ) : (
              <div className="space-y-16">
                {services.map((service, index) => {
                  const isEven = index % 2 === 0;
                  
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`flex flex-col lg:flex-row gap-12 items-center ${
                        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      }`}
                    >
                      {/* Text Content */}
                      <div className={`flex-1 ${isEven ? 'lg:text-left' : 'lg:text-right'} text-center lg:text-left`}>
                        <motion.h2
                          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6 }}
                          className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6"
                        >
                          {service.title}
                        </motion.h2>
                        {service.description && (
                          <motion.p
                            initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-lg text-gray-600 leading-relaxed mb-8"
                          >
                            {service.description}
                          </motion.p>
                        )}
                        <motion.div
                          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          <Button
                            onClick={() => handleServiceClick(service)}
                            className="bg-[#B49162] hover:bg-[#9A7A4F] text-white shadow-lg px-8 py-6 text-lg"
                            size="lg"
                          >
                            Request Service
                          </Button>
                        </motion.div>
                      </div>

                      {/* Card Visual */}
                      <div className="flex-1 w-full max-w-md">
                        <ServiceCard service={service} onRequest={handleServiceClick} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Service Benefits */}
        <ServiceBenefits />

        {/* Service Process */}
        <ServiceProcess />
      </div>

      {/* Service Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Service: {selectedService?.title}</DialogTitle>
            <DialogDescription>
              Fill out the form below and we'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          {success ? (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Request submitted successfully! We will contact you soon.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone / WhatsApp</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  disabled={submitting}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

