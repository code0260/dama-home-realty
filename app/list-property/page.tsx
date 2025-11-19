'use client';

import { useState } from 'react';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle2, ShieldCheck, TrendingUp, Clock, Send } from 'lucide-react';
import axiosInstance from '@/lib/axios';
import { useRouter } from 'next/navigation';

export default function ListPropertyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    property_type: '',
    location: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await axiosInstance.post('/leads', {
        name: formData.name,
        phone: formData.phone,
        message: `Property Type: ${formData.property_type}\nLocation: ${formData.location}\n\n${formData.message || 'No additional message'}`,
        status: 'new',
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', property_type: '', location: '', message: '' });
      setTimeout(() => {
        setSuccess(false);
        router.push('/properties');
      }, 3000);
    } catch (error) {
      console.error('Error submitting listing request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary via-primary/95 to-secondary/20 text-white py-20">
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

        {/* Submission Form */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Request Listing</CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will contact you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>
                        Request submitted successfully! We'll contact you within 24 hours.
                      </span>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+963 123 456 789"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property_type">Property Type</Label>
                      <Select
                        value={formData.property_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, property_type: value })
                        }
                        required
                      >
                        <SelectTrigger id="property_type">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sale">For Sale</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                          <SelectItem value="hotel">Hotel/Apartment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Neighborhood or area in Damascus"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Details (Optional)</Label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more about your property..."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary/90 text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        'Submitting...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Request Listing
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

