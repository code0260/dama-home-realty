'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Property } from '@/types';
import { getPropertyBySlug, getFeaturedProperties } from '@/lib/api';
import { ImageGallery } from '@/components/property/ImageGallery';
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
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { BookingForm } from '@/components/property/BookingForm';
import { AgentCard } from '@/components/property/AgentCard';
import { ScheduleLiveTourDialog } from '@/components/property/ScheduleLiveTourDialog';

interface PropertyDetailsClientProps {
  slug: string;
}

export default function PropertyDetailsClient({ slug }: PropertyDetailsClientProps) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The property you are looking for does not exist.'}</p>
          <Button asChild>
            <Link href="/">Go Back Home</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumbs */}
        <div className="bg-gray-50 border-b">
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
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {property.is_verified && (
                    <Badge className="bg-[#B49162] text-white flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                  {property.type && (
                    <Badge
                      className={
                        property.type === 'sale'
                          ? 'bg-green-500'
                          : property.type === 'rent'
                          ? 'bg-blue-500'
                          : 'bg-purple-500'
                      }
                    >
                      {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">{property.title}</h1>
                {property.reference_id && (
                  <p className="text-sm text-gray-500 mb-2">Reference: <span className="font-semibold text-primary">{property.reference_id}</span></p>
                )}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-5 h-5" />
                  <span>{property.neighborhood?.name || 'Damascus'}</span>
                </div>
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(property.price, property.currency)}
                  {property.type === 'rent' && <span className="text-lg font-normal text-gray-500">/month</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-12">
            <ImageGallery images={property.images || []} title={property.title} />
          </div>

          {/* Main Content & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
                </div>
              </section>

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

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-primary mb-4">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* Video Tour */}
              {property.video_url && (
                <section>
                  <h2 className="text-2xl font-bold text-primary mb-4">Video Tour</h2>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
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
            </div>

            {/* Sidebar - Booking Form / Contact Agent */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Booking Form (for hotel/rent properties) */}
                {['hotel', 'rent'].includes(property.type) && (
                  <BookingForm property={property} />
                )}

                {/* Agent Card (if agent assigned) */}
                {property.agent ? (
                  <AgentCard agent={property.agent} property={property} />
                ) : (
                  /* Fallback Contact Card */
                  <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-primary mb-4">Contact Agent</h3>
                    <div className="space-y-4">
                      {property.owner_contact && (
                        <>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Phone</p>
                            <p className="font-semibold">{property.owner_contact}</p>
                          </div>

                          {/* WhatsApp Button */}
                          <Button
                            asChild
                            className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
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
                            className="w-full"
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

          {/* Related Properties */}
          {relatedProperties.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold text-primary mb-8">Related Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProperties.map((relatedProperty) => (
                  <PropertyCard key={relatedProperty.uuid} property={relatedProperty} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

