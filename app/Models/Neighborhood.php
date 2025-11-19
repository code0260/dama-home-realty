<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\Translatable\HasTranslations;

class Neighborhood extends Model
{
    use HasFactory, HasTranslations;

    /**
     * The attributes that are translatable.
     *
     * @var array<int, string>
     */
    public array $translatable = ['name', 'description'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'city',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'name' => 'array',
            'description' => 'array',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($neighborhood) {
            if (empty($neighborhood->slug)) {
                $name = is_array($neighborhood->name) 
                    ? ($neighborhood->name['en'] ?? $neighborhood->name['ar'] ?? 'neighborhood')
                    : $neighborhood->name;
                $neighborhood->slug = Str::slug($name);
            }
        });

        static::updating(function ($neighborhood) {
            if ($neighborhood->isDirty('name') && empty($neighborhood->slug)) {
                $name = is_array($neighborhood->name) 
                    ? ($neighborhood->name['en'] ?? $neighborhood->name['ar'] ?? 'neighborhood')
                    : $neighborhood->name;
                $neighborhood->slug = Str::slug($name);
            }
        });
    }

    /**
     * Get the properties for the neighborhood.
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }
}
