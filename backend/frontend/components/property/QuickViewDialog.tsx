'use client';

import { Property } from '@/types';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Square, MapPin, ShieldCheck, Star, Zap, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';

interface QuickViewDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewDialog({ property, open, onOpenChange }: QuickViewDialogProps) {
  const { t, locale } = useLanguage();
  if (!property) return null;

  const formatPrice = (price: number, currency: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return currency === 'USD' ? `$${formattedPrice}` : `${formattedPrice} ${currency}`;
  };

  const coverImage =
    property.images && property.images.length > 0
      ? property.images[0].startsWith('http')
        ? property.images[0]
        : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || process.env.NEXT_PUBLIC_SITE_URL || 'https://damahomerealty.com'}/storage/${property.images[0]}`
      : null;

  const hasSolarPower =
    property.amenities?.some((amenity) => amenity.toLowerCase().includes('solar')) || false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Image */}
          <div className="relative w-full h-64 md:h-80 bg-gray-100">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={property.title}
                fill
                className="object-cover"
                sizes="100vw"
                quality={90}
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-primary/30" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {property.is_verified && (
                <Badge className="bg-secondary text-white border-0 shadow-md backdrop-blur-sm bg-opacity-95 flex items-center gap-1 px-2 py-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="text-xs font-medium">Verified</span>
                </Badge>
              )}
              {hasSolarPower && (
                <Badge className="bg-amber-500 text-white border-0 shadow-md backdrop-blur-sm bg-opacity-95 flex items-center gap-1 px-2 py-1">
                  <Zap className="w-3 h-3" />
                  <span className="text-xs font-medium">Solar Power</span>
                </Badge>
              )}
              {property.is_featured && (
                <Badge className="bg-secondary text-white border-0 shadow-md backdrop-blur-sm bg-opacity-95 flex items-center gap-1 px-2 py-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span className="text-xs font-medium">Featured</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title & Location */}
            <div>
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-2">{property.title}</h2>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>
                  {property.neighborhood?.name || t('common.damascus')}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-secondary">
                {formatPrice(property.price, property.currency)}
              </span>
              {property.type === 'rent' && (
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/month</span>
              )}
              {property.type === 'hotel' && (
                <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/night</span>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 dark:border-primary-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Bed className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t('property.bedrooms')}</div>
                  <div className="font-semibold text-lg">{property.bedrooms || 0}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Bath className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t('property.bathrooms')}</div>
                  <div className="font-semibold text-lg">{property.bathrooms || 0}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Square className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">{t('property.area')}</div>
                  <div className="font-semibold text-lg">{property.area_sqm || 0} {t('properties.areaUnit')}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('property.description')}</h3>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-4">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('property.amenities')}</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.slice(0, 6).map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {amenity}
                    </Badge>
                  ))}
                  {property.amenities.length > 6 && (
                    <Badge variant="outline" className="text-sm">
                      +{property.amenities.length - 6} {t('property.more')}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button asChild className="flex-1 bg-secondary hover:bg-secondary/90 text-white">
                <Link href={`/properties/${property.slug}`} onClick={() => onOpenChange(false)}>
                  {t('property.viewFullDetails')}
                </Link>
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300">
                {t('common.close')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

