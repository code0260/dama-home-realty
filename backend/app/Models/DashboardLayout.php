<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardLayout extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'is_default',
        'widgets_config',
        'grid_config',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'widgets_config' => 'array',
        'grid_config' => 'array',
    ];

    /**
     * Get the user that owns the dashboard layout.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
