'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Clock, MapPin, Home, ArrowRight } from 'lucide-react';
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel';
import { Timeline } from '@/components/about/Timeline';
import { TeamMemberCard } from '@/components/about/TeamMemberCard';
import { StatsCounter } from '@/components/about/StatsCounter';
import { StorySection } from '@/components/about/StorySection';
import { InteractiveTimeline } from '@/components/about/InteractiveTimeline';
import { MissionVision } from '@/components/about/MissionVision';
import { VideoStory } from '@/components/about/VideoStory';
import { CompanyValues } from '@/components/about/CompanyValues';
import { AwardsRecognition } from '@/components/about/AwardsRecognition';
import { Partnerships } from '@/components/about/Partnerships';
import { StatsVisualization } from '@/components/about/StatsVisualization';
import { TeamHierarchy } from '@/components/about/TeamHierarchy';
import { TeamAchievements } from '@/components/about/TeamAchievements';
import { getAgents } from '@/lib/api';
import { Agent } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function AboutPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const data = await getAgents();
        setAgents(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return (
    <>
        {/* Hero Section */}
        <section className="bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Building Trust, Bridging Distances
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Connecting Syrian expats with trusted homes in their homeland
            </p>
          </div>
        </section>

        {/* Story Section - Large Typography with Signature */}
        <StorySection />

        {/* Mission & Vision */}
        <MissionVision />

        {/* Video Story */}
        <VideoStory />

        {/* Interactive Timeline */}
        <InteractiveTimeline />

        {/* Legacy Timeline (Optional - can be removed or kept) */}
        <section className="py-20 bg-white dark:bg-primary-900/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white text-center mb-16">
                Our <span className="text-secondary">Journey</span> (Timeline)
              </h2>
              <Timeline />
            </div>
          </div>
        </section>

        {/* Stats Counter - Navy Blue Background */}
        <StatsCounter />

        {/* Stats Visualization */}
        <StatsVisualization />

        {/* Why Us Grid */}
        <section className="py-20 bg-linear-to-br from-gray-50 to-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMEYxNzJAIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjQkQ5MTYyIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] repeat" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">
                Why Choose <span className="text-[#B49162]">Us</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover what makes us the trusted choice for Syrian expats worldwide
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#B49162]/30 h-full">
                  <CardHeader>
                    <div className="mx-auto w-20 h-20 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#B49162] transition-colors duration-300">
                      <ShieldCheck className="w-10 h-10 text-[#B49162] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-xl text-[#0F172A] mb-2">Verified Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      Every property is thoroughly verified to ensure authenticity and quality standards.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#B49162]/30 h-full">
                  <CardHeader>
                    <div className="mx-auto w-20 h-20 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#B49162] transition-colors duration-300">
                      <ShieldCheck className="w-10 h-10 text-[#B49162] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-xl text-[#0F172A] mb-2">Secure Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      Your transactions and personal information are protected with industry-leading security measures.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#B49162]/30 h-full">
                  <CardHeader>
                    <div className="mx-auto w-20 h-20 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#B49162] transition-colors duration-300">
                      <Users className="w-10 h-10 text-[#B49162] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-xl text-[#0F172A] mb-2">Local Experts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      Our team of local experts knows Damascus inside and out, providing you with invaluable insights.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#B49162]/30 h-full">
                  <CardHeader>
                    <div className="mx-auto w-20 h-20 bg-[#B49162]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#B49162] transition-colors duration-300">
                      <Clock className="w-10 h-10 text-[#B49162] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-xl text-[#0F172A] mb-2">24/7 Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      We're here for you around the clock, no matter where you are in the world.
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Achievements */}
        <TeamAchievements />

        {/* Team Section */}
        <section className="py-20 bg-gray-50 dark:bg-primary-900/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white text-center mb-4">
              Our <span className="text-secondary">Team</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Meet our experienced agents who are dedicated to helping you find your perfect home in Damascus
            </p>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-[400px] rounded-2xl" />
                ))}
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Our team information is coming soon.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                  {agents.map((agent) => (
                    <TeamMemberCard key={agent.id} agent={agent} />
                  ))}
                </div>

                {/* Team Hierarchy */}
                {agents.length > 0 && (
                  <TeamHierarchy agents={agents} />
                )}
              </>
            )}
          </div>
        </section>

        {/* Company Values */}
        <CompanyValues />

        {/* Awards & Recognition */}
        <AwardsRecognition />

        {/* Partnerships */}
        <Partnerships />

        {/* Testimonials Section */}
        <section className="py-16 bg-gray-50 dark:bg-primary-900/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-8 text-center">What Our Clients Say</h2>
            <TestimonialsCarousel featured={true} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your Home?</h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Start your journey today and discover the perfect property in Damascus
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-[#B49162] hover:bg-[#9A7A4F] text-white px-8 py-6 text-lg shadow-xl"
            >
              <Link href="/properties">
                Search Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </section>
    </>
  );
}

