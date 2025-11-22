'use client';

import { useRef, useEffect, useState } from 'react';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Footer } from '@/components/ui-custom/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { DocumentSearch } from './DocumentSearch';
import { LegalTableOfContents } from './LegalTableOfContents';
import { VersionHistory } from './VersionHistory';
import { cn } from '@/lib/utils';

interface Version {
  version: string;
  date: string;
  changes: string[];
  isCurrent?: boolean;
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  versions?: Version[];
  children: React.ReactNode;
  className?: string;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  versions = [],
  children,
  className,
}: LegalPageLayoutProps) {
  const contentRef = useRef<HTMLElement>(null);
  const [contentHtml, setContentHtml] = useState('');

  const defaultVersions: Version[] = versions.length > 0 ? versions : [
    {
      version: '1.0',
      date: lastUpdated,
      changes: ['Initial version'],
      isCurrent: true,
    },
  ];

  useEffect(() => {
    // Update content HTML after component mounts and when content changes
    const updateContentHtml = () => {
      if (contentRef.current) {
        setContentHtml(contentRef.current.innerHTML);
      }
    };

    // Initial update
    updateContentHtml();

    // Watch for content changes
    const observer = new MutationObserver(updateContentHtml);
    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, [children]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-primary-900">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-primary dark:text-white mb-4">
                {title}
              </h1>
              
              {/* Last Updated & Version Info */}
              <Card className="mb-6 border-2 border-gray-200 dark:border-primary-700">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Last Updated</p>
                        <p className="text-sm font-semibold text-primary dark:text-white">
                          {format(new Date(lastUpdated), 'MMMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">Version</p>
                        <Badge className="bg-secondary text-white">
                          {defaultVersions[0]?.version || '1.0'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Search Bar */}
              <div className="mb-6">
                <DocumentSearch content={contentHtml} />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Sidebar - Table of Contents */}
              <div className="lg:col-span-1">
                <LegalTableOfContents contentRef={contentRef} />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                <Card className="border-2 border-gray-200 dark:border-primary-700">
                  <CardContent className="p-8">
                    <article
                      ref={contentRef}
                      className={cn(
                        'prose prose-lg max-w-none space-y-6 text-gray-700 dark:text-gray-300',
                        'prose-headings:text-primary dark:prose-headings:text-white',
                        'prose-h2:text-2xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-8',
                        'prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-6',
                        'prose-a:text-secondary prose-a:no-underline hover:prose-a:underline',
                        'prose-strong:text-primary dark:prose-strong:text-white',
                        'prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2',
                        'prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2',
                        'prose-li:marker:text-secondary',
                        className
                      )}
                    >
                      {children}
                    </article>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar - Version History */}
              <div className="lg:col-span-1">
                <VersionHistory versions={defaultVersions} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

