'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Heart, Users, Award, TrendingUp, Globe } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    icon: ShieldCheck,
    title: 'Trust & Integrity',
    description: 'We build lasting relationships based on honesty, transparency, and ethical practices in everything we do.',
  },
  {
    icon: Heart,
    title: 'Empathy',
    description: 'We understand the emotional journey of finding a home and provide compassionate support throughout the process.',
  },
  {
    icon: Users,
    title: 'Community Focus',
    description: 'We are dedicated to serving the Syrian diaspora community, understanding their unique needs and challenges.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for excellence in every transaction, ensuring the highest quality service and verified property listings.',
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description: 'We leverage technology to make property transactions seamless, secure, and accessible from anywhere in the world.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'We break down geographical barriers, making it easy for expats to find and manage properties remotely.',
  },
];

export function CompanyValues() {
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
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The principles that guide our actions and define who we are
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 border-gray-200 dark:border-primary-700 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl group">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-3 bg-secondary/10 rounded-full group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-6 h-6 text-secondary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <CardTitle className="text-xl font-bold text-primary dark:text-white">
                        {value.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

