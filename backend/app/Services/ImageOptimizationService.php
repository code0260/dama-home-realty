<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ImageOptimizationService
{
    protected ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Optimize and convert images to WebP format.
     * 
     * @param array|string $images Path(s) to image(s)
     * @param string $disk Storage disk name
     * @return array|string Optimized image path(s)
     */
    public function optimizeToWebP(array|string $images, string $disk = 'public'): array|string
    {
        if (is_string($images)) {
            return $this->processSingleImage($images, $disk);
        }

        $optimized = [];
        foreach ($images as $image) {
            $optimized[] = $this->processSingleImage($image, $disk);
        }

        return $optimized;
    }

    /**
     * Process a single image: optimize and convert to WebP.
     * 
     * @param string $imagePath Path to the image
     * @param string $disk Storage disk name
     * @return string Optimized image path
     */
    protected function processSingleImage(string $imagePath, string $disk = 'public'): string
    {
        try {
            // Skip if already WebP
            if (str_ends_with(strtolower($imagePath), '.webp')) {
                return $imagePath;
            }

            // Check if file exists
            if (!Storage::disk($disk)->exists($imagePath)) {
                Log::warning("Image not found for optimization: {$imagePath}");
                return $imagePath;
            }

            // Read the image
            $imageContent = Storage::disk($disk)->get($imagePath);
            $image = $this->imageManager->read($imageContent);

            // Optimize: resize if too large (max width 1920px, maintain aspect ratio)
            $width = $image->width();
            if ($width > 1920) {
                $image->scale(width: 1920);
            }

            // Convert to WebP with quality 85
            $webpContent = $image->toWebp(85);

            // Generate new filename
            $pathInfo = pathinfo($imagePath);
            $newPath = ($pathInfo['dirname'] !== '.' ? $pathInfo['dirname'] . '/' : '') 
                . $pathInfo['filename'] . '.webp';

            // Save the optimized image
            Storage::disk($disk)->put($newPath, $webpContent);

            // Delete original if it's not already WebP
            if ($imagePath !== $newPath) {
                Storage::disk($disk)->delete($imagePath);
            }

            Log::info("Image optimized: {$imagePath} -> {$newPath}");

            return $newPath;
        } catch (\Exception $e) {
            Log::error("Failed to optimize image {$imagePath}: " . $e->getMessage());
            // Return original path if optimization fails
            return $imagePath;
        }
    }
}

