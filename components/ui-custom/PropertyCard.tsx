'use client';

import { Property } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Bath, Square, MapPin, ShieldCheck, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
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
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-200">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-primary/40" />
          </div>
        )}
        
        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          <Badge className={`${typeColors[property.type] || 'bg-gray-500'} text-white`}>
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </Badge>
          {property.is_featured && (
            <Badge className="bg-secondary text-white flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </Badge>
          )}
        </div>

        {/* Verified Badge - Golden */}
        {property.is_verified && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-[#B49162] text-white flex items-center gap-1 shadow-lg">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </Badge>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute bottom-2 right-2">
          <Badge className={statusColors[property.status] || 'bg-gray-100 text-gray-800'}>
            {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="flex-1">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <MapPin className="w-4 h-4" />
          <span>{property.neighborhood?.name || 'Damascus'}</span>
        </div>
        <div className="text-2xl font-bold text-primary mb-2">
          {formatPrice(property.price, property.currency)}
          {property.type === 'rent' && <span className="text-sm font-normal text-gray-500">/month</span>}
        </div>
      </CardHeader>

      {/* Features Row */}
      <CardContent className="pt-0">
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
      <CardFooter className="pt-4">
        <Button asChild className="w-full bg-primary hover:bg-primary/90">
          <Link href={`/properties/${property.slug}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

