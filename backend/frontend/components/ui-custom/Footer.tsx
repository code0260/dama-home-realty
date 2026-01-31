'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Linkedin,
  Youtube,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui-custom/Logo';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/providers/LanguageProvider';

export function Footer() {
  const { t, locale } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show/hide Back to Top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Quick Links
  const quickLinks = mounted ? [
    { href: '/properties?type=sale', label: t('common.buy') },
    { href: '/properties?type=rent', label: t('common.rent') },
    { href: '/list-property', label: t('common.sell') },
    { href: '/blog', label: t('common.blog') },
    { href: '/contact', label: t('common.contact') },
  ] : [
    { href: '/properties?type=sale', label: 'شراء' },
    { href: '/properties?type=rent', label: 'إيجار' },
    { href: '/list-property', label: 'بيع' },
    { href: '/blog', label: 'المدونة' },
    { href: '/contact', label: 'اتصل بنا' },
  ];

  // Legal Links
  const legalLinks = mounted ? [
    { href: '/privacy-policy', label: t('footer.privacyPolicy') },
    { href: '/terms', label: t('footer.termsOfService') },
    { href: '/refund-policy', label: t('footer.refundPolicy') },
  ] : [
    { href: '/privacy-policy', label: 'سياسة الخصوصية' },
    { href: '/terms', label: 'شروط الاستخدام' },
    { href: '/refund-policy', label: 'سياسة الحجز والعربون والإلغاء' },
  ];

  // TikTok Icon Component
  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );

  // Snapchat Icon Component - Better SVG (Official Ghost Logo)
  const SnapchatIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C23.961 5.367 18.641.026 12.017.026L12.017 0z" />
    </svg>
  );

  // Social Media Links - Production Data
  const socialLinks = [
    {
      href: 'https://www.facebook.com/share/17oB7u3M9b/',
      icon: Facebook,
      label: 'Facebook',
      color: 'hover:text-[#1877F2]',
    },
    {
      href: 'https://www.instagram.com/damahomerealty',
      icon: Instagram,
      label: 'Instagram',
      color: 'hover:text-[#E4405F]',
    },
    {
      href: 'https://x.com/damahomerealty',
      icon: Twitter,
      label: 'X (Twitter)',
      color: 'hover:text-[#1DA1F2]',
    },
    {
      href: 'https://www.linkedin.com/in/dama-home-realty-89387b3a9',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:text-[#0A66C2]',
    },
    {
      href: 'https://www.youtube.com/channel/UCpKTCFPArjCDPre5Bodf-pA',
      icon: Youtube,
      label: 'YouTube',
      color: 'hover:text-[#FF0000]',
    },
    {
      href: 'https://www.tiktok.com/@damahomerealty',
      icon: TikTokIcon,
      label: 'TikTok',
      color: 'hover:text-[#000000]',
    },
    {
      href: 'https://snapchat.com/t/Bq821UIy',
      icon: SnapchatIcon,
      label: 'Snapchat',
      color: 'hover:text-[#FFFC00]',
    },
  ];

  // Contact Information - Production Data
  const contactInfo = {
    address: {
      en: 'Damascus, Al-Mazraa, Osama Bin Zaid St., Al-Assi Entrance.',
      ar: 'دمشق، حي المزرعة، شارع أسامة بن زيد، دخلة العاصي.',
    },
    phone: '+963 932 498 092', // Primary (Hotline/WhatsApp)
    phoneSupport: '+963 957 360 390', // Support
    phoneManagement: '+963 983 504 215', // Management
    email: 'info@damahomerealty.com', // General inquiries
    emailSales: 'sales@damahomerealty.com', // For property listings
    whatsapp: '+963932498092', // Primary WhatsApp
  };

  return (
    <>
      <footer className="bg-slate-900 text-white relative overflow-hidden pb-24 md:pb-16">
        {/* Damascene Heritage Pattern - Subtle Islamic/Geometric Arabesque */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='damascene' x='0' y='0' width='120' height='120' patternUnits='userSpaceOnUse'%3E%3Cpath d='M60 0L73.5 20L96 20L78 35L91.5 55L60 45L28.5 55L42 35L24 20L46.5 20Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M0 60L20 46.5L20 24L35 42L55 28.5L45 60L55 91.5L35 78L20 96L20 73.5Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M60 120L46.5 100L24 100L42 85L28.5 65L60 75L91.5 65L78 85L96 100L73.5 100Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M120 60L100 73.5L100 96L85 78L65 91.5L75 60L65 28.5L85 42L100 24L100 46.5Z' fill='%23B49162' opacity='0.3'/%3E%3Ccircle cx='60' cy='60' r='8' fill='%23B49162' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23damascene)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
        </div>

        {/* Additional subtle geometric overlay for depth */}
        <div className="absolute inset-0 opacity-3">
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='hexagon' x='0' y='0' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cpath d='M40 0L60 10L60 30L40 40L20 30L20 10Z' fill='none' stroke='%23B49162' stroke-width='0.5' opacity='0.2'/%3E%3Cpath d='M40 40L60 50L60 70L40 80L20 70L20 50Z' fill='none' stroke='%23B49162' stroke-width='0.5' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23hexagon)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Main Footer Content - 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Column 1: Brand */}
            <div className="space-y-6">
              {/* Logo */}
              <Logo
                href="/"
                showText={true}
                size="md"
                textPosition="side"
                className="[&_.brand-primary]:text-[#B49162] [&_.brand-secondary]:text-white"
              />

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed font-light max-w-xs">
                Your trusted partner in finding the perfect home in Damascus.
                Connecting Syrian expats with their dream properties.
              </p>

              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  const isCustomIcon = typeof Icon === 'function' && Icon !== Facebook && Icon !== Twitter && Icon !== Linkedin && Icon !== Youtube;
                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      className={cn(
                        'w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 group',
                        'text-gray-300 hover:text-secondary hover:scale-110',
                        social.color
                      )}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {isCustomIcon ? (
                        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      ) : (
                        <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white tracking-wide">
                {mounted ? t('footer.quickLinks') : 'روابط سريعة'}
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-secondary transition-colors text-sm font-light group flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white tracking-wide">
                {mounted ? t('footer.legal') : 'قانوني'}
              </h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-secondary transition-colors text-sm font-light group flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white tracking-wide">
                {mounted ? t('footer.contactUs') : 'اتصل بنا'}
              </h4>
              <ul className="space-y-5 sm:space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
                    {mounted && locale === 'en' ? contactInfo.address.en : contactInfo.address.ar}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                      className="text-gray-300 hover:text-secondary transition-colors text-base sm:text-lg font-medium"
                    >
                      {contactInfo.phone} <span className="text-xs text-gray-400">(Hotline)</span>
                    </a>
                    <a
                      href={`tel:${contactInfo.phoneSupport.replace(/\s/g, '')}`}
                      className="text-gray-400 hover:text-secondary transition-colors text-sm font-light"
                    >
                      {contactInfo.phoneSupport} <span className="text-xs text-gray-500">(Support)</span>
                    </a>
                    <a
                      href={`tel:${contactInfo.phoneManagement.replace(/\s/g, '')}`}
                      className="text-gray-400 hover:text-secondary transition-colors text-sm font-light"
                    >
                      {contactInfo.phoneManagement} <span className="text-xs text-gray-500">(Management)</span>
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-6 h-6 text-secondary" />
                  </div>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-secondary transition-colors text-base sm:text-lg font-medium"
                  >
                    WhatsApp: {contactInfo.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-300 hover:text-secondary transition-colors text-sm sm:text-base font-light break-all"
                    >
                      {contactInfo.email}
                    </a>
                    <a
                      href={`mailto:${contactInfo.emailSales}`}
                      className="text-gray-400 hover:text-secondary transition-colors text-xs sm:text-sm font-light break-all"
                    >
                      {contactInfo.emailSales}
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bronze Line Separator */}
        <div className="border-t border-secondary/30" />

        {/* Bottom Bar */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-center md:text-left">
            {/* Copyright */}
            <p className="text-gray-400 text-sm font-light">
              © {currentYear} Dama Home Realty. {mounted ? t('footer.copyright') : 'جميع الحقوق محفوظة.'}
            </p>

            {/* Additional Info or Links can go here */}
            <div className="text-gray-400 text-xs font-light">
              {mounted ? t('footer.madeWith') : 'صنع بـ'} ❤️ {mounted ? t('footer.inDamascus') : 'في دمشق'}
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className={cn(
              'fixed bottom-24 left-4 sm:left-8 z-60',
              'w-12 h-12 rounded-full',
              'bg-secondary hover:bg-secondary/90',
              'text-white shadow-lg hover:shadow-xl',
              'flex items-center justify-center',
              'transition-all duration-300',
              'hover:scale-110 active:scale-95',
              'group'
            )}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
