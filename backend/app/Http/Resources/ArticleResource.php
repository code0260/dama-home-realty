<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
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
            'slug' => $this->slug,
            'title' => $this->getTranslation('title', $locale) ?? $this->getTranslation('title', 'en'),
            'content' => $this->getTranslation('content', $locale) ?? $this->getTranslation('content', 'en'),
            'image' => $this->image ? (str_starts_with($this->image, 'http') ? $this->image : asset('storage/' . $this->image)) : null,
            'author' => $this->when(
                $this->relationLoaded('author') && $this->author,
                function () {
                    return [
                        'id' => $this->author->id,
                        'name' => $this->author->name,
                    ];
                },
                null
            ),
            'published_at' => $this->published_at?->toISOString(),
            'is_featured' => $this->is_featured,
            'views' => $this->views,
            'excerpt' => $this->getExcerpt($locale),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get excerpt from content (first 200 characters).
     */
    private function getExcerpt(string $locale): string
    {
        $content = $this->getTranslation('content', $locale) ?? $this->getTranslation('content', 'en') ?? '';
        
        // Strip HTML tags
        $text = strip_tags($content);
        
        // Get first 200 characters
        if (strlen($text) > 200) {
            return substr($text, 0, 200) . '...';
        }
        
        return $text;
    }
}
