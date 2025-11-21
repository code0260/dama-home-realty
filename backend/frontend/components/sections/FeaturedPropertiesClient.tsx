'use client';

import { Property } from '@/types';
import { PropertyCard } from '@/components/ui-custom/PropertyCard';

interface FeaturedPropertiesClientProps {
  properties: Property[];
}

export function FeaturedPropertiesClient({ properties }: FeaturedPropertiesClientProps) {
  if (properties.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No featured properties available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
            Featured <span className="text-[#B49162]">Properties</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties in Damascus
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.uuid} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}

