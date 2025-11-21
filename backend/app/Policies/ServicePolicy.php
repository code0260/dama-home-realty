<?php

namespace App\Policies;

use App\Models\Service;
use App\Models\User;

class ServicePolicy
{
    /**
     * Determine if the user can view any services.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can view the service.
     */
    public function view(User $user, Service $service): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can create services.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can update the service.
     */
    public function update(User $user, Service $service): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can delete the service.
     */
    public function delete(User $user, Service $service): bool
    {
        // Only Super Admin can delete
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can delete any services.
     */
    public function deleteAny(User $user): bool
    {
        // Only Super Admin can delete
        return $user->hasRole('Super Admin');
    }
}

