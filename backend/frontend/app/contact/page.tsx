'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MultiStepContactForm } from '@/components/contact/MultiStepContactForm';
import { InteractiveMap } from '@/components/contact/InteractiveMap';
import { ContactInformation } from '@/components/contact/ContactInformation';
import { LiveChatWidget } from '@/components/contact/LiveChatWidget';
import { MapPin } from 'lucide-react';

export default function ContactPage() {
  const [formSuccess, setFormSuccess] = useState(false);

  const handleFormSuccess = () => {
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 10000);
  };

  return (
    <>
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary via-primary/95 to-secondary/20 text-white py-20 dark:bg-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 dark:text-white">
                Get In Touch
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 dark:text-gray-300 max-w-2xl mx-auto">
                We're here to help you find your perfect home in Damascus
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Contact Information */}
            <aside className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ContactInformation />
              </motion.div>
            </aside>

            {/* Main Content - Form & Map */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <MultiStepContactForm onSuccess={handleFormSuccess} />
              </motion.div>

              <Separator />

              {/* Interactive Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="border-2 border-gray-200 dark:border-primary-700">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary dark:text-white flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-secondary" />
                      Our Locations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InteractiveMap />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Live Chat Widget */}
        <LiveChatWidget />
    </>
  );
}

