<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\Translatable\HasTranslations;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Property extends Model
{
    use HasFactory, HasTranslations, LogsActivity;

    /**
     * The attributes that are translatable.
     *
     * @var array<int, string>
     */
    public array $translatable = ['title', 'description'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'uuid',
        'slug',
        'reference_id',
        'title',
        'description',
        'price',
        'currency',
        'type',
        'neighborhood_id',
        'agent_id',
        'bedrooms',
        'bathrooms',
        'area_sqm',
        'is_verified',
        'is_featured',
        'amenities',
        'images',
        'video_url',
        'owner_contact',
        'owner_name',
        'owner_email',
        'status',
        'wifi_password',
        'door_code',
        'house_rules',
        'full_address',
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
            'description' => 'array',
            'amenities' => 'array',
            'images' => 'array',
            'is_verified' => 'boolean',
            'is_featured' => 'boolean',
            'price' => 'decimal:2',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($property) {
            if (empty($property->uuid)) {
                $property->uuid = (string) Str::uuid();
            }
            
            if (empty($property->slug)) {
                $title = is_array($property->title) 
                    ? ($property->title['en'] ?? $property->title['ar'] ?? 'property')
                    : $property->title;
                $property->slug = Str::slug($title);
            }

            // Generate reference_id if not provided
            if (empty($property->reference_id)) {
                $lastId = Property::max('id') ?? 0;
                $property->reference_id = 'REF-' . str_pad((string) ($lastId + 1), 4, '0', STR_PAD_LEFT);
            }
        });

        static::updating(function ($property) {
            if ($property->isDirty('title') && empty($property->slug)) {
                $title = is_array($property->title) 
                    ? ($property->title['en'] ?? $property->title['ar'] ?? 'property')
                    : $property->title;
                $property->slug = Str::slug($title);
            }
        });
    }

    /**
     * Get the neighborhood that owns the property.
     */
    public function neighborhood(): BelongsTo
    {
        return $this->belongsTo(Neighborhood::class);
    }

    /**
     * Get the agent that owns the property.
     */
    public function agent(): BelongsTo
    {
        return $this->belongsTo(Agent::class);
    }

    /**
     * Get the leads for the property.
     */
    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    /**
     * Get the bookings for the property.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Configure activity log options.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly($this->fillable)
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "Property {$eventName}");
    }
}
