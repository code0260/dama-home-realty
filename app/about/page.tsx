import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Users, Clock, MapPin, Home, ArrowRight } from 'lucide-react';
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/95 to-secondary/20 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Building Trust, Bridging Distances
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Connecting Syrian expats with trusted homes in their homeland
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                At Dama Home Realty, we understand the unique challenges faced by Syrian expats
                seeking to reconnect with their homeland. Whether you're looking to rent, buy, or
                invest in property in Damascus, we're here to make the process seamless, secure, and
                trustworthy.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to bridge the distance between you and your dream home in Syria,
                providing verified listings, expert guidance, and a secure platform that you can
                trust. We believe that everyone deserves a safe haven, and we're committed to
                making that a reality for the Syrian diaspora.
              </p>
            </div>
          </div>
        </section>

        {/* Why Us Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
              Why Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Verified Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Every property is thoroughly verified to ensure authenticity and quality.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Secure Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Your transactions and personal information are protected with industry-leading
                    security measures.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">Local Experts</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Our team of local experts knows Damascus inside and out, providing you with
                    invaluable insights.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl">24/7 Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    We're here for you around the clock, no matter where you are in the world.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-16 h-16 text-primary" />
                  </div>
                  <CardTitle>Founder</CardTitle>
                  <CardDescription>Visionary Leader</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Dedicated to connecting the Syrian diaspora with their homeland through trusted
                    real estate services.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-16 h-16 text-primary" />
                  </div>
                  <CardTitle>Local Agents</CardTitle>
                  <CardDescription>Damascus Experts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Our team of experienced local agents provides on-the-ground support and
                    expertise.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-4">
                    <Home className="w-16 h-16 text-primary" />
                  </div>
                  <CardTitle>Property Specialists</CardTitle>
                  <CardDescription>Your Trusted Advisors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Specialized professionals helping you find the perfect property that meets your
                    needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">What Our Clients Say</h2>
            <TestimonialsCarousel featured={true} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Home?</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Start your journey today and discover the perfect property in Damascus
            </p>
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-white">
              <Link href="/properties">
                Search Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

