'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Shield, Users, Zap, Award } from 'lucide-react';

const benefits = [
  { icon: Clock, text: 'Fast Response Time' },
  { icon: Shield, text: 'Secure & Reliable' },
  { icon: Users, text: 'Expert Team' },
  { icon: Zap, text: '24/7 Support' },
  { icon: Award, text: 'Verified Services' },
];

export function ServiceBenefits() {
  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            Why Choose <span className="text-[#B49162]">Our Services</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference of working with Damascus's most trusted real estate service provider
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex p-4 bg-[#B49162]/10 rounded-full mb-4 group-hover:bg-[#B49162] transition-colors duration-300">
                  <Icon className="w-6 h-6 text-[#B49162] group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-sm font-semibold text-[#0F172A]">{benefit.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

