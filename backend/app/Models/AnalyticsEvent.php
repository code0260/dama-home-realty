<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_type',
        'event_name',
        'eventable_type',
        'eventable_id',
        'user_id',
        'properties',
        'session_id',
        'ip_address',
        'user_agent',
        'referrer',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    /**
     * Get the parent eventable model (property, booking, etc.).
     */
    public function eventable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get the user that triggered the event.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

