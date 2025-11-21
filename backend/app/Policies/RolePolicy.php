<?php

namespace App\Policies;

use Spatie\Permission\Models\Role;
use App\Models\User;

class RolePolicy
{
    /**
     * Determine if the user can view any roles.
     */
    public function viewAny(User $user): bool
    {
        // Only Super Admin can view roles
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can view the role.
     */
    public function view(User $user, Role $role): bool
    {
        // Only Super Admin can view roles
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can create roles.
     */
    public function create(User $user): bool
    {
        // Only Super Admin can create roles
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can update the role.
     */
    public function update(User $user, Role $role): bool
    {
        // Only Super Admin can update roles
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can delete the role.
     */
    public function delete(User $user, Role $role): bool
    {
        // Only Super Admin can delete roles
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can delete any roles.
     */
    public function deleteAny(User $user): bool
    {
        // Only Super Admin can delete
        return $user->hasRole('Super Admin');
    }
}

