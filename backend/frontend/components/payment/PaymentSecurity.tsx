'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentSecurityProps {
  className?: string;
}

export function PaymentSecurity({ className }: PaymentSecurityProps) {
  const securityFeatures = [
    {
      icon: Lock,
      title: 'SSL Encrypted',
      description: 'All data is encrypted with 256-bit SSL encryption',
      verified: true,
    },
    {
      icon: Shield,
      title: 'PCI DSS Compliant',
      description: 'We are PCI DSS Level 1 compliant',
      verified: true,
    },
    {
      icon: CheckCircle2,
      title: '3D Secure',
      description: 'Additional authentication for card payments',
      verified: true,
    },
    {
      icon: AlertCircle,
      title: 'Secure Storage',
      description: 'We never store your full card details',
      verified: true,
    },
  ];

  return (
    <Card className={cn('border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20', className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">
              Secure Payment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-900 dark:text-green-300">
                        {feature.title}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-white border-green-300 text-green-700 dark:bg-primary-800 dark:border-green-600 dark:text-green-400 text-xs">
                <Lock className="w-3 h-3 mr-1" />
                Secure Connection
              </Badge>
              <Badge variant="outline" className="bg-white border-green-300 text-green-700 dark:bg-primary-800 dark:border-green-600 dark:text-green-400 text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Verified by Stripe
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

