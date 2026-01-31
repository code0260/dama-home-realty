'use client';

import { useState, useEffect } from 'react';
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
import { useLanguage } from '@/components/providers/LanguageProvider';

interface ContactMethod {
  id: string; // Unique ID for React keys
  type: 'phone' | 'email' | 'whatsapp' | 'address';
  labelKey: string;
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

// Contact methods will be defined inside component to use translations

// Office hours will be defined inside component to use translations

// TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// Snapchat Icon Component - Better SVG
const SnapchatIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C23.961 5.367 18.641.026 12.017.026L12.017 0z" />
  </svg>
);

const socialLinks = [
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://www.facebook.com/share/17oB7u3M9b/',
    color: 'hover:text-blue-600',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/damahomerealty',
    color: 'hover:text-pink-600',
  },
  {
    name: 'X (Twitter)',
    icon: Twitter,
    url: 'https://x.com/damahomerealty',
    color: 'hover:text-sky-500',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/in/dama-home-realty-89387b3a9',
    color: 'hover:text-blue-700',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://www.youtube.com/channel/UCpKTCFPArjCDPre5Bodf-pA',
    color: 'hover:text-red-600',
  },
  {
    name: 'TikTok',
    icon: TikTokIcon,
    url: 'https://www.tiktok.com/@damahomerealty',
    color: 'hover:text-black',
  },
  {
    name: 'Snapchat',
    icon: SnapchatIcon,
    url: 'https://snapchat.com/t/Bq821UIy',
    color: 'hover:text-yellow-400',
  },
];

export function ContactInformation({ className }: ContactInformationProps) {
  const { t, locale } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const contactMethods: ContactMethod[] = [
    {
      id: 'phone-primary',
      type: 'phone',
      labelKey: 'contact.primaryPhoneHotline',
      value: '+963 932 498 092',
      icon: <Phone className="w-5 h-5" />,
      link: 'tel:+963932498092',
    },
    {
      id: 'phone-support',
      type: 'phone',
      labelKey: 'contact.supportPhone',
      value: '+963 957 360 390',
      icon: <Phone className="w-5 h-5" />,
      link: 'tel:+963957360390',
    },
    {
      id: 'phone-management',
      type: 'phone',
      labelKey: 'contact.management',
      value: '+963 983 504 215',
      icon: <Phone className="w-5 h-5" />,
      link: 'tel:+963983504215',
    },
    {
      id: 'whatsapp-primary',
      type: 'whatsapp',
      labelKey: 'contact.whatsappPrimary',
      value: '+963 932 498 092',
      icon: <MessageCircle className="w-5 h-5" />,
      link: 'https://wa.me/963932498092',
    },
    {
      id: 'email-info',
      type: 'email',
      labelKey: 'contact.generalInquiries',
      value: 'info@damahomerealty.com',
      icon: <Mail className="w-5 h-5" />,
      link: 'mailto:info@damahomerealty.com',
    },
    {
      id: 'email-sales',
      type: 'email',
      labelKey: 'contact.salesListings',
      value: 'sales@damahomerealty.com',
      icon: <Mail className="w-5 h-5" />,
      link: 'mailto:sales@damahomerealty.com',
    },
    {
      id: 'address-main',
      type: 'address',
      labelKey: 'contact.address',
      value: mounted && locale === 'en'
        ? 'Damascus, Al-Mazraa, Osama Bin Zaid St., Al-Assi Entrance.'
        : 'دمشق، حي المزرعة، شارع أسامة بن زيد، دخلة العاصي.',
      icon: <MapPin className="w-5 h-5" />,
      link: 'https://www.google.com/maps/search/?api=1&query=Damascus+Al-Mazraa+Osama+Bin+Zaid+Street',
    },
  ];

  const officeHours: OfficeHours = {
    weekdays: locale === 'ar' ? '9:00 صباحاً - 12:00 مساءً' : '9:00 AM - 12:00 PM',
    saturday: locale === 'ar' ? '9:00 صباحاً - 12:00 مساءً' : '9:00 AM - 12:00 PM',
    sunday: (() => {
      const translation = t('contact.closed');
      if (translation === 'contact.closed') {
        return locale === 'ar' ? 'مغلق' : 'Closed';
      }
      return translation;
    })(),
    timezone: 'Asia/Damascus (GMT+3)',
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Contact Methods */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6 text-start">
            {(() => {
              const translation = t('contact.contactInfo');
              // Fallback if translation returns the key itself
              if (translation === 'contact.contactInfo') {
                return locale === 'ar' ? 'معلومات التواصل' : 'Contact Information';
              }
              return translation;
            })()}
          </h2>
          <div className="space-y-4">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {method.link ? (
                  <Link
                    href={method.link}
                    target={method.link.startsWith('http') ? '_blank' : undefined}
                    rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-[#B49162] hover:bg-[#B49162]/5 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#B49162]/10 flex items-center justify-center group-hover:bg-[#B49162] transition-colors duration-300 shrink-0">
                      <div className="text-[#B49162] group-hover:text-white transition-colors duration-300">
                        {method.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 text-start">
                        {(() => {
                          const translation = t(method.labelKey);
                          if (translation === method.labelKey) {
                            const fallbacks: Record<string, { ar: string; en: string }> = {
                              'contact.primaryPhoneHotline': { ar: 'الرقم الموحد (هاتف ساخن)', en: 'Primary Phone (Hotline)' },
                              'contact.supportPhone': { ar: 'الدعم الفني', en: 'Support Phone' },
                              'contact.management': { ar: 'الإدارة', en: 'Management' },
                              'contact.whatsappPrimary': { ar: 'واتساب (الرقم الموحد)', en: 'WhatsApp (Primary)' },
                              'contact.generalInquiries': { ar: 'الاستفسارات العامة', en: 'General Inquiries' },
                              'contact.salesListings': { ar: 'المبيعات والعروض', en: 'Sales & Listings' },
                              'contact.address': { ar: 'العنوان', en: 'Address' },
                            };
                            return fallbacks[method.labelKey]?.[locale] || method.labelKey;
                          }
                          return translation;
                        })()}
                      </p>
                      {(method.type === 'phone' || method.type === 'whatsapp') ? (
                        <p className="text-sm sm:text-base font-semibold text-[#0F172A] group-hover:text-[#B49162] transition-colors break-words">
                          <span dir="ltr" className="inline-block text-end">{method.value}</span>
                        </p>
                      ) : (
                        <p className="text-sm sm:text-base font-semibold text-[#0F172A] group-hover:text-[#B49162] transition-colors break-words text-start">
                          {method.value}
                        </p>
                      )}
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-200">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#B49162]/10 flex items-center justify-center shrink-0">
                      <div className="text-[#B49162]">{method.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1 text-start">
                        {(() => {
                          const translation = t(method.labelKey);
                          if (translation === method.labelKey) {
                            const fallbacks: Record<string, { ar: string; en: string }> = {
                              'contact.primaryPhoneHotline': { ar: 'الرقم الموحد (هاتف ساخن)', en: 'Primary Phone (Hotline)' },
                              'contact.supportPhone': { ar: 'الدعم الفني', en: 'Support Phone' },
                              'contact.management': { ar: 'الإدارة', en: 'Management' },
                              'contact.whatsappPrimary': { ar: 'واتساب (الرقم الموحد)', en: 'WhatsApp (Primary)' },
                              'contact.generalInquiries': { ar: 'الاستفسارات العامة', en: 'General Inquiries' },
                              'contact.salesListings': { ar: 'المبيعات والعروض', en: 'Sales & Listings' },
                              'contact.address': { ar: 'العنوان', en: 'Address' },
                            };
                            return fallbacks[method.labelKey]?.[locale] || method.labelKey;
                          }
                          return translation;
                        })()}
                      </p>
                      {(method.type === 'phone' || method.type === 'whatsapp') ? (
                        <p className="text-sm sm:text-base font-semibold text-[#0F172A] break-words">
                          <span dir="ltr" className="inline-block text-end">{method.value}</span>
                        </p>
                      ) : (
                        <p className="text-sm sm:text-base font-semibold text-[#0F172A] break-words text-start">{method.value}</p>
                      )}
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
            <h2 className="text-xl font-bold text-[#0F172A] text-start">
              {(() => {
                const translation = t('contact.officeHours');
                if (translation === 'contact.officeHours') {
                  return locale === 'ar' ? 'ساعات العمل' : 'Office Hours';
                }
                return translation;
              })()}
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-[#0F172A] text-sm text-start">
                {(() => {
                  const translation = t('contact.mondayFriday');
                  if (translation === 'contact.mondayFriday') {
                    return locale === 'ar' ? 'الإثنين - الجمعة' : 'Monday - Friday';
                  }
                  return translation;
                })()}
              </span>
              <span className="text-[#B49162] font-medium text-sm" dir="ltr">{officeHours.weekdays}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-[#0F172A] text-sm text-start">
                {(() => {
                  const translation = t('contact.saturday');
                  if (translation === 'contact.saturday') {
                    return locale === 'ar' ? 'السبت' : 'Saturday';
                  }
                  return translation;
                })()}
              </span>
              <span className="text-[#B49162] font-medium text-sm" dir="ltr">{officeHours.saturday}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold text-[#0F172A] text-sm text-start">
                {(() => {
                  const translation = t('contact.sunday');
                  if (translation === 'contact.sunday') {
                    return locale === 'ar' ? 'الأحد' : 'Sunday';
                  }
                  return translation;
                })()}
              </span>
              <span className="text-gray-500 font-medium text-sm">{officeHours.sunday}</span>
            </div>
            <p className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
              {(() => {
                const translation = t('contact.timezone');
                if (translation === 'contact.timezone') {
                  return locale === 'ar' ? 'المنطقة الزمنية' : 'Timezone';
                }
                return translation;
              })()}: <span dir="ltr" className="inline-block">{officeHours.timezone}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6 text-start">
            {(() => {
              const translation = t('contact.followUs');
              if (translation === 'contact.followUs') {
                return locale === 'ar' ? 'تابعنا' : 'Follow Us';
              }
              return translation;
            })()}
          </h2>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
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
                  <IconComponent className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
