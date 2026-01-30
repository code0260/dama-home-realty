'use client';

import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedProperties } from '@/components/sections/FeaturedProperties';
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel';
import { LatestNews } from '@/components/sections/LatestNews';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { AnimatedStats } from '@/components/sections/AnimatedStats';
import { SectionAnimation } from '@/components/animations/SectionAnimation';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useState, useEffect } from 'react';

export default function Home() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <HeroSection />
      
      {/* Animated Statistics Section */}
      <SectionAnimation delay={0.05}>
        <AnimatedStats />
      </SectionAnimation>
        
        {/* Featured Properties Section with Animation */}
        <SectionAnimation delay={0.1}>
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
                  {mounted ? t('home.whatClientsSay') : 'ماذا يقول عملاؤنا'}
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  {mounted ? t('home.clientsSaySubtitle') : 'استمع إلى عملائنا الراضين الذين وجدوا منزلهم المثالي في دمشق'}
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
                    {mounted ? t('home.latestNews') : 'آخر الأخبار'}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {mounted ? t('home.latestNewsSubtitle') : 'ابق على اطلاع بآخر أخبار العقارات والرؤى'}
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="hidden md:flex items-center gap-2 text-[#B49162] hover:text-[#0F172A] font-semibold transition-colors group"
                >
                  {mounted ? t('home.viewAll') : 'عرض الكل'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <LatestNews />
            </div>
          </section>
        </SectionAnimation>

        {/* CTA Section - Damascene Heritage Style */}
        <SectionAnimation delay={0.4}>
          <section className="py-24 md:py-32 text-white relative overflow-hidden bg-slate-900">
            {/* Subtle Islamic/Geometric Arabesque Pattern Layer */}
            <div className="absolute inset-0 opacity-5">
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='damascene' x='0' y='0' width='120' height='120' patternUnits='userSpaceOnUse'%3E%3Cpath d='M60 0L73.5 20L96 20L78 35L91.5 55L60 45L28.5 55L42 35L24 20L46.5 20Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M0 60L20 46.5L20 24L35 42L55 28.5L45 60L55 91.5L35 78L20 96L20 73.5Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M60 120L46.5 100L24 100L42 85L28.5 65L60 75L91.5 65L78 85L96 100L73.5 100Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M120 60L100 73.5L100 96L85 78L65 91.5L75 60L65 28.5L85 42L100 24L100 46.5Z' fill='%23B49162' opacity='0.3'/%3E%3Ccircle cx='60' cy='60' r='8' fill='%23B49162' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23damascene)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                }}
              />
            </div>

            {/* Additional subtle geometric overlay for depth */}
            <div className="absolute inset-0 opacity-3">
              <div 
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='hexagon' x='0' y='0' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cpath d='M40 0L60 10L60 30L40 40L20 30L20 10Z' fill='none' stroke='%23B49162' stroke-width='0.5' opacity='0.2'/%3E%3Cpath d='M40 40L60 50L60 70L40 80L20 70L20 50Z' fill='none' stroke='%23B49162' stroke-width='0.5' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23hexagon)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                }}
              />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white drop-shadow-lg">
                  {mounted ? t('home.readyToFind') : 'هل أنت مستعد للعثور على'} <span className="text-[#B49162]">{mounted ? t('home.perfectHome') : 'منزلك المثالي'}</span>?
                </h2>
                <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                  {mounted ? t('home.ctaSubtitle') : 'ابدأ رحلتك اليوم واكتشف عقارات موثقة في دمشق بمساعدة فريقنا الخبير'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#B49162] hover:bg-[#9A7A4F] text-white px-8 py-6 text-lg shadow-2xl group transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/properties">
                      <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      {mounted ? t('home.browseProperties') : 'تصفح العقارات'}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-[#0F172A] px-8 py-6 text-lg backdrop-blur-sm font-semibold transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/contact">
                      <Phone className="w-5 h-5 mr-2" />
                      {mounted ? t('home.contactUs') : 'اتصل بنا'}
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
