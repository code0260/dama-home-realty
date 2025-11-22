'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Search,
  MessageCircle,
  FileText,
  Settings,
  HelpCircle,
  Home,
  Phone,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  variant?: 'default' | 'outline' | 'secondary';
  color?: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'book-property',
    label: 'Book a Property',
    icon: Search,
    href: '/properties',
    variant: 'default',
    color: 'bg-secondary hover:bg-secondary/90',
  },
  {
    id: 'view-bookings',
    label: 'My Bookings',
    icon: Calendar,
    href: '/portal',
    variant: 'outline',
  },
  {
    id: 'request-service',
    label: 'Request Service',
    icon: MessageCircle,
    href: '/services',
    variant: 'outline',
  },
  {
    id: 'contact-support',
    label: 'Contact Support',
    icon: Phone,
    href: '/contact',
    variant: 'outline',
  },
  {
    id: 'view-documents',
    label: 'Documents',
    icon: FileText,
    href: '/portal/profile',
    variant: 'outline',
  },
  {
    id: 'help',
    label: 'Help Center',
    icon: HelpCircle,
    href: '/help',
    variant: 'outline',
  },
];

export function QuickActions() {
  return (
    <Card className="border-gray-200 dark:border-primary-700">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-secondary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  variant={action.variant || 'outline'}
                  className={cn(
                    'w-full h-auto py-4 flex flex-col items-center gap-2',
                    action.color
                  )}
                >
                  <Link href={action.href}>
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

