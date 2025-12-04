'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How quickly will I receive a response?',
    answer: 'We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly at +963 123 456 789.',
  },
  {
    question: 'Do you offer virtual property tours?',
    answer: 'Yes! We offer virtual tours for many of our properties. You can request a virtual tour when contacting us about a specific property.',
  },
  {
    question: 'What documents do I need to rent a property?',
    answer: 'Generally, you\'ll need a valid ID, proof of income, and references. Our team will provide you with a complete checklist based on your specific situation.',
  },
  {
    question: 'Can I schedule a property viewing on weekends?',
    answer: 'Yes, we offer weekend viewings by appointment. Please contact us to schedule a convenient time.',
  },
  {
    question: 'Do you help with property management?',
    answer: 'Yes, we offer comprehensive property management services including maintenance, tenant relations, and financial reporting.',
  },
  {
    question: 'What areas in Damascus do you cover?',
    answer: 'We cover all major neighborhoods in Damascus including Old City, Mezzeh, Kafr Sousa, and more. Contact us to inquire about specific areas.',
  },
  {
    question: 'How do I list my property with you?',
    answer: 'You can list your property through our "List Property" page. Our team will verify and help you create an attractive listing.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept various payment methods including bank transfers, credit cards, and cash. Payment terms are discussed during the booking process.',
  },
];

export function ContactFAQ() {
  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqData.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-gray-200 rounded-lg px-6 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <AccordionTrigger className="text-left hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#B49162]/10 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4 text-[#B49162]" />
                </div>
                <span className="font-semibold text-[#0F172A] text-base">
                  {faq.question}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-4 pl-11">
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

