'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
  ArrowRight,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface ServiceStatusProps {
  service: {
    id: number;
    status: string;
    created_at: string;
    updated_at?: string;
    message?: string;
  };
}

const statusSteps = [
  { key: 'new', label: 'New Request', icon: Circle, color: 'text-gray-500' },
  { key: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-500' },
  {
    key: 'contacted',
    label: 'Contacted',
    icon: AlertCircle,
    color: 'text-blue-500',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    icon: Clock,
    color: 'text-blue-500',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: CheckCircle2,
    color: 'text-green-500',
  },
  { key: 'closed', label: 'Closed', icon: CheckCircle2, color: 'text-green-500' },
];

export function ServiceStatus({ service }: ServiceStatusProps) {
  const currentStepIndex = useMemo(() => {
    return statusSteps.findIndex((step) => step.key === service.status);
  }, [service.status]);

  const progress = useMemo(() => {
    if (currentStepIndex === -1) return 0;
    return ((currentStepIndex + 1) / statusSteps.length) * 100;
  }, [currentStepIndex]);

  const getStatusBadge = () => {
    switch (service.status) {
      case 'completed':
      case 'closed':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Done
          </Badge>
        );
      case 'in_progress':
      case 'contacted':
        return (
          <Badge className="bg-blue-500 text-white">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="border-gray-200 dark:border-primary-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            Service Status
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-primary dark:text-white">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Status Timeline */}
        <div className="space-y-4">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                {/* Icon */}
                <div
                  className={cn(
                    'p-2 rounded-full transition-colors',
                    isCompleted && 'bg-green-100 dark:bg-green-900/30',
                    isCurrent && 'bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500',
                    isPending && 'bg-gray-100 dark:bg-primary-700'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5',
                      isCompleted && 'text-green-600 dark:text-green-400',
                      isCurrent && 'text-blue-600 dark:text-blue-400',
                      isPending && 'text-gray-400'
                    )}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p
                      className={cn(
                        'text-sm font-semibold',
                        isCompleted && 'text-green-700 dark:text-green-400',
                        isCurrent && 'text-blue-700 dark:text-blue-400',
                        isPending && 'text-gray-500 dark:text-gray-500'
                      )}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <Badge variant="outline" className="text-xs border-blue-500 text-blue-700">
                        Current
                      </Badge>
                    )}
                  </div>
                  {isCurrent && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Last updated:{' '}
                      {formatDistanceToNow(new Date(service.updated_at || service.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                {index < statusSteps.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200 dark:bg-primary-700" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Estimated Completion */}
        {service.status === 'in_progress' || service.status === 'contacted' ? (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                  Service in Progress
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Our team is working on your request. You'll be notified when it's completed.
                </p>
              </div>
            </div>
          </div>
        ) : service.status === 'completed' || service.status === 'closed' ? (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">
                  Service Completed
                </p>
                <p className="text-xs text-green-700 dark:text-green-400">
                  This service request has been completed successfully.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

