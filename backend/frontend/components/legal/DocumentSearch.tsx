'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
  id: string;
  text: string;
  context: string;
  section: string;
}

interface DocumentSearchProps {
  content: string;
  onResultClick?: (id: string) => void;
  className?: string;
}

export function DocumentSearch({ content, onResultClick, className }: DocumentSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setCurrentIndex(0);
      return;
    }

    const searchTerms = searchQuery.toLowerCase().split(' ').filter(Boolean);
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    
    const searchResults: SearchResult[] = [];
    const allElements = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, section');

    allElements.forEach((element) => {
      const text = element.textContent || '';
      const lowerText = text.toLowerCase();
      
      // Check if all search terms are found
      const allTermsFound = searchTerms.every((term) => lowerText.includes(term));
      
      if (allTermsFound && text.trim().length > 0) {
        // Find the parent section
        let section = 'Document';
        const heading = element.closest('section')?.querySelector('h1, h2, h3, h4, h5, h6');
        if (heading) {
          section = heading.textContent || section;
        } else {
          const parentHeading = element.previousElementSibling;
          if (parentHeading && /^H[1-6]$/i.test(parentHeading.tagName)) {
            section = parentHeading.textContent || section;
          }
        }

        // Highlight matched text
        let highlightedText = text;
        searchTerms.forEach((term) => {
          const regex = new RegExp(`(${term})`, 'gi');
          highlightedText = highlightedText.replace(
            regex,
            '<mark class="bg-yellow-300 dark:bg-yellow-600">$1</mark>'
          );
        });

        // Get context (50 chars before and after)
        const index = lowerText.indexOf(searchTerms[0]);
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + searchTerms[0].length + 50);
        const context = text.substring(start, end);

        // Get element ID for scrolling
        let id = element.id;
        if (!id) {
          id = `search-result-${searchResults.length}`;
          element.id = id;
        }

        searchResults.push({
          id,
          text: highlightedText,
          context: `...${context}...`,
          section,
        });
      }
    });

    setResults(searchResults);
    setCurrentIndex(0);
    setIsOpen(searchResults.length > 0);
  }, [searchQuery, content]);

  const scrollToResult = (resultId: string) => {
    const element = document.getElementById(resultId);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Highlight the element briefly
      element.classList.add('bg-yellow-100', 'dark:bg-yellow-900/30');
      setTimeout(() => {
        element.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/30');
      }, 2000);

      if (onResultClick) {
        onResultClick(resultId);
      }
    }
  };

  const handleNext = () => {
    if (results.length === 0) return;
    const nextIndex = (currentIndex + 1) % results.length;
    setCurrentIndex(nextIndex);
    scrollToResult(results[nextIndex].id);
  };

  const handlePrevious = () => {
    if (results.length === 0) return;
    const prevIndex = currentIndex === 0 ? results.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollToResult(results[prevIndex].id);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setCurrentIndex(0);
    setIsOpen(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      
      if (isOpen && results.length > 0) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % results.length;
          setCurrentIndex(nextIndex);
          if (results[nextIndex]) {
            scrollToResult(results[nextIndex].id);
          }
        } else if (e.key === 'Enter' && e.shiftKey) {
          e.preventDefault();
          const prevIndex = currentIndex === 0 ? results.length - 1 : currentIndex - 1;
          setCurrentIndex(prevIndex);
          if (results[prevIndex]) {
            scrollToResult(results[prevIndex].id);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, currentIndex]);

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search in document (Ctrl+F)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-10 bg-white dark:bg-primary-800 border-gray-200 dark:border-primary-700"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="border-2 border-gray-200 dark:border-primary-700 shadow-lg max-h-96 overflow-hidden">
              <CardContent className="p-0">
                {/* Results Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-primary-700 bg-gray-50 dark:bg-primary-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-semibold text-primary dark:text-white">
                      {results.length} {results.length === 1 ? 'result' : 'results'} found
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={results.length === 0}
                      className="h-7 w-7 p-0"
                      title="Previous (Shift+Enter)"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      {currentIndex + 1} / {results.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNext}
                      disabled={results.length === 0}
                      className="h-7 w-7 p-0"
                      title="Next (Enter)"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Results List */}
                <div className="max-h-64 overflow-y-auto">
                  {results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        setCurrentIndex(index);
                        scrollToResult(result.id);
                      }}
                      className={cn(
                        'w-full text-left p-3 border-b border-gray-100 dark:border-primary-700 hover:bg-gray-50 dark:hover:bg-primary-800 transition-colors',
                        index === currentIndex && 'bg-secondary/10 border-l-2 border-secondary'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-semibold text-secondary">{result.section}</p>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          #{index + 1}
                        </span>
                      </div>
                      <p
                        className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: result.text }}
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-1">
                        {result.context}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {searchQuery && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full left-0 right-0 mt-2 z-50"
        >
          <Card className="border-2 border-gray-200 dark:border-primary-700 shadow-lg">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No results found for "{searchQuery}"
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

