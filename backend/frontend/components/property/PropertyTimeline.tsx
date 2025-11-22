'use client';

import { Calendar, MapPin, DollarSign, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Property } from '@/types';

interface PropertyTimelineProps {
  property: Property;
}

export function PropertyTimeline({ property }: PropertyTimelineProps) {
  const timeline = [
    {
      icon: Calendar,
      label: 'Listed',
      value: property.created_at ? format(new Date(property.created_at), 'MMM dd, yyyy') : 'N/A',
      color: 'text-blue-600',
    },
    {
      icon: Eye,
      label: 'Views',
      value: property.views || 0,
      color: 'text-purple-600',
    },
    {
      icon: DollarSign,
      label: 'Price Updated',
      value: property.updated_at ? format(new Date(property.updated_at), 'MMM dd, yyyy') : 'N/A',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {timeline.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-primary-800 rounded-lg border border-gray-200 dark:border-primary-700"
          >
            <div className={`p-3 rounded-lg bg-white dark:bg-primary-900 ${item.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.label}</p>
              <p className="text-lg font-bold text-primary dark:text-white">{item.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

