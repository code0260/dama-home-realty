<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Contract extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'booking_id',
        'contract_number',
        'status',
        'start_date',
        'end_date',
        'total_amount',
        'deposit_amount',
        'payment_status',
        'terms',
        'notes',
        'pdf_path',
        'signed_by_tenant',
        'signed_by_owner',
        'signed_at',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'total_amount' => 'decimal:2',
            'deposit_amount' => 'decimal:2',
            'signed_by_tenant' => 'boolean',
            'signed_by_owner' => 'boolean',
            'signed_at' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($contract) {
            if (empty($contract->contract_number)) {
                $lastId = Contract::max('id') ?? 0;
                $contract->contract_number = 'CNT-' . date('Y') . '-' . str_pad((string) ($lastId + 1), 5, '0', STR_PAD_LEFT);
            }
        });
    }

    /**
     * Get the booking that owns the contract.
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    /**
     * Check if contract is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active' 
            && $this->start_date <= now() 
            && $this->end_date >= now();
    }

    /**
     * Check if contract is fully signed.
     */
    public function isFullySigned(): bool
    {
        return $this->signed_by_tenant && $this->signed_by_owner;
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
            ->setDescriptionForEvent(fn(string $eventName) => "Contract {$eventName}");
    }
}
