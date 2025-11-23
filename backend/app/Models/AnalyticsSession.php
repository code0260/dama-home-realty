<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'user_id',
        'ip_address',
        'user_agent',
        'referrer',
        'started_at',
        'ended_at',
        'duration',
        'page_views',
        'properties',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'properties' => 'array',
    ];

    /**
     * Get the user that owns the session.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

