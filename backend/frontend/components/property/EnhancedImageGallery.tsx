'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Images, 
  Download, 
  RotateCcw,
  Eye,
  FileImage,
  Video,
  MapPin,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedImageGalleryProps {
  images: string[];
  title: string;
  floorPlans?: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
}

export function EnhancedImageGallery({ 
  images, 
  title, 
  floorPlans = [],
  videoUrl,
  virtualTourUrl 
}: EnhancedImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'photos' | 'floorplans' | 'tour'>('photos');
  const [zoom, setZoom] = useState(1);

  const getImageUrl = (image: string) => {
    if (image.startsWith('http')) return image;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${apiUrl}/storage/${image}`;
  };

  const mainImage = images && images.length > 0 ? images[0] : null;
  const thumbnails = images && images.length > 1 ? images.slice(1, 5) : [];
  const remainingImages = images && images.length > 5 ? images.length - 5 : 0;

  const openLightbox = (image: string, index: number = 0) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setIsLightboxOpen(true);
    setZoom(1);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    setZoom(1);
  }, []);

  const nextImage = useCallback(() => {
    const allImages = activeTab === 'photos' ? images : floorPlans;
    if (!allImages || allImages.length === 0) return;
    setCurrentIndex((prevIndex) => {
      const nextIdx = (prevIndex + 1) % allImages.length;
      setSelectedImage(allImages[nextIdx]);
      setZoom(1);
      return nextIdx;
    });
  }, [activeTab, images, floorPlans]);

  const prevImage = useCallback(() => {
    const allImages = activeTab === 'photos' ? images : floorPlans;
    if (!allImages || allImages.length === 0) return;
    setCurrentIndex((prevIndex) => {
      const prevIdx = (prevIndex - 1 + allImages.length) % allImages.length;
      setSelectedImage(allImages[prevIdx]);
      setZoom(1);
      return prevIdx;
    });
  }, [activeTab, images, floorPlans]);

  const handleDownload = async (imageUrl: string, imageName: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${imageName}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleZoomIn = useCallback(() => setZoom((prev) => Math.min(prev + 0.25, 3)), []);
  const handleZoomOut = useCallback(() => setZoom((prev) => Math.max(prev - 0.25, 1)), []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextImage();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevImage();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeLightbox();
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        handleZoomIn();
      }
      if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isLightboxOpen, nextImage, prevImage, handleZoomIn, handleZoomOut, closeLightbox]);

  if (!mainImage) {
    return (
      <div className="w-full h-[500px] bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center rounded-2xl">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Bento Grid Layout */}
      <div className="space-y-4">
        {/* Tab Navigation */}
        {(floorPlans.length > 0 || videoUrl || virtualTourUrl) && (
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('photos')}
              className={cn(
                'px-4 py-2 font-medium text-sm transition-colors border-b-2',
                activeTab === 'photos'
                  ? 'border-secondary text-secondary'
                  : 'border-transparent text-gray-600 hover:text-secondary'
              )}
            >
              <Images className="w-4 h-4 inline mr-2" />
              Photos ({images.length})
            </button>
            {floorPlans.length > 0 && (
              <button
                onClick={() => setActiveTab('floorplans')}
                className={cn(
                  'px-4 py-2 font-medium text-sm transition-colors border-b-2',
                  activeTab === 'floorplans'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-600 hover:text-secondary'
                )}
              >
                <FileImage className="w-4 h-4 inline mr-2" />
                Floor Plans ({floorPlans.length})
              </button>
            )}
            {virtualTourUrl && (
              <button
                onClick={() => setActiveTab('tour')}
                className={cn(
                  'px-4 py-2 font-medium text-sm transition-colors border-b-2',
                  activeTab === 'tour'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-600 hover:text-secondary'
                )}
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                360° Tour
              </button>
            )}
          </div>
        )}

        {/* Content based on active tab */}
        {activeTab === 'tour' && virtualTourUrl ? (
          <div className="w-full h-[600px] rounded-2xl overflow-hidden bg-gray-100">
            <iframe
              src={virtualTourUrl}
              className="w-full h-full border-0"
              allowFullScreen
              title="360° Virtual Tour"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] rounded-2xl overflow-hidden">
            {/* Large Main Image */}
            <motion.div
              className="relative col-span-1 rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(activeTab === 'photos' ? mainImage : floorPlans[0] || '', 0)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={getImageUrl(activeTab === 'photos' ? mainImage! : floorPlans[0] || '')}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                quality={90}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Badges */}
              {activeTab === 'photos' && videoUrl && (
                <Badge className="absolute top-4 left-4 bg-secondary text-white border-0">
                  <Video className="w-3 h-3 mr-1" />
                  Video Available
                </Badge>
              )}
              {virtualTourUrl && (
                <Badge className="absolute top-4 right-4 bg-primary text-white border-0">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  360° Tour
                </Badge>
              )}
            </motion.div>

            {/* Right Side - Grid of 4 small images */}
            <div className="col-span-1 grid grid-cols-2 gap-4">
              {(activeTab === 'photos' ? thumbnails : floorPlans.slice(1, 5)).slice(0, 3).map((image, index) => (
                <motion.div
                  key={index}
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(image, index + 1)}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${title} - Image ${index + 2}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl" />
                </motion.div>
              ))}
              
              {/* Last image with "View All" button */}
              {(activeTab === 'photos' ? remainingImages : floorPlans.length - 4) > 0 ? (
                <motion.div
                  className="relative rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(
                    activeTab === 'photos' 
                      ? images[images.length - 1] 
                      : floorPlans[floorPlans.length - 1], 
                    activeTab === 'photos' ? images.length - 1 : floorPlans.length - 1
                  )}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={getImageUrl(
                      activeTab === 'photos' 
                        ? images[images.length - 1] 
                        : floorPlans[floorPlans.length - 1]
                    )}
                    alt={`${title} - Last Image`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 rounded-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="secondary"
                      className="bg-white/95 hover:bg-white text-primary font-semibold shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform"
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(
                          activeTab === 'photos' 
                            ? images[images.length - 1] 
                            : floorPlans[floorPlans.length - 1],
                          activeTab === 'photos' ? images.length - 1 : floorPlans.length - 1
                        );
                      }}
                    >
                      <Images className="w-4 h-4 mr-2" />
                      +{(activeTab === 'photos' ? remainingImages : floorPlans.length - 4)} More
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="relative rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5" />
                  <span className="text-gray-400 text-sm relative z-10">No image</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {selectedImage && (
              <>
                {/* Navigation Buttons */}
                {(activeTab === 'photos' ? images : floorPlans).length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-10 h-12 w-12"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-10 h-12 w-12"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>
                  </>
                )}

                {/* Main Image with Zoom */}
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: zoom }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full flex items-center justify-center"
                  style={{ transform: `scale(${zoom})` }}
                >
                  <Image
                    src={getImageUrl(selectedImage)}
                    alt={title}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    quality={95}
                  />
                </motion.div>

                {/* Zoom Controls */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-sm rounded-full p-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={handleZoomOut}
                    disabled={zoom <= 1}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-white text-sm px-3 flex items-center">{Math.round(zoom * 100)}%</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 h-8 w-8"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>

                {/* Image Counter */}
                {(activeTab === 'photos' ? images : floorPlans).length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {currentIndex + 1} / {(activeTab === 'photos' ? images : floorPlans).length}
                  </div>
                )}

                {/* Download Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-20 right-4 text-white hover:bg-white/20 rounded-full z-10"
                  onClick={() => handleDownload(getImageUrl(selectedImage), `${title}-${currentIndex + 1}`)}
                  title="Download image"
                >
                  <Download className="w-6 h-6" />
                </Button>
              </>
            )}
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full z-10"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
