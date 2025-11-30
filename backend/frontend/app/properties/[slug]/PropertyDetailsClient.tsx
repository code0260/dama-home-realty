'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Property } from '@/types';
import { getPropertyBySlug, getFeaturedProperties } from '@/lib/api';
import { EnhancedImageGallery } from '@/components/property/EnhancedImageGallery';
import { ExpandableSection } from '@/components/property/ExpandableSection';
import { PropertyTimeline } from '@/components/property/PropertyTimeline';
import { PriceHistory } from '@/components/property/PriceHistory';
import { SimilarProperties } from '@/components/property/SimilarProperties';
import { NearbyProperties } from '@/components/property/NearbyProperties';
import { NeighborhoodInfo } from '@/components/property/NeighborhoodInfo';
import { LiveChat } from '@/components/property/LiveChat';
import { VideoCallButton } from '@/components/property/VideoCallButton';
import { PriceCalculator } from '@/components/property/PriceCalculator';
import { BookingTerms } from '@/components/property/BookingTerms';
import { PropertyShare } from '@/components/property/PropertyShare';
import { SocialProof } from '@/components/property/SocialProof';
import { PropertyCard } from '@/components/ui-custom/PropertyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  ShieldCheck,
  Share2,
  Heart,
  Phone,
  MessageCircle,
  Home,
} from 'lucide-react';
import { BookingForm } from '@/components/property/BookingForm';
import { AgentCard } from '@/components/property/AgentCard';
import { ScheduleLiveTourDialog } from '@/components/property/ScheduleLiveTourDialog';
import { ShareModal } from '@/components/property/ShareModal';
import { AmenityIcon } from '@/components/property/AmenityIcon';
import { PropertyMap } from '@/components/property/PropertyMap';

interface PropertyDetailsClientProps {
  slug: string;
}

export default function PropertyDetailsClient({ slug }: PropertyDetailsClientProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPropertyBySlug(slug, 'en');
        setProperty(data);

        // Fetch related properties
        const related = await getFeaturedProperties(3, data.uuid, 'en');
        setRelatedProperties(related);
      } catch (err: any) {
        console.error('Error fetching property:', err);
        setError(err.response?.status === 404 ? 'Property not found' : 'Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProperty();
    }
  }, [slug]);

  const formatPrice = (price: number, currency: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    return currency === 'USD' ? `$${formattedPrice}` : `${formattedPrice} ${currency}`;
  };

  const getWhatsAppLink = (phone: string | undefined | null) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone ? `https://wa.me/${cleanPhone}` : '#';
  };

  const getTelegramLink = (phone: string | undefined | null) => {
    if (!phone) return '#';
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone ? `https://t.me/${cleanPhone}` : '#';
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Save to favorites (localStorage or API)
    if (!isSaved) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (!favorites.includes(property?.uuid)) {
        favorites.push(property?.uuid);
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
    } else {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const filtered = favorites.filter((id: string) => id !== property?.uuid);
      localStorage.setItem('favorites', JSON.stringify(filtered));
    }
  };

  // Check if property is saved on mount
  useEffect(() => {
    // Only run after component is mounted
    if (!property?.uuid) return;
    
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsSaved(favorites.includes(property.uuid));
    } catch (error) {
      console.error('Error reading favorites from localStorage:', error);
      setIsSaved(false);
    }
  }, [property?.uuid]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The property you are looking for does not exist.'}</p>
          <Button asChild>
            <Link href="/">Go Back Home</Link>
          </Button>
      </div>
    );
  }

  // Generate JSON-LD structured data for SEO
  const jsonLd = property ? {
    '@context': 'https://schema.org',
    '@type': property.type === 'hotel' ? 'Hotel' : 'RealEstateAgent',
    name: property.title,
    description: property.description,
    image: property.images && property.images.length > 0 
      ? property.images.map((img: string) => 
          img.startsWith('http') 
            ? img 
            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || process.env.NEXT_PUBLIC_SITE_URL || 'https://damahomerealty.com'}/storage/${img}`
        )
      : [],
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.neighborhood?.name || 'Damascus',
      addressCountry: 'SY',
    },
    ...(property.type === 'hotel' ? {
      priceRange: property.price ? `${property.currency || 'USD'} ${property.price}` : undefined,
      numberOfRooms: property.bedrooms,
    } : property.price ? {
      offers: {
        '@type': 'Offer',
        price: property.price,
        priceCurrency: property.currency || 'USD',
        availability: property.status === 'active' 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
      },
    } : {}),
    aggregateRating: property.is_verified ? {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '10',
    } : undefined,
  } : null;

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 dark:bg-slate-800/50 border-b dark:border-slate-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/properties">Properties</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">{property.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Image Gallery */}
          <div className="mb-8">
            <EnhancedImageGallery 
              images={property.images || []} 
              title={property.title}
              floorPlans={[]}
              videoUrl={property.video_url || undefined}
              virtualTourUrl={property.video_url || undefined}
            />
          </div>

          {/* Header Section - Below Images */}
          <div className="mb-12 pb-8 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                {/* Title and Badges */}
                <div className="flex items-center gap-2 mb-3">
                  {property.is_verified && (
                    <Badge className="bg-secondary text-white flex items-center gap-1 border-0">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                  {property.type && (
                    <Badge
                      className={
                        property.type === 'sale'
                          ? 'bg-green-500 text-white border-0'
                          : property.type === 'rent'
                          ? 'bg-blue-500 text-white border-0'
                          : 'bg-purple-500 text-white border-0'
                      }
                    >
                      {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </Badge>
                  )}
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3">
                  {property.title}
                </h1>
                
                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <span className="text-lg">{property.neighborhood?.name || 'Damascus'}</span>
                </div>
                
                {/* Price - Large, Bold, Bronze */}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-bold text-secondary">
                    {formatPrice(property.price, property.currency)}
                  </span>
                  {property.type === 'rent' && (
                    <span className="text-xl font-normal text-gray-500">/month</span>
                  )}
                  {property.type === 'hotel' && (
                    <span className="text-xl font-normal text-gray-500">/night</span>
                  )}
                </div>
                
                {property.reference_id && (
                  <p className="text-sm text-gray-500 mt-3">
                    Reference: <span className="font-semibold text-primary">{property.reference_id}</span>
                  </p>
                )}
              </div>
              
              {/* Action Buttons - Share & Save */}
              <div className="flex gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleShare}
                    className="w-12 h-12 rounded-full border-gray-300 hover:border-secondary hover:bg-secondary/10 transition-colors"
                  >
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </Button>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  animate={isSaved ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleSave}
                    className={`w-12 h-12 rounded-full transition-colors ${
                      isSaved
                        ? 'bg-secondary hover:bg-secondary/90 text-white border-secondary'
                        : 'border-gray-300 hover:border-secondary hover:bg-secondary/10'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {isSaved ? (
                        <motion.div
                          key="filled"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 180 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart className="w-5 h-5 fill-current" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="outline"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Heart className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Main Content & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description - Expandable */}
              <section>
                <ExpandableSection
                  title="Description"
                  defaultExpanded={true}
                  className="prose max-w-none"
                >
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
                    {property.description}
                  </p>
                </ExpandableSection>
              </section>

              {/* Property Timeline */}
              <section>
                <PropertyTimeline property={property} />
              </section>

              {/* Price History */}
              <section>
                <PriceHistory property={property} />
              </section>

              {/* Neighborhood Info */}
              {property.neighborhood && (
                <section>
                  <NeighborhoodInfo property={property} />
                </section>
              )}

              {/* Key Features */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">Key Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Bed className="w-8 h-8 text-primary mb-2" />
                    <span className="text-2xl font-bold text-primary">{property.bedrooms}</span>
                    <span className="text-sm text-gray-600">Bedrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Bath className="w-8 h-8 text-primary mb-2" />
                    <span className="text-2xl font-bold text-primary">{property.bathrooms}</span>
                    <span className="text-sm text-gray-600">Bathrooms</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Square className="w-8 h-8 text-primary mb-2" />
                    <span className="text-2xl font-bold text-primary">{property.area_sqm}</span>
                    <span className="text-sm text-gray-600">m²</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                    <Home className="w-8 h-8 text-primary mb-2" />
                    <span className="text-2xl font-bold text-primary">
                      {property.type ? property.type.charAt(0).toUpperCase() + property.type.slice(1) : 'N/A'}
                    </span>
                    <span className="text-sm text-gray-600">Type</span>
                  </div>
                </div>
              </section>

              {/* Social Proof */}
              <section>
                <SocialProof property={property} />
              </section>

              {/* Amenities - Grid of Cards */}
              {property.amenities && property.amenities.length > 0 && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary dark:text-white mb-6">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="flex flex-col items-center justify-center p-5 bg-white dark:bg-primary-800 border border-gray-200 dark:border-primary-700 rounded-xl hover:border-secondary hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="mb-3 p-3 bg-secondary/10 rounded-full group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300">
                          <AmenityIcon 
                            amenity={amenity} 
                            size={28} 
                            className="text-secondary group-hover:scale-110 transition-transform" 
                          />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center">{amenity}</span>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Video Tour */}
              {property.video_url && (
                <section>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-6">Video Tour</h2>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-xl">
                    <iframe
                      src={property.video_url}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Property Video Tour"
                    />
                  </div>
                </section>
              )}

              {/* Map Section - Custom Styled Container */}
              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Location</h2>
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                  <PropertyMap property={property} />
                </div>
              </section>
            </div>

            {/* Sidebar - Booking Form / Contact Agent - Sticky with Glass Effect */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl shadow-xl bg-white/95 backdrop-blur-md border border-gray-200/50 p-6 glass-effect"
                >
                  {/* Booking Form (for hotel/rent properties) */}
                  {['hotel', 'rent'].includes(property.type) && (
                    <>
                      <PriceCalculator property={property} />
                      <div className="mt-4">
                        <BookingForm property={property} />
                      </div>
                      <div className="mt-4">
                        <BookingTerms property={property} />
                      </div>
                    </>
                  )}

                  {/* Agent Card (if agent assigned) */}
                  {property.agent && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6 space-y-4">
                      <AgentCard agent={property.agent} property={property} />
                      <LiveChat property={property} agentPhone={property.agent.phone || undefined} />
                      <VideoCallButton property={property} agentPhone={property.agent.phone || undefined} />
                    </div>
                  )}

                  {/* Fallback Contact Card (if no agent) */}
                  {!property.agent && (
                    <div>
                      <h3 className="text-xl font-bold text-[#0F172A] mb-4">Contact Agent</h3>
                      <div className="space-y-4">
                        {property.owner_contact && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Phone</p>
                              <p className="font-semibold text-[#0F172A]">{property.owner_contact}</p>
                            </div>

                            {/* WhatsApp Button with Pulse Animation */}
                            <motion.div
                              animate={{
                                boxShadow: [
                                  '0 0 0 0 rgba(37, 211, 102, 0.7)',
                                  '0 0 0 10px rgba(37, 211, 102, 0)',
                                  '0 0 0 0 rgba(37, 211, 102, 0)',
                                ],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            >
                              <Button
                                asChild
                                className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white shadow-lg"
                                size="lg"
                                disabled={!property.owner_contact}
                              >
                                <a
                                  href={getWhatsAppLink(property.owner_contact)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <MessageCircle className="w-5 h-5 mr-2" />
                                  WhatsApp
                                </a>
                              </Button>
                            </motion.div>

                            {/* Telegram Button */}
                            <Button
                              asChild
                              variant="outline"
                              className="w-full border-blue-500 text-blue-500 hover:bg-blue-50"
                              size="lg"
                              disabled={!property.owner_contact}
                            >
                              <a
                                href={getTelegramLink(property.owner_contact)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Telegram
                              </a>
                            </Button>

                            {/* Call Button */}
                            <Button
                              asChild
                              variant="outline"
                              className="w-full border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white"
                              size="lg"
                              disabled={!property.owner_contact}
                            >
                              <a href={`tel:${property.owner_contact}`}>
                                <Phone className="w-5 h-5 mr-2" />
                                Call Now
                              </a>
                            </Button>
                          </>
                        )}
                        {!property.owner_contact && (
                          <p className="text-sm text-gray-500 text-center">Contact information not available</p>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Schedule Live Video Tour */}
                <ScheduleLiveTourDialog property={property} />

                {/* Property Status */}
                {property.status && (
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <Badge
                      className={
                        property.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'sold'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-orange-100 text-orange-800'
                      }
                    >
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          <section className="mt-16">
            <SimilarProperties currentProperty={property} />
          </section>

          {/* Nearby Properties */}
          <section className="mt-16">
            <NearbyProperties currentProperty={property} />
          </section>

          {/* Related Properties - Fallback */}
          {relatedProperties.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold text-primary dark:text-white mb-8">Related Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProperties.map((relatedProperty) => (
                  <PropertyCard key={relatedProperty.uuid} property={relatedProperty} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Property Share Modal */}
      {property && (
        <PropertyShare
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          property={property}
        />
      )}
    </>
  );
}

