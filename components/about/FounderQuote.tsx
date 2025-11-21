'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export function FounderQuote() {
  return (
    <section className="py-20 bg-linear-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#B49162]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B49162]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Quote Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="p-6 bg-[#B49162]/10 rounded-full">
              <Quote className="w-12 h-12 text-[#B49162]" />
            </div>
          </motion.div>

          {/* Quote Text */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] leading-tight mb-8"
          >
            "Our mission is to bridge the distance between Syrian expats and their homeland,
            providing a safe haven they can trust. Every property we verify, every client we serve,
            is a step closer to reuniting families with their roots."
          </motion.blockquote>

          {/* Author */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-[#B49162] font-semibold"
          >
            — Founder, Dama Home Realty
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

