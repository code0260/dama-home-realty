<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NeighborhoodResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $locale = $request->get('locale', app()->getLocale());
        
        return [
            'id' => $this->id,
            'name' => $this->getTranslation('name', $locale) ?? $this->getTranslation('name', 'en'),
            'slug' => $this->slug,
            'description' => $this->getTranslation('description', $locale) ?? $this->getTranslation('description', 'en'),
            'image' => $this->image,
            'city' => $this->city,
            'properties_count' => $this->whenCounted('properties'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

