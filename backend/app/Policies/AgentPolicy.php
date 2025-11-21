<?php

namespace App\Policies;

use App\Models\Agent;
use App\Models\User;

class AgentPolicy
{
    /**
     * Determine if the user can view any agents.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can view the agent.
     */
    public function view(User $user, Agent $agent): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can create agents.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can update the agent.
     */
    public function update(User $user, Agent $agent): bool
    {
        return $user->hasAnyRole(['Super Admin', 'Staff']);
    }

    /**
     * Determine if the user can delete the agent.
     */
    public function delete(User $user, Agent $agent): bool
    {
        // Only Super Admin can delete
        return $user->hasRole('Super Admin');
    }

    /**
     * Determine if the user can delete any agents.
     */
    public function deleteAny(User $user): bool
    {
        // Only Super Admin can delete
        return $user->hasRole('Super Admin');
    }
}

