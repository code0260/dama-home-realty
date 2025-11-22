'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  X,
  Image as ImageIcon,
  GripVertical,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  maxImages?: number;
  error?: string;
  className?: string;
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 20,
  error,
  className,
}: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<Map<number, string>>(new Map());

  // Generate preview URLs
  const updatePreviews = useCallback((files: File[]) => {
    const newPreviews = new Map<number, string>();
    files.forEach((file, index) => {
      if (file && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newPreviews.set(index, url);
      }
    });
    setPreviews(newPreviews);
    
    // Cleanup old previews
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Update previews when images change
  useEffect(() => {
    if (images.length > 0) {
      updatePreviews(images);
    }
  }, [images, updatePreviews]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files).filter((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (images.length + newImages.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const updatedImages = [...images, ...newImages];
    onImagesChange(updatedImages);
    updatePreviews(updatedImages);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
    
    // Cleanup preview
    const previewUrl = previews.get(index);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      const newPreviews = new Map(previews);
      newPreviews.delete(index);
      setPreviews(newPreviews);
    }
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...images];
    const [removed] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, removed);
    onImagesChange(updatedImages);
    updatePreviews(updatedImages);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer',
          dragging
            ? 'border-secondary bg-secondary/10 scale-105'
            : 'border-gray-300 dark:border-primary-700 hover:border-secondary/50 bg-gray-50 dark:bg-primary-800',
          error && 'border-red-500'
        )}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="image-upload"
          disabled={images.length >= maxImages || uploading}
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <Upload
            className={cn(
              'w-12 h-12 mx-auto mb-4',
              dragging ? 'text-secondary' : 'text-gray-400'
            )}
          />
          <p className="text-lg font-semibold text-primary dark:text-white mb-2">
            {dragging ? 'Drop images here' : 'Drag & drop images here'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Maximum {maxImages} images, 10MB each (JPG, PNG, WebP)
          </p>
          {images.length >= maxImages && (
            <p className="text-xs text-red-500 mt-2">
              Maximum number of images reached
            </p>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {images.map((image, index) => {
              const previewUrl = previews.get(index);
              const isMain = index === 0;

              return (
                <motion.div
                  key={`${image.name}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                  <Card className={cn(
                    'overflow-hidden border-2 transition-all duration-200',
                    isMain
                      ? 'border-secondary shadow-lg'
                      : 'border-gray-200 dark:border-primary-700 hover:border-secondary/50'
                  )}>
                    <CardContent className="p-0">
                      {/* Image Preview */}
                      <div className="relative aspect-square bg-gray-100 dark:bg-primary-800">
                        {previewUrl ? (
                          <Image
                            src={previewUrl}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          </div>
                        )}

                        {/* Main Image Badge */}
                        {isMain && (
                          <div className="absolute top-2 left-2 bg-secondary text-white px-2 py-1 rounded text-xs font-semibold">
                            Main
                          </div>
                        )}

                        {/* Image Number */}
                        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs font-semibold">
                          {index + 1}
                        </div>

                        {/* Actions Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                          {/* Move Buttons */}
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMove(index, index - 1)}
                              className="bg-white/20 hover:bg-white/30 text-white"
                            >
                              <GripVertical className="w-4 h-4 rotate-90" />
                            </Button>
                          )}
                          {index < images.length - 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMove(index, index + 1)}
                              className="bg-white/20 hover:bg-white/30 text-white"
                            >
                              <GripVertical className="w-4 h-4 -rotate-90" />
                            </Button>
                          )}

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(index)}
                            className="bg-red-500/80 hover:bg-red-600 text-white"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Image Info */}
                      <div className="p-2 bg-gray-50 dark:bg-primary-800">
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {image.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {(image.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Set as Main Button */}
                  {!isMain && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMove(index, 0)}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full mt-2 text-xs"
                    >
                      Set as Main
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Uploading images...</span>
        </div>
      )}
    </div>
  );
}

