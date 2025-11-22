'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sparkles,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ServiceRequest {
  id: number;
  message?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  property?: { title?: string };
  service_type?: string;
}

interface ServiceRequestsProps {
  services: ServiceRequest[];
  onServiceClick?: (service: ServiceRequest) => void;
}

export function ServiceRequests({ services, onServiceClick }: ServiceRequestsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.property?.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((service) => service.status === statusFilter);
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at).getTime() -
        new Date(a.updated_at || a.created_at).getTime()
    );
  }, [services, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'closed':
      case 'completed':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Done
          </Badge>
        );
      case 'contacted':
      case 'in_progress':
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

  const stats = useMemo(() => {
    return {
      total: services.length,
      pending: services.filter((s) => s.status === 'new' || s.status === 'pending').length,
      inProgress: services.filter((s) => s.status === 'contacted' || s.status === 'in_progress')
        .length,
      completed: services.filter((s) => s.status === 'closed' || s.status === 'completed').length,
    };
  }, [services]);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-secondary" />
            Service Requests
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your service requests
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1">
            Total: {stats.total}
          </Badge>
          <Badge className="bg-yellow-500 text-white px-3 py-1">
            Pending: {stats.pending}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 dark:border-primary-700">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card className="border-gray-200 dark:border-primary-700">
          <CardContent className="py-16 text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-2">
              No service requests found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'You don\'t have any service requests yet'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link href="/services">Request a Service</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => onServiceClick?.(service)}
              className="cursor-pointer"
            >
              <Card className="hover:shadow-lg transition-shadow border-gray-200 dark:border-primary-700 h-full">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg text-primary dark:text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-secondary" />
                      Service Request
                    </CardTitle>
                    {getStatusBadge(service.status)}
                  </div>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(new Date(service.updated_at || service.created_at), {
                      addSuffix: true,
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {service.property?.title && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                          Property
                        </p>
                        <p className="text-sm font-semibold text-primary dark:text-white">
                          {service.property.title}
                        </p>
                      </div>
                    )}
                    {service.service_type && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                          Service Type
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {service.service_type}
                        </Badge>
                      </div>
                    )}
                    {service.message && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Message</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                          {service.message}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

