'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Service } from '@/types';
import { getServiceBySlug } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { ServicePackages } from '@/components/services/ServicePackages';
import { ServiceReviews } from '@/components/services/ServiceReviews';
import { FAQSection } from '@/components/services/FAQSection';
import { MultiStepServiceForm } from '@/components/services/MultiStepServiceForm';
import { ServiceAvailability } from '@/components/services/ServiceAvailability';
import { ServiceLocations } from '@/components/services/ServiceLocations';
import Image from 'next/image';

interface ServiceDetailsClientProps {
  slug: string;
}

const formatPrice = (price: number | null | undefined, currency: 'USD' | 'SYP' | null | undefined) => {
  if (!price) return null;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return currency === 'USD' ? `$${formattedPrice}` : `${formattedPrice} ${currency}`;
};

const getAvailabilityBadge = (availability: Service['availability']) => {
  switch (availability) {
    case 'available':
      return { icon: CheckCircle2, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: 'Available' };
    case 'limited':
      return { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', text: 'Limited Availability' };
    case 'unavailable':
      return { icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', text: 'Unavailable' };
    default:
      return null;
  }
};

export default function ServiceDetailsClient({ slug }: ServiceDetailsClientProps) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getServiceBySlug(slug);
        setService(data);
      } catch (err: any) {
        console.error('Error fetching service:', err);
        setError(err.response?.status === 404 ? 'Service not found' : 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchService();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-96 w-full mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-bold text-primary dark:text-white mb-4">Service Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'The service you are looking for does not exist.'}</p>
        <Button asChild>
          <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    );
  }

  const price = formatPrice(service.price, service.currency);
  const availabilityBadge = getAvailabilityBadge(service.availability);

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/services">Services</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">{service.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Hero Section */}
          <div className="mb-12">
            {service.image && (
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {service.category && (
                    <Badge variant="outline" className="text-sm">
                      {service.category}
                    </Badge>
                  )}
                  {availabilityBadge && (
                    <Badge className={availabilityBadge.color}>
                      <availabilityBadge.icon className="w-3 h-3 mr-1" />
                      {availabilityBadge.text}
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
                  {service.title}
                </h1>
                
                {service.description && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    {service.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                  {price && (
                    <div className="flex items-center gap-2 font-semibold text-secondary">
                      <DollarSign className="w-5 h-5" />
                      {price}
                    </div>
                  )}
                  {service.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {service.duration}
                    </div>
                  )}
                  {service.locations && service.locations.length > 0 && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {service.locations.length} location(s)
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <div className="shrink-0">
                <Button
                  onClick={() => setFormOpen(true)}
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg"
                  size="lg"
                >
                  Request Service
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 space-y-8">
              {/* Availability */}
              {service.availability && (
                <ServiceAvailability service={service} />
              )}

              {/* Locations */}
              {service.locations && service.locations.length > 0 && (
                <ServiceLocations locations={service.locations} />
              )}

              {/* Packages */}
              {service.packages && service.packages.length > 0 && (
                <ServicePackages
                  packages={service.packages}
                  onSelectPackage={(pkg) => {
                    setFormOpen(true);
                    // You can pre-fill form with package info here
                  }}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Info Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl shadow-xl bg-white dark:bg-primary-800 border border-gray-200 dark:border-primary-700 p-6"
                >
                  <h3 className="text-xl font-bold text-primary dark:text-white mb-4">
                    Quick Info
                  </h3>
                  <div className="space-y-3">
                    {price && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Price</span>
                        <span className="font-semibold text-secondary">{price}</span>
                      </div>
                    )}
                    {service.duration && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration</span>
                        <span className="font-semibold text-primary dark:text-white">{service.duration}</span>
                      </div>
                    )}
                    {service.category && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Category</span>
                        <span className="font-semibold text-primary dark:text-white">{service.category}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          {/* Note: Reviews would come from a separate API call */}
          {/* <ServiceReviews reviews={[]} serviceTitle={service.title} /> */}

          {/* FAQ */}
          {service.faq && service.faq.length > 0 && (
            <FAQSection faqs={service.faq} />
          )}
        </div>
      </div>

      {/* Request Form Modal */}
      <MultiStepServiceForm
        service={service}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => {
          setFormOpen(false);
        }}
      />
    </>
  );
}

