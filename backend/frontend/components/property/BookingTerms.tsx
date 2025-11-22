'use client';

import { Card } from '@/components/ui/card';
import { FileText, CheckCircle2 } from 'lucide-react';
import { Property } from '@/types';

interface BookingTermsProps {
  property: Property;
}

export function BookingTerms({ property }: BookingTermsProps) {
  const terms = [
    {
      title: 'Cancellation Policy',
      description: 'Free cancellation up to 7 days before check-in. 50% refund if cancelled 3-7 days before. No refund if cancelled less than 3 days before.',
    },
    {
      title: 'Check-in & Check-out',
      description: 'Check-in: 3:00 PM | Check-out: 11:00 AM. Early check-in and late check-out subject to availability.',
    },
    {
      title: 'Deposit',
      description: 'A 30% deposit is required to confirm your booking. The remaining balance is due upon check-in.',
    },
    {
      title: 'House Rules',
      description: 'No smoking, no pets (unless specified), no parties or events, respect quiet hours after 10 PM.',
    },
    {
      title: 'Safety & Security',
      description: 'Property is verified and secure. All transactions are protected. Emergency contact available 24/7.',
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-secondary" />
        <h3 className="text-xl font-bold text-primary dark:text-white">Booking Terms</h3>
      </div>

      <div className="space-y-4">
        {terms.map((term, index) => (
          <div key={index} className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-primary dark:text-white mb-1">{term.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{term.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

