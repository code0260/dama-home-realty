'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
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
    color: 'hover:text-blue-600',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/damahome',
    color: 'hover:text-pink-600',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/damahome',
    color: 'hover:text-sky-500',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/company/damahome',
    color: 'hover:text-blue-700',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@damahome',
    color: 'hover:text-red-600',
  },
];

export function ContactInformation({ className }: ContactInformationProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Contact Methods */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">
            Contact Information
          </h2>
          <div className="space-y-4">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {method.link ? (
                  <Link
                    href={method.link}
                    target={method.link.startsWith('http') ? '_blank' : undefined}
                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-[#B49162] hover:bg-[#B49162]/5 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#B49162]/10 flex items-center justify-center group-hover:bg-[#B49162] transition-colors duration-300 shrink-0">
                      <div className="text-[#B49162] group-hover:text-white transition-colors duration-300">
                        {method.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">{method.label}</p>
                      <p className="text-base font-semibold text-[#0F172A] group-hover:text-[#B49162] transition-colors">
                        {method.value}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-4 p-4 rounded-lg border border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-[#B49162]/10 flex items-center justify-center shrink-0">
                      <div className="text-[#B49162]">{method.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">{method.label}</p>
                      <p className="text-base font-semibold text-[#0F172A]">{method.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Office Hours */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#B49162]/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#B49162]" />
            </div>
            <h2 className="text-xl font-bold text-[#0F172A]">Office Hours</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-[#0F172A] text-sm">Monday - Friday</span>
              <span className="text-[#B49162] font-medium text-sm">{officeHours.weekdays}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-[#0F172A] text-sm">Saturday</span>
              <span className="text-[#B49162] font-medium text-sm">{officeHours.saturday}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-[#0F172A] text-sm">Sunday</span>
              <span className="text-gray-500 font-medium text-sm">{officeHours.sunday}</span>
            </div>
            <p className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
              Timezone: {officeHours.timezone}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">Follow Us</h2>
          <div className="flex flex-wrap gap-3">
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
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center transition-all duration-300',
                    'hover:border-[#B49162] hover:bg-[#B49162]/5',
                    social.color,
                    'text-gray-600'
                  )}
                  aria-label={social.name}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
