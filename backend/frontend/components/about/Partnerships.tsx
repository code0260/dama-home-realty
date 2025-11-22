'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Handshake, Building2, Globe, ShieldCheck, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Partner {
  name: string;
  logo?: string;
  category: string;
  description?: string;
}

const partners: Partner[] = [
  {
    name: 'Damascus Real Estate Association',
    category: 'Industry Association',
    description: 'Official partnership for verified property listings',
  },
  {
    name: 'Syrian Legal Services',
    category: 'Legal Services',
    description: 'Providing legal assistance for property transactions',
  },
  {
    name: 'International Banking Partners',
    category: 'Financial Services',
    description: 'Secure payment processing and financial solutions',
  },
  {
    name: 'Property Management Companies',
    category: 'Property Management',
    description: 'Comprehensive property management services',
  },
];

const partnerCategories = [
  { icon: Building2, label: 'Real Estate', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { icon: Briefcase, label: 'Legal', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { icon: ShieldCheck, label: 'Financial', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { icon: Users, label: 'Services', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
];

export function Partnerships() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Handshake className="w-10 h-10 text-secondary" />
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white">
              Our Partnerships
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Trusted partners who help us deliver exceptional service
          </p>
        </motion.div>

        {/* Partner Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {partnerCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Badge className={cn('px-4 py-2 text-sm flex items-center gap-2', category.color)}>
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Badge>
              </motion.div>
            );
          })}
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 border-gray-200 dark:border-primary-700 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl text-center">
                <CardContent className="p-6">
                  {/* Logo Placeholder */}
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-primary-800 rounded-lg flex items-center justify-center">
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={96}
                        height={96}
                        className="object-contain"
                      />
                    ) : (
                      <Building2 className="w-12 h-12 text-secondary/30" />
                    )}
                  </div>
                  <h3 className="font-bold text-primary dark:text-white mb-2">
                    {partner.name}
                  </h3>
                  <Badge variant="outline" className="mb-3 text-xs">
                    {partner.category}
                  </Badge>
                  {partner.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {partner.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 rounded-full border border-secondary/20">
            <Globe className="w-5 h-5 text-secondary" />
            <span className="text-sm font-semibold text-primary dark:text-white">
              Trusted by {partners.length}+ partners worldwide
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

