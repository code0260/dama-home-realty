'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Briefcase,
  Scale,
  Car,
  Home,
  Wrench,
  FileText,
  Building2,
  ArrowRight,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface ServiceCardProps {
  service: Service;
  onRequest: (service: Service) => void;
  viewMode?: 'grid' | 'list';
}

const iconMap: Record<string, LucideIcon> = {
  'heroicon-o-briefcase': Briefcase,
  'heroicon-o-scale': Scale,
  'heroicon-o-car': Car,
  'heroicon-o-home': Home,
  'heroicon-o-wrench': Wrench,
  'heroicon-o-file-text': FileText,
  'heroicon-o-building': Building2,
};

const formatPrice = (price: number | null | undefined, currency: 'USD' | 'SYP' | null | undefined) => {
  if (!price) return null;
  const formattedPrice = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return currency === 'USD' ? `$${formattedPrice}` : `${formattedPrice} ${currency}`;
};

export function ServiceCard({ service, onRequest, viewMode = 'grid' }: ServiceCardProps) {
  const { t, locale } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const getTranslation = (key: string, fallbackAr: string, fallbackEn: string) => {
    const translation = t(key);
    if (translation === key) {
      return locale === 'ar' ? fallbackAr : fallbackEn;
    }
    return translation;
  };

  const getAvailabilityBadge = (availability: Service['availability']) => {
    switch (availability) {
      case 'available':
        return { icon: CheckCircle2, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', text: getTranslation('contact.available', 'متاح', 'Available') };
      case 'limited':
        return { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', text: getTranslation('contact.limited', 'محدود', 'Limited') };
      case 'unavailable':
        return { icon: XCircle, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', text: getTranslation('contact.unavailable', 'غير متاح', 'Unavailable') };
      default:
        return null;
    }
  };

  const IconComponent =
    service.icon && iconMap[service.icon] ? iconMap[service.icon] : Briefcase;
  
  const price = formatPrice(service.price, service.currency);
  const availabilityBadge = getAvailabilityBadge(service.availability);

  // List view layout
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={cn(
          'flex items-center gap-6 p-6',
          'bg-white dark:bg-primary-800 border border-gray-200 dark:border-primary-700',
          'rounded-xl transition-all duration-300',
          isHovered ? 'shadow-lg border-secondary/30' : 'shadow-sm'
        )}>
          {/* Icon */}
          <div className="shrink-0">
            <div className={cn(
              'p-4 rounded-full bg-secondary/10 transition-all duration-300',
              isHovered && 'bg-secondary/20 scale-110'
            )}>
              <IconComponent className="w-8 h-8 text-secondary" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-primary dark:text-white">
                    {service.title}
                  </h3>
                  {service.category && (
                    <Badge variant="outline" className="text-xs">
                      {service.category}
                    </Badge>
                  )}
                  {availabilityBadge && (
                    <Badge className={cn('text-xs', availabilityBadge.color)}>
                      <availabilityBadge.icon className="w-3 h-3 mr-1" />
                      {availabilityBadge.text}
                    </Badge>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {service.description}
                  </p>
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {price && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-secondary">{price}</span>
                </div>
              )}
              {service.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}</span>
                </div>
              )}
              {service.locations && service.locations.length > 0 && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{service.locations.length} {getTranslation('contact.locations', 'مواقع', 'locations')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="shrink-0 flex gap-2">
            {service.slug && (
              <Button variant="outline" asChild size="sm">
                <Link href={`/services/${service.slug}`}>
                  {getTranslation('contact.viewDetails', 'عرض التفاصيل', 'View Details')}
                </Link>
              </Button>
            )}
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRequest(service);
              }}
              className={cn("bg-secondary hover:bg-secondary/90", locale === 'ar' && 'flex-row-reverse')}
              size="sm"
            >
              {getTranslation('contact.request', 'طلب', 'Request')}
              <ArrowRight className={cn("w-4 h-4", locale === 'ar' ? 'mr-1 rotate-180' : 'ml-1')} />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative group cursor-pointer h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Card Container - White Background with Subtle Border */}
      <motion.div
        className={cn(
          'relative w-full h-full min-h-[280px]',
          'bg-white border border-gray-200',
          'rounded-xl overflow-hidden',
          'transition-all duration-300',
          'flex flex-col',
          // Hover state: increased shadow
          isHovered
            ? 'shadow-xl border-secondary/20'
            : 'shadow-sm hover:shadow-md'
        )}
      >
        {/* Normal State: Minimalist Icon + Title */}
        <AnimatePresence mode="wait">
          {!isHovered ? (
            <motion.div
              key="default"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center h-full p-8"
            >
              {/* Icon - Bronze */}
              <motion.div
                className="mb-6 p-4 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <IconComponent className="w-12 h-12 text-secondary" />
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-bold text-primary dark:text-white text-center mb-2">
                {service.title}
              </h3>
              
              {/* Category Badge */}
              {service.category && (
                <Badge variant="outline" className="text-xs mb-2">
                  {service.category}
                </Badge>
              )}
              
              {/* Price & Duration */}
              {(price || service.duration) && (
                <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {price && (
                    <div className="flex items-center gap-1 font-semibold text-secondary">
                      <DollarSign className="w-4 h-4" />
                      {price}
                    </div>
                  )}
                  {service.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="hovered"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full p-6"
            >
              {/* Icon at top */}
              <div className="mb-4 flex items-center justify-between">
                <div className="p-3 rounded-full bg-secondary/10 w-fit">
                  <IconComponent className="w-8 h-8 text-secondary" />
                </div>
                {availabilityBadge && (
                  <Badge className={cn('text-xs', availabilityBadge.color)}>
                    <availabilityBadge.icon className="w-3 h-3 mr-1" />
                    {availabilityBadge.text}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 mb-6">
                <div className="flex items-start gap-2 mb-2">
                  <h3 className="text-xl font-bold text-primary dark:text-white">
                    {service.title}
                  </h3>
                  {service.category && (
                    <Badge variant="outline" className="text-xs">
                      {service.category}
                    </Badge>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-3">
                    {service.description}
                  </p>
                )}
                
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {price && (
                    <div className="flex items-center gap-1 font-semibold text-secondary">
                      <DollarSign className="w-4 h-4" />
                      {price}
                    </div>
                  )}
                  {service.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration}
                    </div>
                  )}
                  {service.locations && service.locations.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{service.locations.length} {getTranslation('contact.locations', 'مواقع', 'locations')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Learn More / Request Button - Appears on Hover */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequest(service);
                  }}
                  className={cn(
                    'w-full bg-secondary hover:bg-secondary/90 text-white',
                    'shadow-md hover:shadow-lg',
                    'transition-all duration-200',
                    'font-semibold',
                    'flex items-center justify-center gap-2',
                    locale === 'ar' && 'flex-row-reverse'
                  )}
                  size="lg"
                >
                  {getTranslation('contact.requestService', 'طلب خدمة', 'Request Service')}
                  <ArrowRight className={cn("w-4 h-4", locale === 'ar' && 'rotate-180')} />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
