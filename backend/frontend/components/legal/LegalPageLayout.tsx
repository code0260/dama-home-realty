'use client';

import { useRef, useEffect, useState } from 'react';
import { Navbar } from '@/components/ui-custom/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Download, Printer, FileText } from 'lucide-react';
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
  description?: string;
}

export function LegalPageLayout({
  title,
  lastUpdated,
  versions = [],
  children,
  className,
  description = 'Please read these terms carefully before using our services',
}: LegalPageLayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = contentRef.current?.innerText || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section - Damascene Heritage Style */}
        <section className="text-white py-16 md:py-20 relative overflow-hidden bg-slate-900">
          {/* Subtle Islamic/Geometric Arabesque Pattern Layer */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='damascene' x='0' y='0' width='120' height='120' patternUnits='userSpaceOnUse'%3E%3Cpath d='M60 0L73.5 20L96 20L78 35L91.5 55L60 45L28.5 55L42 35L24 20L46.5 20Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M0 60L20 46.5L20 24L35 42L55 28.5L45 60L55 91.5L35 78L20 96L20 73.5Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M60 120L46.5 100L24 100L42 85L28.5 65L60 75L91.5 65L78 85L96 100L73.5 100Z' fill='%23B49162' opacity='0.3'/%3E%3Cpath d='M120 60L100 73.5L100 96L85 78L65 91.5L75 60L65 28.5L85 42L100 24L100 46.5Z' fill='%23B49162' opacity='0.3'/%3E%3Ccircle cx='60' cy='60' r='8' fill='%23B49162' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23damascene)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}
            />
          </div>

          {/* Additional subtle geometric overlay for depth */}
          <div className="absolute inset-0 opacity-3">
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='hexagon' x='0' y='0' width='80' height='80' patternUnits='userSpaceOnUse'%3E%3Cpath d='M40 0L60 10L60 30L40 40L20 30L20 10Z' fill='none' stroke='%23B49162' stroke-width='0.5' opacity='0.2'/%3E%3Cpath d='M40 40L60 50L60 70L40 80L20 70L20 50Z' fill='none' stroke='%23B49162' stroke-width='0.5' opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23hexagon)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
              }}
            />
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                <FileText className="w-4 h-4 text-[#B49162]" />
                <span className="text-sm font-medium text-gray-300">Legal Document</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                {title}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                {description}
              </p>

              {/* Last Updated Badge */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg">
                  <Calendar className="w-4 h-4 text-[#B49162]" />
                  <span className="text-sm text-gray-300">
                    Last updated: <span className="font-semibold text-white">{format(new Date(lastUpdated), 'MMMM d, yyyy')}</span>
                  </span>
                </div>
                <Badge className="bg-[#B49162] text-white border-0 px-4 py-2">
                  <Clock className="w-3 h-3 mr-1" />
                  Version {defaultVersions[0]?.version || '1.0'}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Mobile: Search and TOC Toggle */}
            <div className="lg:hidden mb-8 space-y-4">
              <DocumentSearch content={contentHtml} />
            </div>

            {/* Desktop: Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Sidebar - Sticky */}
              <aside className="lg:col-span-3">
                <div className="sticky top-8 space-y-6">
                  {/* Desktop Search */}
                  <div className="hidden lg:block">
                    <DocumentSearch content={contentHtml} />
                  </div>

                  {/* Table of Contents */}
                  <LegalTableOfContents contentRef={contentRef} />

                  {/* Action Buttons */}
                  <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <Button
                        onClick={handlePrint}
                        variant="outline"
                        className="w-full justify-start gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Printer className="w-4 h-4" />
                        Print Document
                      </Button>
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        className="w-full justify-start gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </aside>

              {/* Main Content - Center Column */}
              <article className="lg:col-span-6">
                <Card className="border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                  <CardContent className="p-8 md:p-12">
                    <div
                      ref={contentRef}
                      className={cn(
                        'prose prose-slate prose-lg max-w-none',
                        'prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-slate-100',
                        'prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pt-8 prose-h2:border-t prose-h2:border-slate-200 dark:prose-h2:border-slate-700',
                        'prose-h2:first:mt-0 prose-h2:first:pt-0 prose-h2:first:border-t-0',
                        'prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-slate-900 dark:prose-h3:text-slate-100',
                        'prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-p:leading-relaxed',
                        'prose-a:text-[#B49162] prose-a:no-underline hover:prose-a:underline prose-a:font-medium',
                        'prose-strong:text-slate-900 dark:prose-strong:text-slate-100 prose-strong:font-semibold',
                        'prose-ul:text-slate-700 dark:prose-ul:text-slate-300 prose-ul:space-y-2',
                        'prose-ol:text-slate-700 dark:prose-ol:text-slate-300 prose-ol:space-y-2',
                        'prose-li:marker:text-[#B49162]',
                        'prose-code:text-[#B49162] prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
                        className
                      )}
                    >
                      {children}
                    </div>
                  </CardContent>
                </Card>
              </article>

              {/* Right Sidebar - Version History */}
              <aside className="lg:col-span-3">
                <div className="sticky top-8">
                  <VersionHistory versions={defaultVersions} />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
