'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Filter,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ServiceHistoryProps {
  services: any[];
  onServiceClick?: (service: any) => void;
}

export function ServiceHistory({ services, onServiceClick }: ServiceHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'completed') {
        filtered = filtered.filter(
          (s) => s.status === 'completed' || s.status === 'closed'
        );
      } else {
        filtered = filtered.filter((s) => s.status === statusFilter);
      }
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at).getTime() -
        new Date(a.updated_at || a.created_at).getTime()
    );
  }, [services, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'closed':
      case 'completed':
        return (
          <Badge className="bg-green-500 text-white text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Done
          </Badge>
        );
      case 'contacted':
      case 'in_progress':
        return (
          <Badge className="bg-blue-500 text-white text-xs">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500 text-white text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (filteredServices.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-primary-700">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            Service History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
            No service history available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-gray-200 dark:border-primary-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            Service History
          </CardTitle>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onServiceClick?.(service)}
                className={cn(
                  'p-4 rounded-lg border transition-all cursor-pointer',
                  'hover:shadow-md hover:border-secondary/30',
                  'bg-white dark:bg-primary-900 border-gray-200 dark:border-primary-700'
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <MessageCircle className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-primary dark:text-white truncate">
                        Service Request #{service.id}
                      </p>
                      {service.property?.title && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {service.property.title}
                        </p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(service.status)}
                </div>
                {service.message && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {service.message}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {format(new Date(service.updated_at || service.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <span>
                    {formatDistanceToNow(new Date(service.updated_at || service.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

