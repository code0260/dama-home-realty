'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHero } from '@/components/ui-custom/PageHero';
import { ContactInformation } from '@/components/contact/ContactInformation';
import { MultiStepContactForm } from '@/components/contact/MultiStepContactForm';
import { InteractiveMap } from '@/components/contact/InteractiveMap';
import { ContactFAQ } from '@/components/contact/ContactFAQ';
import { LiveChatWidget } from '@/components/contact/LiveChatWidget';

export default function ContactPage() {
  const [formSuccess, setFormSuccess] = useState(false);

  const handleFormSuccess = () => {
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 10000);
  };

  return (
    <>
        {/* Hero Section */}
      <PageHero
        title="Get in Touch"
        subtitle="We're here to help you find your perfect home in Damascus. Reach out to our expert team."
        breadcrumbs={[{ label: 'Contact' }]}
      />

      {/* Main Content - Split Layout */}
      <div className="bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column - Contact Information (Sticky) */}
            <aside className="lg:col-span-5">
              <div className="sticky top-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <ContactInformation />
              </motion.div>

                {/* Map Section */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="lg:block"
                >
                  <InteractiveMap />
                </motion.div>
              </div>
            </aside>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <MultiStepContactForm onSuccess={handleFormSuccess} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
                Frequently Asked <span className="text-[#B49162]">Questions</span>
              </h2>
              <p className="text-lg text-gray-600">
                Find answers to common questions about our services
              </p>
            </div>
            <ContactFAQ />
          </motion.div>
        </div>
      </section>

        {/* Live Chat Widget */}
        <LiveChatWidget />
    </>
  );
}
