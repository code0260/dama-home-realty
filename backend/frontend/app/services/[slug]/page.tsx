import type { Metadata } from 'next';
import ServiceDetailsClient from './ServiceDetailsClient';

type Props = {
  params: Promise<{ slug: string }>;
};

async function getServiceForMetadata(slug: string) {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
    const response = await fetch(`${baseURL}/api/services/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching service for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceForMetadata(slug);

  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.title} | Dama Home Realty`,
    description: service.description || `Learn more about ${service.title} services`,
    openGraph: {
      title: service.title,
      description: service.description,
      type: 'website',
    },
  };
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { slug } = await params;
  return <ServiceDetailsClient slug={slug} />;
}

