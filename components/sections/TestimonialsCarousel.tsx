'use client';

import { useEffect, useState, useRef } from 'react';
import { Testimonial } from '@/types';
import { getTestimonials } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Image from 'next/image';

interface TestimonialsCarouselProps {
  featured?: boolean;
  locale?: string;
}

export function TestimonialsCarousel({ featured = false, locale = 'en' }: TestimonialsCarouselProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await getTestimonials(featured, locale);
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [featured, locale]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 350; // Width of card + gap
    const scrollPosition = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });

    // Update current index based on scroll position
    const newIndex = direction === 'left' 
      ? Math.max(0, currentIndex - 1)
      : Math.min(testimonials.length - 1, currentIndex + 1);
    setCurrentIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {testimonials.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg border-[#B49162] text-[#B49162] hover:text-[#0F172A] -translate-x-4"
            onClick={() => scroll('left')}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg border-[#B49162] text-[#B49162] hover:text-[#0F172A] translate-x-4"
            onClick={() => scroll('right')}
            disabled={currentIndex >= testimonials.length - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-6 min-w-max">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="min-w-[350px] max-w-[350px] shadow-lg border-0 bg-white snap-start"
            >
              <CardContent className="p-8 relative">
                {/* Large Quote Icon - Bronze */}
                <Quote className="absolute top-6 left-6 w-16 h-16 text-[#B49162]/20" />
                
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'fill-[#B49162] text-[#B49162]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-base leading-relaxed mb-6 relative z-10">
                  "{testimonial.comment}"
                </p>

                {/* Client Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  {testimonial.photo ? (
                    <Image
                      src={testimonial.photo}
                      alt={testimonial.client_name}
                      width={50}
                      height={50}
                      className="rounded-full object-cover border-2 border-[#B49162]/30"
                    />
                  ) : (
                    <div className="w-[50px] h-[50px] rounded-full bg-[#B49162]/10 flex items-center justify-center text-lg font-bold text-[#B49162] border-2 border-[#B49162]/30">
                      {testimonial.client_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-[#0F172A]">{testimonial.client_name}</h4>
                    {testimonial.country_flag && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl">{testimonial.country_flag}</span>
                        <span className="text-sm text-gray-500">Verified Guest</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    left: index * 356, // 350px card + 6px gap
                    behavior: 'smooth',
                  });
                  setCurrentIndex(index);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#B49162] w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

