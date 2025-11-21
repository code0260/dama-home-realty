'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Article } from '@/types';
import axiosInstance from '@/lib/axios';
import Image from 'next/image';
import { Calendar, Eye, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { format } from 'date-fns';

export default function ArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<Article>(`/articles/${slug}`, {
          params: { locale: 'en' },
        });
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleShare = (platform: string) => {
    if (!article) return;
    
    const url = window.location.href;
    const text = article.title;
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="w-full h-96 mb-8" />
        <Skeleton className="w-full h-64" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Article Not Found</h1>
          <p className="text-gray-600">The article you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
        {/* Article Header */}
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{article.title}</h1>
          
          <div className="flex items-center gap-4 mb-6 text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {article.published_at
                ? format(new Date(article.published_at), 'MMMM dd, yyyy')
                : 'Draft'}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {article.views} views
            </span>
            {article.author && (
              <span>By {article.author.name}</span>
            )}
          </div>

          {/* Featured Image */}
          {article.image && (
            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Share Buttons */}
          <div className="flex items-center gap-2 mb-8 pb-8 border-b">
            <span className="text-sm text-gray-600 mr-2">Share:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
          </div>

          {/* Article Content */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
    </>
  );
}

