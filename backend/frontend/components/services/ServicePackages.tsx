'use client';

import { motion } from 'framer-motion';
import { ServicePackage } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServicePackagesProps {
  packages: ServicePackage[];
  onSelectPackage?: (pkg: ServicePackage) => void;
  className?: string;
}

const formatPrice = (price: number, currency: 'USD' | 'SYP') => {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  return currency === 'USD' ? `$${formattedPrice}` : `${formattedPrice} ${currency}`;
};

export function ServicePackages({ packages, onSelectPackage, className }: ServicePackagesProps) {
  if (!packages || packages.length === 0) {
    return null;
  }

  // Find featured package (usually the middle one)
  const featuredIndex = Math.floor(packages.length / 2);

  return (
    <section className={cn('py-12 md:py-16', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mb-4">
            Choose Your Package
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select the perfect package that fits your needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg, index) => {
            const isFeatured = index === featuredIndex;
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <Card
                  className={cn(
                    'h-full flex flex-col transition-all duration-300',
                    isFeatured
                      ? 'border-secondary shadow-xl scale-105 ring-2 ring-secondary/20'
                      : 'border-gray-200 dark:border-primary-700 hover:shadow-lg hover:border-secondary/50'
                  )}
                >
                  {isFeatured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-secondary text-white px-4 py-1 text-sm font-semibold">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-primary dark:text-white mb-2">
                      {pkg.name}
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-400">
                      {pkg.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold text-secondary">
                          {formatPrice(pkg.price, pkg.currency)}
                        </span>
                        {pkg.duration && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            / {pkg.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex-1 space-y-3 mb-6">
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className="shrink-0 mt-0.5">
                            <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center">
                              <Check className="w-3 h-3 text-secondary" />
                            </div>
                          </div>
                          <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => onSelectPackage?.(pkg)}
                      className={cn(
                        'w-full mt-auto',
                        isFeatured
                          ? 'bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg'
                          : 'bg-primary hover:bg-primary/90 text-white'
                      )}
                      size="lg"
                    >
                      Select Package
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

