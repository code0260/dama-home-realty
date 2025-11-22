'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Building2, Smartphone, Wallet, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  available: boolean;
  processingFee?: number;
  currency?: string;
  security?: string[];
}

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  currency?: string;
  className?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Visa, Mastercard, American Express',
    icon: CreditCard,
    available: true,
    processingFee: 0,
    security: ['SSL Encrypted', 'PCI DSS Compliant', '3D Secure'],
  },
  {
    id: 'stripe',
    name: 'Stripe Checkout',
    description: 'Secure payment via Stripe',
    icon: Wallet,
    available: true,
    processingFee: 0,
    security: ['SSL Encrypted', 'PCI DSS Level 1', '3D Secure', 'SCA Compliant'],
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: Building2,
    available: true,
    processingFee: 0,
    security: ['Secure Banking', 'Bank-Level Encryption'],
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    description: 'PayPal, Apple Pay, Google Pay',
    icon: Smartphone,
    available: false,
    processingFee: 0,
    security: ['Digital Wallet Security'],
  },
];

export function PaymentMethods({
  selectedMethod,
  onMethodChange,
  currency = 'USD',
  className,
}: PaymentMethodsProps) {
  const availableMethods = paymentMethods.filter((method) => method.available);

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary dark:text-white">
          <Lock className="w-5 h-5 text-secondary" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
          <div className="space-y-3">
            {availableMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;

              return (
                <Label
                  key={method.id}
                  htmlFor={method.id}
                  className={cn(
                    'flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all',
                    isSelected
                      ? 'border-secondary bg-secondary/5 shadow-md'
                      : 'border-gray-200 dark:border-primary-700 hover:border-secondary/50 hover:bg-gray-50 dark:hover:bg-primary-800'
                  )}
                >
                  <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-secondary" />
                        <span className="font-semibold text-primary dark:text-white">
                          {method.name}
                        </span>
                      </div>
                      {isSelected && (
                        <Badge variant="outline" className="bg-secondary/10 border-secondary text-secondary">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {method.description}
                    </p>
                    {method.security && method.security.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {method.security.map((sec, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400"
                          >
                            <Lock className="w-3 h-3 mr-1" />
                            {sec}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {method.processingFee !== undefined && method.processingFee > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Processing fee: {method.processingFee.toFixed(2)} {currency}
                      </p>
                    )}
                  </div>
                </Label>
              );
            })}
          </div>
        </RadioGroup>

        {/* Security Info */}
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-start gap-2">
            <Lock className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">
                Secure Payment
              </h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                All payments are encrypted and secure. We never store your full card details on our
                servers.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

