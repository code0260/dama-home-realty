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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const property = await getPropertyForMetadata(slug);
    
    if (!property) {
      return {
        title: 'Property Not Found',
        description: 'The property you are looking for does not exist.',
      };
    }
    
    // Get main image URL
    const mainImage = property.images && property.images.length > 0
      ? (property.images[0].startsWith('http')
          ? property.images[0]
          : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${property.images[0]}`)
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-image.jpg`;

    // Truncate description for metadata (max 160 characters)
    const description = property.description
      ? property.description.length > 160
        ? property.description.substring(0, 157) + '...'
        : property.description
      : `Property in ${property.neighborhood?.name || 'Damascus'}. ${property.type === 'rent' ? 'For rent' : property.type === 'sale' ? 'For sale' : 'Hotel'} property.`;

    const title = `${property.title} in ${property.neighborhood?.name || 'Damascus'} - Dama Home Realty`;
    const price = property.currency === 'USD' 
      ? `$${property.price.toLocaleString()}` 
      : `${property.price.toLocaleString()} ${property.currency}`;
    const priceText = property.type === 'rent' ? `${price}/month` : price;

    return {
      title: property.title,
      description: description,
      keywords: [
        property.title,
        property.neighborhood?.name || 'Damascus',
        property.type === 'rent' ? 'rent Damascus' : property.type === 'sale' ? 'buy Damascus' : 'hotel Damascus',
        'Damascus real estate',
        'Syria properties',
      ],
      openGraph: {
        title: title,
        description: `${description} Price: ${priceText}`,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/properties/${slug}`,
        siteName: 'Dama Home Realty',
        images: [
          {
            url: mainImage,
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: `${description} Price: ${priceText}`,
        images: [mainImage],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/properties/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
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
