'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export function StorySection() {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMEYxNzJBIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQkQ5MTYyIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] repeat" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Large Quote - Story Opening */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-start gap-4 mb-8">
              <Quote className="w-12 h-12 md:w-16 md:h-16 text-secondary/30 flex-shrink-0 mt-2" />
              <blockquote className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
                We are the bridge to your home.
              </blockquote>
            </div>
          </motion.div>

          {/* Mission Statement with Large Typography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8 mb-12"
          >
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-700 leading-relaxed font-light">
              At Dama Home Realty, we understand the unique challenges faced by Syrian expats
              seeking to reconnect with their homeland. Whether you're looking to rent, buy, or
              invest in property in Damascus, we're here to make the process seamless, secure, and
              trustworthy.
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl text-slate-700 leading-relaxed font-light">
              Our mission is to bridge the distance between you and your dream home in Syria,
              providing verified listings, expert guidance, and a secure platform that you can
              trust. We believe that everyone deserves a safe haven, and we're committed to
              making that a reality for the Syrian diaspora.
            </p>
          </motion.div>

          {/* Signature Visual Effect */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center gap-4 pt-8 border-t border-gray-200"
          >
            <div className="flex-1">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                Dama Home Realty
              </div>
              <div className="text-sm text-slate-500 font-light tracking-wider uppercase">
                Your Trusted Partner in Damascus
              </div>
            </div>
            {/* Signature Line Effect */}
            <div className="relative">
              <svg
                width="200"
                height="60"
                viewBox="0 0 200 60"
                className="text-secondary"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 30 Q50 10, 90 30 T170 30"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  className="text-secondary/40"
                />
                <path
                  d="M10 40 Q50 20, 90 40 T170 40"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  className="text-secondary/60"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

