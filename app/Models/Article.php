<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Spatie\Translatable\HasTranslations;

class Article extends Model
{
    use HasFactory, HasTranslations;

    /**
     * The attributes that are translatable.
     *
     * @var array<int, string>
     */
    public array $translatable = ['title', 'content'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'title',
        'content',
        'image',
        'author_id',
        'published_at',
        'is_featured',
        'views',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'title' => 'array',
            'content' => 'array',
            'published_at' => 'datetime',
            'is_featured' => 'boolean',
            'views' => 'integer',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($article) {
            if (empty($article->slug)) {
                $title = is_array($article->title) 
                    ? ($article->title['en'] ?? $article->title['ar'] ?? 'article')
                    : $article->title;
                $article->slug = Str::slug($title);
            }
        });

        static::updating(function ($article) {
            if ($article->isDirty('title') && empty($article->slug)) {
                $title = is_array($article->title) 
                    ? ($article->title['en'] ?? $article->title['ar'] ?? 'article')
                    : $article->title;
                $article->slug = Str::slug($title);
            }
        });
    }

    /**
     * Get the author that owns the article.
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * Scope a query to only include published articles.
     */
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
                    ->where('published_at', '<=', now());
    }

    /**
     * Scope a query to only include featured articles.
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Increment views count.
     */
    public function incrementViews(): void
    {
        $this->increment('views');
    }
}
