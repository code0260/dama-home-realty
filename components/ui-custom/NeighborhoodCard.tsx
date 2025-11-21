'use client';

import { Neighborhood } from '@/types';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
  propertyCount?: number;
}

export function NeighborhoodCard({ neighborhood, propertyCount }: NeighborhoodCardProps) {
  // Get image or placeholder
  const imageUrl = neighborhood.image 
    ? (neighborhood.image.startsWith('http') ? neighborhood.image : `http://localhost:8000/storage/${neighborhood.image}`)
    : null;

  return (
    <Link href={`/neighborhoods/${neighborhood.slug}`}>
      <Card className="group relative overflow-hidden h-64 cursor-pointer hover:shadow-xl transition-all duration-300">
        {/* Background Image */}
        <div className="relative w-full h-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={neighborhood.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              quality={85}
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/30 to-secondary/30" />
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-secondary">{neighborhood.city}</span>
            </div>
            <h3 className="text-2xl font-bold mb-2 group-hover:text-secondary transition-colors">
              {neighborhood.name}
            </h3>
            {neighborhood.description && (
              <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                {neighborhood.description}
              </p>
            )}
            {propertyCount !== undefined && (
              <div className="text-sm text-gray-300">
                {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

