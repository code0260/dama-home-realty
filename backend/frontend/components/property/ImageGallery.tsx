'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get full image URL
  const getImageUrl = (image: string) => {
    if (image.startsWith('http')) return image;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${apiUrl}/storage/${image}`;
  };

  // Main image (first one)
  const mainImage = images && images.length > 0 ? images[0] : null;
  // Thumbnail images (next 4) - Bento Grid style
  const thumbnails = images && images.length > 1 ? images.slice(1, 5) : [];
  const remainingImages = images && images.length > 5 ? images.length - 5 : 0;

  const openLightbox = (image: string, index: number = 0) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
    setCurrentIndex(0);
  };

  const nextImage = () => {
    if (!images || images.length === 0) return;
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    if (!images || images.length === 0) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  if (!mainImage) {
    return (
      <div className="w-full h-[500px] bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center rounded-2xl">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Bento Grid Layout: 1 large (left) + 4 small (right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] rounded-2xl overflow-hidden">
        {/* Large Main Image - Left Side */}
        <motion.div
          className="relative col-span-1 rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(mainImage, 0)}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={getImageUrl(mainImage)}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>

        {/* Right Side - Grid of 4 small images */}
        <div className="col-span-1 grid grid-cols-2 gap-4">
          {thumbnails.slice(0, 3).map((image, index) => (
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
          
          {/* Last image with "View All Photos" button */}
          {thumbnails.length >= 4 ? (
            <motion.div
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(thumbnails[3], 4)}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={getImageUrl(thumbnails[3])}
                alt={`${title} - Image 5`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                quality={85}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 rounded-2xl" />
              
              {/* View All Photos Button - Floating */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="secondary"
                  className="bg-white/95 hover:bg-white text-primary font-semibold shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(thumbnails[3], 4);
                  }}
                >
                  <Images className="w-4 h-4 mr-2" />
                  {remainingImages > 0 ? `+${remainingImages + 1} More` : 'View All'}
                </Button>
              </div>
            </motion.div>
          ) : remainingImages > 0 ? (
            <motion.div
              className="relative rounded-2xl overflow-hidden cursor-pointer group bg-gray-200"
              onClick={() => openLightbox(images[images.length - 1], images.length - 1)}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              {images.length > 4 && (
                <>
                  <Image
                    src={getImageUrl(images[4])}
                    alt={`${title} - Image 5`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    loading="lazy"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 rounded-2xl" />
                </>
              )}
              
              {/* View All Photos Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="secondary"
                  className="bg-white/95 hover:bg-white text-primary font-semibold shadow-lg backdrop-blur-sm group-hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(images[images.length - 1], images.length - 1);
                  }}
                >
                  <Images className="w-4 h-4 mr-2" />
                  +{remainingImages} More
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

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {selectedImage && images && (
              <>
                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-10"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                    >
                      <ChevronRight className="w-8 h-8" />
                    </Button>
                  </>
                )}

                {/* Main Image */}
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
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

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                    {currentIndex + 1} / {images.length}
                  </div>
                )}
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
