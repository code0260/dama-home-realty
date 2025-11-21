'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Get full image URL
  const getImageUrl = (image: string) => {
    if (image.startsWith('http')) return image;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${apiUrl}/storage/${image}`;
  };

  // Main image (first one or placeholder)
  const mainImage = images && images.length > 0 ? images[0] : null;
  // Thumbnail images (next 4) - Bento Grid style
  const thumbnails = images && images.length > 1 ? images.slice(1, 5) : [];

  const openLightbox = (image: string) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedImage(null);
  };

  if (!mainImage) {
    return (
      <div className="w-full h-[600px] bg-linear-to-br from-[#0F172A]/20 to-[#B49162]/20 flex items-center justify-center rounded-2xl">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      {/* Bento Grid Layout: 1 large + 4 small */}
      <div className="grid grid-cols-4 gap-4 h-[600px]">
        {/* Large Main Image - Takes 2 columns and 2 rows */}
        <motion.div
          className="col-span-4 md:col-span-2 row-span-2 rounded-2xl overflow-hidden cursor-pointer group relative"
          onClick={() => openLightbox(mainImage)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <Image
            src={getImageUrl(mainImage)}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>

        {/* Small Thumbnails - 4 images in 2x2 grid */}
        <div className="col-span-4 md:col-span-2 grid grid-cols-2 gap-4">
          {thumbnails.map((image, index) => (
            <motion.div
              key={index}
              className="relative rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(image)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={getImageUrl(image)}
                alt={`${title} - Image ${index + 2}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                quality={85}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl" />
            </motion.div>
          ))}
          
          {/* Placeholder for empty slots */}
          {thumbnails.length < 4 &&
            Array.from({ length: 4 - thumbnails.length }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="relative rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-linear-to-br from-[#0F172A]/5 to-[#B49162]/5" />
                <span className="text-gray-400 text-sm relative z-10">No image</span>
              </div>
            ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
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
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
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

