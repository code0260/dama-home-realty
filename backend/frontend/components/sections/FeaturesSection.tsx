'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Globe, Lock, Zap, Users, Clock } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: 'Verified Properties',
    description: 'Every property is thoroughly verified to ensure authenticity and quality standards.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connect with Syrian expats worldwide, regardless of your location.',
  },
  {
    icon: Lock,
    title: 'Secure Transactions',
    description: 'Your transactions and personal information are protected with industry-leading security.',
  },
  {
    icon: Zap,
    title: 'Fast Response',
    description: 'Get instant notifications and quick responses from our dedicated team.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description: 'Our local experts know Damascus inside and out, providing invaluable insights.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'We\'re here for you around the clock, no matter where you are in the world.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMEYxNzJBIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQkQ5MTYyIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] repeat" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            Why Choose <span className="text-[#B49162]">Dama Home Realty</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference of working with Syria's most trusted real estate platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-8 bg-linear-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-[#B49162]/30 hover:shadow-xl transition-all duration-300">
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-[#B49162]/10 rounded-xl group-hover:bg-[#B49162] group-hover:scale-110 transition-all duration-300">
                      <Icon className="w-8 h-8 text-[#B49162] group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#B49162] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

