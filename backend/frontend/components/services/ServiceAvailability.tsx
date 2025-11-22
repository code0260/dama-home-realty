'use client';

import { motion } from 'framer-motion';
import { Service } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, XCircle, Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceAvailabilityProps {
  service: Service;
  className?: string;
}

const getAvailabilityConfig = (availability: Service['availability']) => {
  switch (availability) {
    case 'available':
      return {
        icon: CheckCircle2,
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        text: 'Available Now',
        description: 'This service is currently available and ready to book',
      };
    case 'limited':
      return {
        icon: AlertCircle,
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        text: 'Limited Availability',
        description: 'Limited slots available. Book soon to secure your spot',
      };
    case 'unavailable':
      return {
        icon: XCircle,
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        text: 'Currently Unavailable',
        description: 'This service is currently not available. Check back later',
      };
    default:
      return null;
  }
};

export function ServiceAvailability({ service, className }: ServiceAvailabilityProps) {
  const availability = getAvailabilityConfig(service.availability);

  if (!availability) {
    return null;
  }

  const Icon = availability.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(className)}
    >
      <Card className={cn('border-2', availability.bgColor, availability.color.includes('green') && 'border-green-200 dark:border-green-800')}>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={cn('p-3 rounded-full', availability.color)}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-primary dark:text-white flex items-center gap-2">
                Service Availability
                <Badge className={cn('text-xs', availability.color)}>
                  {availability.text}
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-700 dark:text-gray-300 mt-1">
                {availability.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {service.duration && (
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-primary-800 rounded-lg">
                <Clock className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="text-lg font-bold text-primary dark:text-white">{service.duration}</p>
                </div>
              </div>
            )}

            {service.availability === 'available' && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Ready to book immediately</span>
              </div>
            )}

            {service.availability === 'limited' && (
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                  ⚠️ Limited slots available. We recommend booking in advance to secure your preferred date and time.
                </p>
              </div>
            )}

            {service.availability === 'unavailable' && (
              <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                  This service is temporarily unavailable. Please check back later or contact us for more information.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

