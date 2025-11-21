<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    /**
     * Determine if the user can view any properties.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can view the property.
     */
    public function view(User $user, Property $property): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can create properties.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can update the property.
     */
    public function update(User $user, Property $property): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can delete the property.
     */
    public function delete(User $user, Property $property): bool
    {
        // Only Super Admin can delete
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can delete any properties.
     */
    public function deleteAny(User $user): bool
    {
        // Only Super Admin can delete
        return $user->hasRole('Super Admin');
    }
}

