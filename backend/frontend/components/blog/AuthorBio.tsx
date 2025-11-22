'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, MessageCircle, Globe, Linkedin, Twitter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Article } from '@/types';

interface AuthorBioProps {
  author: Article['author'];
  className?: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export function AuthorBio({ author, className }: AuthorBioProps) {
  if (!author) {
    return null;
  }

  // Mock author data - replace with actual data from API
  const authorData = {
    name: author.name,
    bio: 'Experienced real estate writer and market analyst with over 10 years of expertise in the Syrian real estate market. Passionate about helping expats find their perfect homes.',
    avatar: null,
    articlesCount: 25,
    socialLinks: {
      email: 'author@damahome.com',
      website: 'https://example.com',
      linkedin: 'https://linkedin.com/in/author',
      twitter: 'https://twitter.com/author',
    },
  };

  return (
    <Card className={cn('border-2 border-gray-200 dark:border-primary-700', className)}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <Avatar className="w-20 h-20 flex-shrink-0">
            <AvatarImage src={authorData.avatar || undefined} />
            <AvatarFallback className="bg-secondary/10 text-secondary text-xl">
              {getInitials(authorData.name)}
            </AvatarFallback>
          </Avatar>

          {/* Author Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-primary dark:text-white mb-1">
                {authorData.name}
              </h3>
              <Badge variant="outline" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Content Writer
              </Badge>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {authorData.bio}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">{authorData.articlesCount}</span>
              <span>articles published</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-primary-700">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 w-8 p-0"
              >
                <a href={`mailto:${authorData.socialLinks.email}`} aria-label="Email">
                  <Mail className="w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 w-8 p-0"
              >
                <a
                  href={authorData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 w-8 p-0"
              >
                <a
                  href={authorData.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-8 w-8 p-0"
              >
                <a
                  href={authorData.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

