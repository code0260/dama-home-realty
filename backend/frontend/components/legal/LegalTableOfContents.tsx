'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { List, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface LegalTableOfContentsProps {
  className?: string;
  contentRef?: React.RefObject<HTMLElement | null>;
}

export function LegalTableOfContents({
  className,
  contentRef,
}: LegalTableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

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
    // Highlight active heading on scroll
    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean) as HTMLElement[];

      if (headingElements.length === 0) return;

      // Find the heading closest to the top of the viewport
      let activeHeading = headingElements[0];
      let minDistance = Infinity;

      headingElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top - 150); // Account for header + offset

        if (rect.top <= 200 && distance < minDistance) {
          minDistance = distance;
          activeHeading = element;
        }
      });

      if (activeHeading) {
        setActiveId(activeHeading.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      setActiveId(id);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <Card
      className={cn(
        'sticky top-24 border-2 border-gray-200 dark:border-primary-700',
        className
      )}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-primary dark:text-white flex items-center gap-2">
          <List className="w-5 h-5 text-secondary" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px]">
          <nav className="space-y-1">
            {headings.map((heading, index) => {
              const isActive = activeId === heading.id;
              const indent = heading.level - 2; // h2 is level 0, h3 is level 1

              return (
                <motion.button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-start gap-2 text-sm',
                    isActive
                      ? 'bg-secondary/10 text-secondary font-semibold border-l-2 border-secondary'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-primary-800 hover:text-primary dark:hover:text-white'
                  )}
                  style={{ paddingLeft: `${0.75 + indent * 0.75}rem` }}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <Hash
                    className={cn(
                      'w-3 h-3 mt-0.5 flex-shrink-0',
                      isActive && 'text-secondary'
                    )}
                  />
                  <span className="line-clamp-2">{heading.text}</span>
                </motion.button>
              );
            })}
          </nav>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

