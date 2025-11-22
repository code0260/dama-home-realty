'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  X,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Award,
  Calendar,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface TeamMemberDetailsProps {
  agent: Agent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getWhatsAppLink = (phone: string | undefined | null) => {
  if (!phone) return '#';
  const cleanPhone = phone.replace(/\D/g, '');
  return cleanPhone ? `https://wa.me/${cleanPhone}` : '#';
};

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return Linkedin;
    case 'twitter':
      return Twitter;
    case 'facebook':
      return Facebook;
    case 'instagram':
      return Instagram;
    default:
      return Globe;
  }
};

export function TeamMemberDetails({ agent, open, onOpenChange }: TeamMemberDetailsProps) {
  const photoUrl = agent.photo
    ? agent.photo.startsWith('http')
      ? agent.photo
      : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}/storage/${agent.photo}`
    : null;

  // Mock achievements and social links - replace with actual data from API
  const achievements = [
    { year: '2023', title: 'Top Performer', description: 'Highest client satisfaction rate' },
    { year: '2022', title: 'Excellence Award', description: 'Outstanding service delivery' },
  ];

  const socialLinks = agent.languages || []; // Placeholder - should come from API

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-primary dark:text-white">
            {agent.name}
          </DialogTitle>
          <DialogDescription className="text-lg">
            {agent.role || 'Real Estate Agent'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Photo & Contact */}
          <div className="md:col-span-1 space-y-4">
            {/* Photo */}
            <Card className="overflow-hidden">
              <div className="relative aspect-3/4 w-full bg-gray-100 dark:bg-primary-800">
                {photoUrl ? (
                  <Image
                    src={photoUrl}
                    alt={agent.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <div className="text-6xl font-bold text-secondary/30">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {agent.phone && (
                  <>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <a href={`tel:${agent.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        {agent.phone}
                      </a>
                    </Button>
                    <Button
                      asChild
                      className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                      size="sm"
                    >
                      <a
                        href={getWhatsAppLink(agent.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  </>
                )}

                {agent.languages && agent.languages.length > 0 && (
                  <div className="pt-3 border-t border-gray-200 dark:border-primary-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {agent.languages.map((lang, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {agent.license_no && (
                  <div className="pt-3 border-t border-gray-200 dark:border-primary-700">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      License
                    </p>
                    <p className="text-sm text-primary dark:text-white font-mono">
                      {agent.license_no}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2 space-y-4">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Globe className="w-5 h-5 text-secondary" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {agent.role ? (
                    <>
                      As a {agent.role}, {agent.name} brings years of experience and expertise
                      to help you find your perfect property in Damascus. Committed to excellence
                      and dedicated to serving the Syrian diaspora community.
                    </>
                  ) : (
                    <>
                      Experienced real estate professional dedicated to helping Syrian expats
                      find their perfect home in Damascus. Committed to providing personalized
                      service and expert guidance throughout your property journey.
                    </>
                  )}
                </p>
              </CardContent>
            </Card>

            {/* Achievements */}
            {achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="w-5 h-5 text-secondary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-primary-800 rounded-lg"
                    >
                      <div className="p-2 bg-secondary/10 rounded-full">
                        <Calendar className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-primary dark:text-white">
                            {achievement.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {achievement.year}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Specializations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-secondary" />
                  Specializations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Property Sales</Badge>
                  <Badge variant="outline">Rentals</Badge>
                  <Badge variant="outline">Investment Properties</Badge>
                  <Badge variant="outline">Property Management</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

