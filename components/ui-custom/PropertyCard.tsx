'use client';

import { useState } from 'react';
import { Property } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Bed, Bath, Square, MapPin, ShieldCheck, Star, Eye, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    
    return currency === 'USD' ? `$${formattedPrice}` : `${formattedPrice} ${currency}`;
  };

  // Get cover image or placeholder
  const coverImage = property.images && property.images.length > 0 
    ? (property.images[0].startsWith('http') ? property.images[0] : `http://localhost:8000/storage/${property.images[0]}`)
    : null;

  // Type badge colors
  const typeColors: Record<string, string> = {
    rent: 'bg-blue-500',
    sale: 'bg-green-500',
    hotel: 'bg-purple-500',
  };

  // Status badge colors
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    sold: 'bg-gray-100 text-gray-800',
    rented: 'bg-orange-100 text-orange-800',
  };

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-0 shadow-md">
        {/* Image Container - 60% of card height */}
        <div className="relative w-full h-[60%] min-h-[240px] overflow-hidden bg-gray-200">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={property.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-[#0F172A]/20 to-[#B49162]/20 flex items-center justify-center">
              <MapPin className="w-16 h-16 text-[#0F172A]/40" />
            </div>
          )}
          
          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            <Badge className={`${typeColors[property.type] || 'bg-gray-500'} text-white border-0 shadow-md`}>
              {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
            </Badge>
            {property.is_featured && (
              <Badge className="bg-[#B49162] text-white flex items-center gap-1 border-0 shadow-md">
                <Star className="w-3 h-3 fill-white" />
                Featured
              </Badge>
            )}
          </div>

          {/* Verified Badge - Bronze */}
          {property.is_verified && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-[#B49162] text-white flex items-center gap-1 shadow-lg border-0">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </Badge>
            </div>
          )}

          {/* Quick View Button - Appears on Hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Button
              onClick={() => setQuickViewOpen(true)}
              className="bg-white/95 hover:bg-white text-[#0F172A] border-0 shadow-xl"
              size="lg"
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick View
            </Button>
          </div>

          {/* Status Badge */}
          {property.status !== 'active' && (
            <div className="absolute bottom-3 right-3 z-10">
              <Badge className={statusColors[property.status] || 'bg-gray-100 text-gray-800 border-0 shadow-md'}>
                {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
              </Badge>
            </div>
          )}
        </div>

        {/* Content - 40% of card height */}
        <CardHeader className="flex-1 p-5">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-[#B49162] transition-colors text-[#0F172A]">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4" />
            <span>{property.neighborhood?.name || 'Damascus'}</span>
          </div>
          <div className="text-2xl font-bold text-[#B49162] mb-3">
            {formatPrice(property.price, property.currency)}
            {property.type === 'rent' && <span className="text-sm font-normal text-gray-500">/month</span>}
          </div>
        </CardHeader>

        {/* Features Row */}
        <CardContent className="pt-0 px-5 pb-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.area_sqm} m²</span>
            </div>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="pt-0 px-5 pb-5">
          <Button asChild className="w-full bg-[#0F172A] hover:bg-[#0F172A]/90 text-white border-0 shadow-md">
            <Link href={`/properties/${property.slug}`}>
              View Details
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Quick View Dialog */}
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Image */}
            {coverImage && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={coverImage}
                  alt={property.title}
                  fill
                  className="object-cover"
                  quality={90}
                />
              </div>
            )}

            {/* Title & Location */}
            <div>
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">{property.title}</h2>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{property.neighborhood?.name || 'Damascus'}</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-[#B49162]">
              {formatPrice(property.price, property.currency)}
              {property.type === 'rent' && <span className="text-lg font-normal text-gray-500">/month</span>}
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y">
              <div className="flex items-center gap-2">
                <Bed className="w-5 h-5 text-[#B49162]" />
                <div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                  <div className="font-semibold">{property.bedrooms}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-[#B49162]" />
                <div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                  <div className="font-semibold">{property.bathrooms}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5 text-[#B49162]" />
                <div>
                  <div className="text-sm text-gray-600">Area</div>
                  <div className="font-semibold">{property.area_sqm} m²</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-gray-600 line-clamp-4">{property.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button asChild className="flex-1 bg-[#0F172A] hover:bg-[#0F172A]/90 text-white">
                <Link href={`/properties/${property.slug}`} onClick={() => setQuickViewOpen(false)}>
                  View Full Details
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => setQuickViewOpen(false)}
                className="border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A]/10"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

