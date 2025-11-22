'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  ShieldCheck,
  Star,
  Eye,
  Heart,
  Zap,
  Droplets,
  Wind,
  Wifi,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ShareProperty } from '@/components/property/ShareProperty';
import { QuickViewDialog } from '@/components/property/QuickViewDialog';
import { CompareButton } from '@/components/property/CompareButton';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

export function PropertyCard({ property, viewMode = 'grid' }: PropertyCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  // Format price with currency
  const formatPrice = (price: number, currency: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    return currency === 'USD' ? `$${formattedPrice}` : `${formattedPrice} ${currency}`;
  };

  // Get cover image or placeholder
  const coverImage =
    property.images && property.images.length > 0
      ? property.images[0].startsWith('http')
        ? property.images[0]
        : `http://localhost:8000/storage/${property.images[0]}`
      : null;

  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Implement actual favorite API call
  };

  // Check for special features/amenities for badges
  const hasSolarPower =
    property.amenities?.some((amenity) =>
      amenity.toLowerCase().includes('solar')
    ) || false;
  const hasPool =
    property.amenities?.some((amenity) =>
      amenity.toLowerCase().includes('pool')
    ) || false;
  const hasWifi =
    property.amenities?.some((amenity) =>
      amenity.toLowerCase().includes('wifi') ||
      amenity.toLowerCase().includes('internet')
    ) || false;

  const handleCardClick = () => {
    router.push(`/properties/${property.slug}`);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/properties/${property.slug}`);
  };

  const cardContent = (
    <motion.div
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300",
        viewMode === 'grid' ? 'flex flex-col h-full' : 'flex flex-row h-48'
      )}
      whileHover={viewMode === 'grid' ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
            {/* Image Area - Aspect Ratio 4:3 or fixed height for list */}
            <div className={cn(
              "relative overflow-hidden bg-gray-100",
              viewMode === 'grid' 
                ? 'w-full aspect-4/3 rounded-t-xl' 
                : 'w-48 h-full rounded-l-xl shrink-0'
            )}>
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={property.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-primary/30" />
                </div>
              )}

              {/* Overlay gradient on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

              {/* Badges - Top Left */}
              <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
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

              {/* Action Buttons - Top Right */}
              <div className="absolute top-3 right-3 flex gap-2 z-10">
                {/* Heart (Save/Wishlist) Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFavoriteToggle(e);
                  }}
                  className={cn(
                    'w-10 h-10 rounded-full',
                    'bg-white/90 hover:bg-white backdrop-blur-sm',
                    'flex items-center justify-center',
                    'shadow-md hover:shadow-lg',
                    'transition-all duration-200',
                    'hover:scale-110 active:scale-95',
                    isFavorite && 'bg-red-50'
                  )}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={cn(
                      'w-5 h-5 transition-all duration-200',
                      isFavorite
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-700 group-hover:text-red-500'
                    )}
                  />
                </button>
                
                {/* Share & Compare Buttons (Grid View Only) */}
                {viewMode === 'grid' && (
                  <>
                    <ShareProperty property={property} />
                    <CompareButton property={property} />
                  </>
                )}
              </div>

              {/* Quick View Button - Appears on Hover */}
              {viewMode === 'grid' && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setQuickViewOpen(true);
                    }}
                    className="bg-white/95 hover:bg-white text-primary border-0 shadow-xl backdrop-blur-sm"
                    size="lg"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Quick View
                  </Button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 flex flex-col">
              {/* Title - Truncate after 1 line */}
              <h3
                className="font-bold text-lg text-primary line-clamp-1 mb-2 group-hover:text-secondary transition-colors"
                title={property.title}
              >
                {property.title}
              </h3>

              {/* Location - Map Pin + Neighborhood */}
              <div className="flex items-center gap-1.5 text-gray-600 mb-4">
                <MapPin className="w-4 h-4 shrink-0" />
                <span className="text-sm font-light truncate">
                  {property.neighborhood?.name || 'Damascus'}
                </span>
              </div>

              {/* Features Row - Bed, Bath, Square */}
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {property.bedrooms || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {property.bathrooms || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Square className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    {property.area_sqm || 0} m²
                  </span>
                </div>
              </div>

              {/* Price - Prominently in Bronze */}
              <div className={cn(
                "mt-auto border-t border-gray-100",
                viewMode === 'grid' ? 'pt-2' : 'pt-3 flex items-center justify-between'
              )}>
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    "font-bold text-secondary",
                    viewMode === 'grid' ? 'text-2xl' : 'text-xl'
                  )}>
                    {formatPrice(property.price, property.currency)}
                  </span>
                  {property.type === 'rent' && (
                    <span className="text-sm font-light text-gray-500">
                      / month
                    </span>
                  )}
                  {property.type === 'hotel' && (
                    <span className="text-sm font-light text-gray-500">
                      / night
                    </span>
                  )}
                </div>
                {viewMode === 'list' && (
                  <Button
                    onClick={handleButtonClick}
                    size="sm"
                    className="bg-secondary hover:bg-secondary/90 text-white"
                  >
                    View Details
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
  );

  return (
    <>
      <motion.div
        className={cn(
          "group property-card-transition",
          viewMode === 'grid' ? 'cursor-pointer' : ''
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={viewMode === 'grid' ? { y: -4 } : {}}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {viewMode === 'grid' ? (
          <Link href={`/properties/${property.slug}`} className="block">
            {cardContent}
          </Link>
        ) : (
          cardContent
        )}
      </motion.div>

      {/* Quick View Dialog */}
      <QuickViewDialog
        property={quickViewOpen ? property : null}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
