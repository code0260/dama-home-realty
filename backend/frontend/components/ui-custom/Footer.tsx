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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui-custom/Logo';
import { cn } from '@/lib/utils';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

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
  const quickLinks = [
    { href: '/properties?type=sale', label: 'Buy' },
    { href: '/properties?type=rent', label: 'Rent' },
    { href: '/list-property', label: 'Sell' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  // Legal Links
  const legalLinks = [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/refund-policy', label: 'Refund Policy' },
  ];

  // Social Media Links
  const socialLinks = [
    {
      href: '#',
      icon: Facebook,
      label: 'Facebook',
      color: 'hover:text-[#1877F2]',
    },
    {
      href: '#',
      icon: Instagram,
      label: 'Instagram',
      color: 'hover:text-[#E4405F]',
    },
    {
      href: '#',
      icon: Twitter,
      label: 'Twitter',
      color: 'hover:text-[#1DA1F2]',
    },
    {
      href: '#',
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:text-[#0A66C2]',
    },
    {
      href: '#',
      icon: Youtube,
      label: 'YouTube',
      color: 'hover:text-[#FF0000]',
    },
  ];

  // Contact Information
  const contactInfo = {
    address: 'Damascus, Syria',
    phone: '+963 123 456 789',
    email: 'info@dama-home.com',
  };

  return (
    <>
      <footer className="bg-primary text-white relative overflow-hidden pb-24 md:pb-16">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjQkQ5MTYyIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMEYxNzJBIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] repeat" />
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
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white tracking-wide">
                Quick Links
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
                Legal
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
                Contact Us
              </h4>
              <ul className="space-y-5 sm:space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
                    {contactInfo.address}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-secondary" />
                  </div>
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                    className="text-gray-300 hover:text-secondary transition-colors text-base sm:text-lg font-medium"
                  >
                    {contactInfo.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-secondary" />
                  </div>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-gray-300 hover:text-secondary transition-colors text-sm sm:text-base font-light break-all"
                  >
                    {contactInfo.email}
                  </a>
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
              © {currentYear} Dama Home Realty. All rights reserved.
            </p>

            {/* Additional Info or Links can go here */}
            <div className="text-gray-400 text-xs font-light">
              Made with ❤️ in Damascus
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
