<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Carbon\Carbon;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Booking extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'property_id',
        'user_id',
        'check_in',
        'check_out',
        'total_price',
        'amount_paid',
        'payment_status',
        'booking_status',
        'stripe_checkout_session_id',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'check_in' => 'date',
            'check_out' => 'date',
            'total_price' => 'decimal:2',
            'amount_paid' => 'decimal:2',
            'payment_status' => 'string',
            'booking_status' => 'string',
        ];
    }

    /**
     * Get the property that owns the booking.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the user (tenant) that owns the booking.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the contract for the booking.
     */
    public function contract(): HasOne
    {
        return $this->hasOne(Contract::class);
    }

    /**
     * Check if booking dates overlap with another booking.
     */
    public static function hasOverlap(int $propertyId, Carbon $checkIn, Carbon $checkOut, ?int $excludeBookingId = null): bool
    {
        $query = static::where('property_id', $propertyId)
            ->where('booking_status', '!=', 'cancelled')
            ->where(function ($q) use ($checkIn, $checkOut) {
                $q->whereBetween('check_in', [$checkIn, $checkOut->copy()->subDay()])
                  ->orWhereBetween('check_out', [$checkIn->copy()->addDay(), $checkOut])
                  ->orWhere(function ($q2) use ($checkIn, $checkOut) {
                      $q2->where('check_in', '<=', $checkIn)
                         ->where('check_out', '>=', $checkOut);
                  });
            });

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return $query->exists();
    }

    /**
     * Calculate number of nights.
     */
    public function getNightsAttribute(): int
    {
        return $this->check_in->diffInDays($this->check_out);
    }

    /**
     * Check if booking is active (current stay).
     */
    public function isActive(): bool
    {
        $today = Carbon::today();
        return $this->booking_status === 'confirmed' 
            && $this->check_in <= $today 
            && $this->check_out >= $today;
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
            ->setDescriptionForEvent(fn(string $eventName) => "Booking {$eventName}");
    }
}
