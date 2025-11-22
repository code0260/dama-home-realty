'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Property } from '@/types';
import axiosInstance from '@/lib/axios';

interface PropertyStatusProps {
  property: Property;
  onStatusChange?: (status: string) => void;
  className?: string;
}

const statusOptions = [
  { value: 'active', label: 'Active', icon: CheckCircle2, color: 'green' },
  { value: 'pending', label: 'Pending Review', icon: Clock, color: 'yellow' },
  { value: 'draft', label: 'Draft', icon: Info, color: 'gray' },
  { value: 'sold', label: 'Sold', icon: CheckCircle2, color: 'blue' },
  { value: 'rented', label: 'Rented', icon: CheckCircle2, color: 'purple' },
  { value: 'inactive', label: 'Inactive', icon: XCircle, color: 'red' },
];

export function PropertyStatus({
  property,
  onStatusChange,
  className,
}: PropertyStatusProps) {
  const [status, setStatus] = useState<string>(property.status || 'draft');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentStatus = statusOptions.find((s) => s.value === status) || statusOptions[0];
  const StatusIcon = currentStatus.icon;

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.patch(`/properties/${property.id || property.uuid}`, {
        status: newStatus,
      });
      
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to update status. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusValue: string) => {
    const statusOption = statusOptions.find((s) => s.value === statusValue);
    if (!statusOption) return 'gray';

    switch (statusOption.color) {
      case 'green':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
      case 'blue':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800';
      case 'red':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
          <StatusIcon
            className={cn(
              'w-5 h-5',
              status === 'active' && 'text-green-600',
              status === 'pending' && 'text-yellow-600',
              status === 'draft' && 'text-gray-600',
              status === 'sold' && 'text-blue-600',
              status === 'rented' && 'text-purple-600',
              status === 'inactive' && 'text-red-600'
            )}
          />
          Property Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Current Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-primary-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Badge className={cn('flex items-center gap-2', getStatusColor(status))}>
              <StatusIcon className="w-4 h-4" />
              {currentStatus.label}
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current status
            </span>
          </div>
        </div>

        {/* Status Selector */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-primary dark:text-white">
            Change Status
          </label>
          <Select value={status} onValueChange={(value) => handleStatusChange(value)} disabled={loading}>
            <SelectTrigger className={loading ? 'opacity-50 cursor-not-allowed' : ''}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <OptionIcon className="w-4 h-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating status...</span>
            </div>
          )}
        </div>

        {/* Status Information */}
        <div className="p-4 bg-secondary/10 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {status === 'active' && (
                <p>Your property is live and visible to all users.</p>
              )}
              {status === 'pending' && (
                <p>Your property is under review and will be published soon.</p>
              )}
              {status === 'draft' && (
                <p>Your property is saved as a draft and not visible to users.</p>
              )}
              {status === 'sold' && (
                <p>Your property has been sold and is no longer available.</p>
              )}
              {status === 'rented' && (
                <p>Your property has been rented and is no longer available.</p>
              )}
              {status === 'inactive' && (
                <p>Your property is inactive and not visible to users.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

