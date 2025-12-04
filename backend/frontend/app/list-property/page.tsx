'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ShieldCheck, TrendingUp, Clock } from 'lucide-react';
import { MultiStepPropertyForm } from '@/components/property/MultiStepPropertyForm';
import { PropertyManagement } from '@/components/property/PropertyManagement';
import { Property } from '@/types';
import { getPropertyBySlug } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default function ListPropertyPage() {
  const router = useRouter();
  const [propertySlug, setPropertySlug] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [showManagement, setShowManagement] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('edit');
      setPropertySlug(slug);
      setLoading(!!slug);
    }
  }, []);

  useEffect(() => {
    if (propertySlug) {
      fetchProperty(propertySlug);
    } else {
      setProperty(null);
      setShowManagement(false);
    }
  }, [propertySlug]);

  const fetchProperty = async (slug: string) => {
    try {
      setLoading(true);
      const propertyData = await getPropertyBySlug(slug);
      setProperty(propertyData);
      setShowManagement(true);
    } catch (error) {
      console.error('Error fetching property:', error);
      setProperty(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (createdProperty: Property) => {
    setProperty(createdProperty);
    setShowManagement(true);
    const slug = createdProperty.slug;
    setPropertySlug(slug);
    router.push(`/list-property?edit=${slug}`);
  };

  const handleEdit = () => {
    setShowManagement(false);
  };

  return (
    <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-20 md:py-24 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjQkQ5MTYyIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMEYxNzJBIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] repeat" />
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Want to Rent or Sell Your Property to <span className="text-[#B49162]">Trusted Expats</span>?
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Join our platform and connect with verified tenants and buyers from the Syrian
              diaspora
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] text-center mb-12">
              Why List <span className="text-[#B49162]">With Us</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#B49162]/30">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#B49162] transition-colors duration-300">
                    <TrendingUp className="w-8 h-8 text-[#B49162] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl text-[#0F172A]">High Occupancy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    Connect with reliable tenants and buyers actively seeking properties in
                    Damascus.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#B49162]/30">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#B49162] transition-colors duration-300">
                    <ShieldCheck className="w-8 h-8 text-[#B49162] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl text-[#0F172A]">Verified Tenants</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    We verify all potential tenants and buyers to ensure trustworthy transactions.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#B49162]/30">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#B49162] transition-colors duration-300">
                    <Clock className="w-8 h-8 text-[#B49162] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl text-[#0F172A]">Hassle-Free Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600">
                    We handle the listing, verification, and communication so you can focus on what
                    matters.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] text-center mb-12">
              How It <span className="text-[#B49162]">Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-[#B49162] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#0F172A]">Submit Details</h3>
                <p className="text-gray-600">
                  Fill out our simple form with your property details and contact information.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-[#B49162] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#0F172A]">We Verify</h3>
                <p className="text-gray-600">
                  Our team reviews and verifies your property to ensure quality and authenticity.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-[#B49162] text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#0F172A]">We List</h3>
                <p className="text-gray-600">
                  Your property goes live on our platform, visible to thousands of potential
                  tenants and buyers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Property Form / Management */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <Clock className="w-8 h-8 animate-spin text-[#B49162] mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Loading property...</p>
                </div>
              </div>
            ) : showManagement && property ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-6xl mx-auto"
              >
                <PropertyManagement property={property} onEdit={handleEdit} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                <MultiStepPropertyForm
                  property={property}
                  onSuccess={handleSuccess}
                />
              </motion.div>
            )}
          </div>
        </section>
    </Suspense>
  );
}

