<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Hash;

class CreateUser extends CreateRecord
{
    protected static string $resource = UserResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        // Ensure password is hashed
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // Set email_verified_at if not set
        if (empty($data['email_verified_at'])) {
            $data['email_verified_at'] = now();
        }

        return $data;
    }

    protected function afterCreate(): void
    {
        // Assign role if selected
        $roleId = $this->form->getState()['roles'] ?? null;
        if ($roleId) {
            // Get role by ID and assign by name
            $role = \Spatie\Permission\Models\Role::find($roleId);
            if ($role) {
                $this->record->syncRoles([$role->name]);
            }
        }
    }
}
