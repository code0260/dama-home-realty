'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Eye, Heart, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MissionVision() {
  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-primary-900/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
            Our Mission & Vision
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            The guiding principles that drive everything we do
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="h-full border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-secondary/10 rounded-full">
                    <Target className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-primary dark:text-white">
                    Our Mission
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  To bridge the distance between Syrian expats and their homeland by providing
                  verified, secure, and accessible real estate solutions. We are committed to
                  making property transactions seamless, transparent, and trustworthy.
                </p>
                <div className="flex items-center gap-2 text-secondary">
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">Connecting hearts to homes</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="h-full border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-secondary/10 rounded-full">
                    <Eye className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-primary dark:text-white">
                    Our Vision
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  To become the most trusted real estate platform for the Syrian diaspora worldwide.
                  We envision a future where every Syrian expat can easily find, secure, and manage
                  their dream property in Syria with complete confidence and peace of mind.
                </p>
                <div className="flex items-center gap-2 text-secondary">
                  <Globe className="w-5 h-5" />
                  <span className="font-semibold">Empowering the Syrian diaspora globally</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

