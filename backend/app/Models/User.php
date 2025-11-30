<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles, Billable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the bookings for the user.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Check if user can access Filament admin panel.
     * Super Admin and Staff can access.
     * Also allows access in development or for specific admin emails.
     */
    public function canAccessPanel(\Filament\Panel $panel): bool
    {
        // Allow access if user has admin roles
        if ($this->hasAnyRole(['Super Admin', 'Staff'])) {
            return true;
        }

        // In development, allow all users (for testing)
        if (app()->environment('local')) {
            return true;
        }

        // Allow specific admin emails (for emergency access)
        $allowedEmails = [
            'admin@damahomerealty.com',
            'admin@dama.com',
        ];

        if (in_array($this->email, $allowedEmails)) {
            return true;
        }

        return false;
    }
}
