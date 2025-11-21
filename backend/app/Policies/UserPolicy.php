<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determine if the user can view any users.
     */
    public function viewAny(User $user): bool
    {
        // Only Super Admin can view users
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can view the user.
     */
    public function view(User $user, User $model): bool
    {
        // Only Super Admin can view users
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can create users.
     */
    public function create(User $user): bool
    {
        // Only Super Admin can create users
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can update the user.
     */
    public function update(User $user, User $model): bool
    {
        // Only Super Admin can update users
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can delete the user.
     */
    public function delete(User $user, User $model): bool
    {
        // Only Super Admin can delete users
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can delete any users.
     */
    public function deleteAny(User $user): bool
    {
        // Only Super Admin can delete
        return $user->hasRole('Super Admin');
    }
}

