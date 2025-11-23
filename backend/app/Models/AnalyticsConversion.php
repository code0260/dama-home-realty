<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsConversion extends Model
{
    use HasFactory;

    protected $fillable = [
        'conversion_type',
        'convertible_type',
        'convertible_id',
        'user_id',
        'session_id',
        'source',
        'medium',
        'campaign',
        'value',
        'properties',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'properties' => 'array',
    ];

    /**
     * Get the parent convertible model (booking, lead, etc.).
     */
    public function convertible(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user that made the conversion.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

