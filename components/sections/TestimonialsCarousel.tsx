'use client';

import { useEffect, useState } from 'react';
import { Testimonial } from '@/types';
import { getTestimonials } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface TestimonialsCarouselProps {
  featured?: boolean;
  locale?: string;
}

export function TestimonialsCarousel({ featured = false, locale = 'en' }: TestimonialsCarouselProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="min-w-[350px] shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {testimonial.photo ? (
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.client_name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {testimonial.client_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{testimonial.client_name}</h4>
                    {testimonial.country_flag && (
                      <span className="text-2xl">{testimonial.country_flag}</span>
                    )}
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

