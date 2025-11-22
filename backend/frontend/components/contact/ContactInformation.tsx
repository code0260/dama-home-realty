'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ContactMethod {
  type: 'phone' | 'email' | 'whatsapp' | 'address';
  label: string;
  value: string;
  icon: React.ReactNode;
  link?: string;
}

interface OfficeHours {
  weekdays: string;
  saturday: string;
  sunday: string;
  timezone: string;
}

interface ContactInformationProps {
  className?: string;
}

const contactMethods: ContactMethod[] = [
  {
    type: 'phone',
    label: 'Phone',
    value: '+963 123 456 789',
    icon: <Phone className="w-5 h-5" />,
    link: 'tel:+963123456789',
  },
  {
    type: 'email',
    label: 'Email',
    value: 'info@damahome.com',
    icon: <Mail className="w-5 h-5" />,
    link: 'mailto:info@damahome.com',
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    value: '+963 123 456 789',
    icon: <MessageCircle className="w-5 h-5" />,
    link: 'https://wa.me/963123456789',
  },
  {
    type: 'address',
    label: 'Address',
    value: 'Damascus, Syria',
    icon: <MapPin className="w-5 h-5" />,
    link: 'https://www.google.com/maps/search/?api=1&query=Damascus,Syria',
  },
];

const officeHours: OfficeHours = {
  weekdays: '9:00 AM - 6:00 PM',
  saturday: '9:00 AM - 4:00 PM',
  sunday: 'Closed',
  timezone: 'Asia/Damascus (GMT+3)',
};

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com/damahome',
    color: 'text-blue-600 hover:text-blue-700',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/damahome',
    color: 'text-pink-600 hover:text-pink-700',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/damahome',
    color: 'text-sky-500 hover:text-sky-600',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/company/damahome',
    color: 'text-blue-700 hover:text-blue-800',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@damahome',
    color: 'text-red-600 hover:text-red-700',
  },
];

export function ContactInformation({ className }: ContactInformationProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Contact Methods */}
      <Card className="border-2 border-gray-200 dark:border-primary-700">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-secondary" />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-primary-800 rounded-lg hover:bg-gray-100 dark:hover:bg-primary-700 transition-colors"
              >
                <div className="p-2 bg-secondary/10 rounded-lg flex-shrink-0">
                  <div className="text-secondary">{method.icon}</div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary dark:text-white mb-1">
                    {method.label}
                  </h3>
                  {method.link ? (
                    <a
                      href={method.link}
                      target={method.link.startsWith('http') ? '_blank' : undefined}
                      rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-secondary hover:underline text-sm"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{method.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Office Hours */}
      <Card className="border-2 border-gray-200 dark:border-primary-700">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-secondary" />
            Office Hours
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-primary-800 rounded-lg">
                <span className="font-semibold text-primary dark:text-white">
                  Monday - Friday:
                </span>
                <Badge variant="outline" className="bg-secondary/10 border-secondary">
                  {officeHours.weekdays}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-primary-800 rounded-lg">
                <span className="font-semibold text-primary dark:text-white">Saturday:</span>
                <Badge variant="outline" className="bg-secondary/10 border-secondary">
                  {officeHours.saturday}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-primary-800 rounded-lg md:col-span-2">
                <span className="font-semibold text-primary dark:text-white">Sunday:</span>
                <Badge variant="outline" className="bg-gray-100 dark:bg-primary-700">
                  {officeHours.sunday}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Timezone: {officeHours.timezone}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card className="border-2 border-gray-200 dark:border-primary-700">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-secondary" />
            Follow Us
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'w-12 h-12 bg-gray-100 dark:bg-primary-800 rounded-full flex items-center justify-center transition-colors hover:bg-gray-200 dark:hover:bg-primary-700',
                    social.color
                  )}
                  aria-label={social.name}
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

