import type { Metadata } from 'next';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedProperties } from '@/components/sections/FeaturedProperties';
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Find your perfect home in Damascus. Browse verified properties for rent, sale, or hotel stays. Connecting Syrian expats with trusted homes in their homeland.',
  keywords: [
    'Damascus real estate',
    'luxury homes Damascus',
    'Syria properties',
    'Damascus apartments for rent',
    'Damascus houses for sale',
    'Syrian expats',
    'Damascus hotels',
    'verified properties Syria',
  ],
  openGraph: {
    title: 'Dama Home Realty - Find Your Perfect Home in Damascus',
    description:
      'Browse verified properties in Damascus. Rent, buy, or book your next home in Syria\'s historic capital.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dama Home Realty - Properties in Damascus',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dama Home Realty - Find Your Perfect Home in Damascus',
    description:
      'Browse verified properties in Damascus. Rent, buy, or book your next home in Syria\'s historic capital.',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProperties />
        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">What Our Clients Say</h2>
            <TestimonialsCarousel featured={true} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
