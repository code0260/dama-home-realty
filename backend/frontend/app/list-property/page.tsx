'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, ShieldCheck, TrendingUp, Clock } from 'lucide-react';
import { MultiStepPropertyForm } from '@/components/property/MultiStepPropertyForm';
import { PropertyManagement } from '@/components/property/PropertyManagement';
import { Property } from '@/types';
import { getPropertyBySlug } from '@/lib/api';

export default function ListPropertyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertySlug = searchParams.get('edit');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(!!propertySlug);
  const [showManagement, setShowManagement] = useState(false);

  useEffect(() => {
    if (propertySlug) {
      fetchProperty();
    }
  }, [propertySlug]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const propertyData = await getPropertyBySlug(propertySlug!);
      setProperty(propertyData);
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
    router.push(`/list-property?edit=${createdProperty.slug}`);
  };

  const handleEdit = () => {
    setShowManagement(false);
  };

  return (
    <>
        {/* Hero Section */}
        <section className="bg-linear-to-br from-primary via-primary/95 to-secondary/20 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Want to Rent or Sell Your Property to Trusted Expats?
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Join our platform and connect with verified tenants and buyers from the Syrian
              diaspora
            </p>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
              Why List With Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">High Occupancy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Connect with reliable tenants and buyers actively seeking properties in
                    Damascus.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Verified Tenants</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    We verify all potential tenants and buyers to ensure trustworthy transactions.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Hassle-Free Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
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
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Submit Details</h3>
                <p className="text-gray-600">
                  Fill out our simple form with your property details and contact information.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">We Verify</h3>
                <p className="text-gray-600">
                  Our team reviews and verifies your property to ensure quality and authenticity.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">We List</h3>
                <p className="text-gray-600">
                  Your property goes live on our platform, visible to thousands of potential
                  tenants and buyers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Property Form / Management */}
        <section className="py-16 bg-white dark:bg-primary-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <Clock className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
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
    </>
  );
}

