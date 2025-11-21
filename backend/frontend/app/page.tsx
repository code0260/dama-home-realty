import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedProperties } from '@/components/sections/FeaturedProperties';
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel';
import { LatestNews } from '@/components/sections/LatestNews';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { SectionAnimation } from '@/components/animations/SectionAnimation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

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
    <>
      <HeroSection />
        
        {/* Featured Properties Section with Animation */}
        <SectionAnimation>
          <FeaturedProperties />
        </SectionAnimation>

        {/* Features Section */}
        <SectionAnimation delay={0.1}>
          <FeaturesSection />
        </SectionAnimation>

        {/* Testimonials Section with Animation */}
        <SectionAnimation delay={0.2}>
          <section className="py-20 bg-linear-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
                  What Our <span className="text-[#B49162]">Clients Say</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Hear from our satisfied clients who found their perfect home in Damascus
                </p>
              </div>
              <TestimonialsCarousel featured={true} />
            </div>
          </section>
        </SectionAnimation>

        {/* Latest News Section with Animation */}
        <SectionAnimation delay={0.3}>
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-2">
                    Latest <span className="text-[#B49162]">News</span>
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Stay updated with the latest real estate news and insights
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="hidden md:flex items-center gap-2 text-[#B49162] hover:text-[#0F172A] font-semibold transition-colors group"
                >
                  View All
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <LatestNews />
            </div>
          </section>
        </SectionAnimation>

        {/* CTA Section */}
        <SectionAnimation delay={0.4}>
          <section className="py-20 bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjQkQ5MTYyIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMEYxNzJBIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] repeat" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Find Your Perfect Home?
                </h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                  Start your journey today and discover verified properties in Damascus with the help of our expert team
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#B49162] hover:bg-[#9A7A4F] text-white px-8 py-6 text-lg shadow-xl group"
                  >
                    <Link href="/properties">
                      <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Browse Properties
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg backdrop-blur-sm"
                  >
                    <Link href="/contact">
                      <Phone className="w-5 h-5 mr-2" />
                      Contact Us
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </SectionAnimation>
    </>
  );
}
