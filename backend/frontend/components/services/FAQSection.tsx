'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  className?: string;
}

export function FAQSection({ faqs, title = 'Frequently Asked Questions', className }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-12 md:py-16', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-secondary" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white">
              {title}
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about our services
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={cn(
                  'overflow-hidden transition-all duration-300',
                  isOpen ? 'border-secondary shadow-lg' : 'border-gray-200 dark:border-primary-700 hover:shadow-md'
                )}>
                  <CardHeader className="p-0">
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-between p-6 h-auto font-semibold text-left',
                        'hover:bg-gray-50 dark:hover:bg-primary-800',
                        'transition-colors duration-200'
                      )}
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    >
                      <span className="text-lg text-primary dark:text-white pr-4">
                        {faq.question}
                      </span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="shrink-0"
                        >
                        <ChevronDown className="w-5 h-5 text-secondary" />
                      </motion.div>
                    </Button>
                  </CardHeader>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="px-6 pb-6 pt-0">
                          <div className="pt-4 border-t border-gray-200 dark:border-primary-700">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

