<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyListResource extends JsonResource
{
    /**
     * Transform the resource into a lightweight array for list views.
     * This excludes heavy fields like full description and all images.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $locale = $request->get('locale', app()->getLocale());
        
        // Get cover image (first image only) but return as array for frontend compatibility
        $coverImages = [];
        if (!empty($this->images) && is_array($this->images) && count($this->images) > 0) {
            $coverImages = [$this->images[0]]; // Only first image for list view
        }
        
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'reference_id' => $this->reference_id,
            'title' => $this->getTranslation('title', $locale) ?? $this->getTranslation('title', 'en'),
            // Exclude full description - only needed in detail view
            'price' => $this->price,
            'currency' => $this->currency,
            'type' => $this->type,
            'neighborhood' => $this->whenLoaded('neighborhood', function () use ($locale) {
                return [
                    'id' => $this->neighborhood->id,
                    'name' => $this->neighborhood->getTranslation('name', $locale) ?? $this->neighborhood->getTranslation('name', 'en'),
                    'slug' => $this->neighborhood->slug,
                ];
            }),
            // Exclude full agent details - only include minimal info if needed
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'area_sqm' => $this->area_sqm,
            'is_verified' => $this->is_verified,
            'is_featured' => $this->is_featured,
            // Only include cover image as array (for frontend compatibility)
            'images' => $coverImages,
            'status' => $this->status,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}

