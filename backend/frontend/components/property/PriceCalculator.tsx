'use client';

import { useState } from 'react';
import { Property } from '@/types';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calculator, DollarSign } from 'lucide-react';
import { differenceInDays } from 'date-fns';

interface PriceCalculatorProps {
  property: Property;
  checkIn?: Date;
  checkOut?: Date;
}

export function PriceCalculator({ property, checkIn, checkOut }: PriceCalculatorProps) {
  const [customNights, setCustomNights] = useState<number | ''>('');
  const [customGuests, setCustomGuests] = useState<number>(1);

  const nights = checkIn && checkOut 
    ? differenceInDays(checkOut, checkIn) 
    : (typeof customNights === 'number' ? customNights : 0);
  
  const basePrice = property.price || 0;
  const guestsMultiplier = property.type === 'hotel' ? Math.max(1, Math.ceil((customGuests - 2) / 2)) : 1;
  const totalPrice = basePrice * nights * guestsMultiplier;
  const serviceFee = totalPrice * 0.1; // 10% service fee
  const deposit = totalPrice * 0.3; // 30% deposit
  const finalTotal = totalPrice + serviceFee;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: property.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!['hotel', 'rent'].includes(property.type)) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-secondary" />
        <h3 className="text-xl font-bold text-primary dark:text-white">Price Calculator</h3>
      </div>

      <div className="space-y-4">
        {/* Nights Input */}
        {!checkIn && !checkOut && (
          <div>
            <Label htmlFor="nights">Number of Nights</Label>
            <Input
              id="nights"
              type="number"
              min="1"
              value={customNights}
              onChange={(e) => setCustomNights(e.target.value ? parseInt(e.target.value) : '')}
              placeholder="Enter number of nights"
              className="mt-1"
            />
          </div>
        )}

        {/* Guests Input (for hotels) */}
        {property.type === 'hotel' && (
          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              max="10"
              value={customGuests}
              onChange={(e) => setCustomGuests(parseInt(e.target.value) || 1)}
              className="mt-1"
            />
            {customGuests > 2 && (
              <p className="text-xs text-gray-500 mt-1">
                Additional guests may incur extra charges
              </p>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        {nights > 0 && (
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-primary-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                {formatPrice(basePrice)} × {nights} {nights === 1 ? 'night' : 'nights'}
              </span>
              <span className="font-semibold text-primary dark:text-white">
                {formatPrice(basePrice * nights)}
              </span>
            </div>

            {property.type === 'hotel' && customGuests > 2 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Extra guests ({customGuests - 2} × {formatPrice(basePrice * 0.5)}/night)
                </span>
                <span className="font-semibold text-primary dark:text-white">
                  {formatPrice(basePrice * 0.5 * nights * (customGuests - 2))}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-300">Service Fee (10%)</span>
              <span className="font-semibold text-primary dark:text-white">
                {formatPrice(serviceFee)}
              </span>
            </div>

            <div className="border-t border-gray-200 dark:border-primary-700 pt-2 mt-2">
              <div className="flex items-center justify-between font-bold text-lg">
                <span className="text-primary dark:text-white">Total</span>
                <span className="text-secondary">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-primary-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Deposit (30%)</span>
                <span className="font-semibold text-secondary">{formatPrice(deposit)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

