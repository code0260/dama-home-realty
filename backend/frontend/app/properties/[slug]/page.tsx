import type { Metadata } from 'next';
import PropertyDetailsClient from './PropertyDetailsClient';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPropertyForMetadata(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    const response = await fetch(`${baseUrl}/properties/${slug}?locale=en`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching property for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    // Await params as per Next.js 15+ requirements
    const { slug } = await params;
    
    if (!slug || typeof slug !== 'string') {
      return {
        title: 'Property Not Found',
        description: 'The property you are looking for does not exist.',
      };
    }
    
    // Safe data fetching with error handling
    let property: any = null;
    try {
      property = await getPropertyForMetadata(slug);
    } catch (fetchError) {
      console.error('Error fetching property for metadata:', fetchError);
    }
    
    // Return default metadata if property not found
    if (!property || typeof property !== 'object') {
      return {
        title: 'Property Not Found',
        description: 'The property you are looking for does not exist.',
      };
    }
    
    // Safe property fields extraction with defensive coding
    const propertyTitle = property?.title || 'Property';
    const neighborhoodName = property?.neighborhood?.name || 'Damascus';
    const propertyType = property?.type || 'property';
    const propertyDescription = property?.description || '';
    const propertyImages = Array.isArray(property?.images) ? property.images : [];
    
    // Get main image URL with safe fallback
    const firstImage = propertyImages[0];
    const mainImage = firstImage
      ? (typeof firstImage === 'string' && firstImage.startsWith('http')
          ? firstImage
          : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || process.env.NEXT_PUBLIC_SITE_URL || 'https://damahomerealty.com'}/storage/${firstImage}`)
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-image.jpg`;

    // Truncate description for metadata (max 160 characters)
    const descriptionText = propertyDescription
      ? propertyDescription.length > 160
        ? propertyDescription.substring(0, 157) + '...'
        : propertyDescription
      : `Property in ${neighborhoodName}. ${propertyType === 'rent' ? 'For rent' : propertyType === 'sale' ? 'For sale' : propertyType === 'hotel' ? 'Hotel' : 'Property'} property.`;

    // Safe price formatting with defensive checks
    const priceValue = property?.price;
    const currency = property?.currency || 'USD';
    let priceText = '';
    
    if (priceValue != null && typeof priceValue === 'number' && priceValue > 0) {
      const formattedPrice = priceValue.toLocaleString('en-US');
      const price = currency === 'USD' 
        ? `$${formattedPrice}` 
        : `${formattedPrice} ${currency}`;
      priceText = propertyType === 'rent' ? `${price}/month` : price;
    } else {
      priceText = 'Price on request';
    }

    // Build title safely
    const metadataTitle = `${propertyTitle} in ${neighborhoodName} - Dama Home Realty`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://damahomerealty.com';
    const canonicalUrl = `${siteUrl}/properties/${slug}`;

    // Build keywords array safely
    const keywords = [
      propertyTitle,
      neighborhoodName,
      propertyType === 'rent' ? 'rent Damascus' : propertyType === 'sale' ? 'buy Damascus' : propertyType === 'hotel' ? 'hotel Damascus' : 'Damascus property',
      'Damascus real estate',
      'Syria properties',
    ].filter(Boolean); // Remove any falsy values

    // Construct Open Graph description
    const ogDescription = priceText 
      ? `${descriptionText} Price: ${priceText}`
      : descriptionText;

    // Return comprehensive metadata
    return {
      title: propertyTitle,
      description: descriptionText,
      keywords: keywords.length > 0 ? keywords : ['Damascus real estate', 'Syria properties'],
      openGraph: {
        title: metadataTitle,
        description: ogDescription,
        type: 'website',
        url: canonicalUrl,
        siteName: 'Dama Home Realty',
        images: [
          {
            url: mainImage,
            width: 1200,
            height: 630,
            alt: propertyTitle,
          },
        ],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: metadataTitle,
        description: ogDescription,
        images: [mainImage],
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    // Comprehensive error handling
    console.error('Error generating metadata:', error);
    
    // Return safe fallback metadata
    return {
      title: 'Property Not Found',
      description: 'The property you are looking for does not exist.',
    };
  }
}

export default async function PropertyDetailsPage({ params }: Props) {
  const { slug } = await params;
  return <PropertyDetailsClient slug={slug} />;
}
