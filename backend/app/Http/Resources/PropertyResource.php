<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
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
            'uuid' => $this->uuid,
            'slug' => $this->slug,
            'reference_id' => $this->reference_id,
            'title' => $this->getTranslation('title', $locale) ?? $this->getTranslation('title', 'en'),
            'description' => $this->getTranslation('description', $locale) ?? $this->getTranslation('description', 'en'),
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
            'agent' => $this->whenLoaded('agent', function () {
                return [
                    'id' => $this->agent->id,
                    'name' => $this->agent->name,
                    'photo' => $this->agent->photo,
                    'role' => $this->agent->role,
                    'phone' => $this->agent->phone,
                    'languages' => $this->agent->languages ?? [],
                ];
            }),
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'area_sqm' => $this->area_sqm,
            'is_verified' => $this->is_verified,
            'is_featured' => $this->is_featured,
            'amenities' => $this->amenities ?? [],
            'images' => $this->images ?? [],
            'video_url' => $this->video_url,
            'owner_contact' => $this->owner_contact,
            'owner_name' => $this->owner_name ?? null,
            'owner_email' => $this->owner_email ?? null,
            'status' => $this->status,
            'views' => $this->views ?? 0,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
