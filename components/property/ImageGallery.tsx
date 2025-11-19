'use client';

import { useState } from 'react';
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
    return `http://localhost:8000/storage/${image}`;
  };

  // Main image (first one or placeholder)
  const mainImage = images && images.length > 0 ? images[0] : null;
  // Thumbnail images (next 4)
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
      <div className="w-full h-96 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Image */}
        <div className="md:col-span-2">
          <div
            className="relative w-full h-96 rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(mainImage)}
          >
            <Image
              src={getImageUrl(mainImage)}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 66vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        </div>

        {/* Thumbnails Grid */}
        <div className="grid grid-cols-2 gap-4">
          {thumbnails.map((image, index) => (
            <div
              key={index}
              className="relative w-full h-44 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(image)}
            >
              <Image
                src={getImageUrl(image)}
                alt={`${title} - Image ${index + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}
          {/* Placeholder for empty slots */}
          {thumbnails.length < 4 &&
            Array.from({ length: 4 - thumbnails.length }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="w-full h-44 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-400 text-sm">No image</span>
              </div>
            ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-black/95 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {selectedImage && (
              <Image
                src={getImageUrl(selectedImage)}
                alt={title}
                fill
                className="object-contain"
                sizes="100vw"
                unoptimized
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
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

