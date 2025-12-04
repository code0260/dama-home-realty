'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { List, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface LegalTableOfContentsProps {
  className?: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

export function LegalTableOfContents({
  className,
  contentRef,
}: LegalTableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    // Extract headings from the document
    const extractHeadings = () => {
      const targetElement = contentRef?.current || document;
      const headingElements = targetElement.querySelectorAll('h2, h3');
      
      const extractedHeadings: Heading[] = Array.from(headingElements).map((element, index) => {
        const level = parseInt(element.tagName.charAt(1));
        const text = element.textContent || '';
        
        // Generate ID if not present
        let id = element.id;
        if (!id) {
          id = `section-${index}-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
          element.id = id;
        }
        
        return { id, text, level };
      });
      
      setHeadings(extractedHeadings);
      
      // Set first heading as active initially
      if (extractedHeadings.length > 0 && !activeId) {
        setActiveId(extractedHeadings[0].id);
      }
    };

    extractHeadings();

    // Update headings when content changes
    const observer = new MutationObserver(extractHeadings);
    const targetElement = contentRef?.current || document.body;
    observer.observe(targetElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id'],
    });

    return () => observer.disconnect();
  }, [contentRef, activeId]);

  useEffect(() => {
    // Enhanced Scroll Spy - Highlight active heading on scroll
    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      if (headingElements.length === 0) return;

      // Find the heading currently in viewport
      const viewportTop = window.scrollY + 200; // Account for header + offset
      const viewportBottom = window.scrollY + window.innerHeight - 100;

      let activeHeadingId: string | null = null;
      let maxVisibleHeight = 0;

      headingElements.forEach((element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const elementBottom = elementTop + rect.height;

        // Check if element is in viewport
        const isVisible = elementTop < viewportBottom && elementBottom > viewportTop;
        
        if (isVisible && element.id) {
          const visibleHeight = Math.min(elementBottom, viewportBottom) - Math.max(elementTop, viewportTop);
          if (visibleHeight > maxVisibleHeight) {
            maxVisibleHeight = visibleHeight;
            activeHeadingId = element.id;
          }
        }
      });

      // If no heading is visible, find the one closest to the top
      if (!activeHeadingId) {
        let closestHeadingId: string | null = null;
        let minDistance = Infinity;

        headingElements.forEach((element: HTMLElement) => {
          if (!element.id) return;
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - 200);

          if (rect.top <= 250 && distance < minDistance) {
            minDistance = distance;
            closestHeadingId = element.id;
          }
        });

        activeHeadingId = closestHeadingId;
      }

      if (activeHeadingId) {
        setActiveId(activeHeadingId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 150; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      setActiveId(id);
      
      // Close mobile menu after clicking
      setIsMobileOpen(false);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  const TOCContent = () => (
    <ScrollArea className="h-[500px] lg:h-[600px]">
      <nav className="space-y-1 pr-4">
        {headings.map((heading, index) => {
          const isActive = activeId === heading.id;
          const indent = heading.level - 2; // h2 is level 0, h3 is level 1

          return (
            <motion.button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-start gap-2 text-sm',
                'hover:bg-slate-100 dark:hover:bg-slate-800',
                isActive
                  ? 'bg-[#B49162]/10 text-[#B49162] font-semibold border-l-3 border-[#B49162] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              )}
              style={{ paddingLeft: `${0.75 + indent * 0.75}rem` }}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <Hash
                className={cn(
                  'w-3.5 h-3.5 mt-0.5 shrink-0',
                  isActive ? 'text-[#B49162]' : 'text-slate-400'
                )}
              />
              <span className="line-clamp-2 leading-relaxed">{heading.text}</span>
            </motion.button>
          );
        })}
      </nav>
    </ScrollArea>
  );

  return (
    <>
      {/* Mobile: Collapsible TOC */}
      <div className="lg:hidden">
        <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
          <CardHeader 
            className="cursor-pointer pb-3"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <List className="w-5 h-5 text-[#B49162]" />
                Table of Contents
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileOpen(!isMobileOpen);
                }}
              >
                {isMobileOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardHeader>
          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <CardContent className="pt-0">
                  <TOCContent />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Desktop: Always Visible TOC */}
      <div className="hidden lg:block">
        <Card
          className={cn(
            'border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800',
            className
          )}
        >
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <List className="w-5 h-5 text-[#B49162]" />
              Table of Contents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TOCContent />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
