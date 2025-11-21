<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Hash;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->visible(fn () => !$this->record->hasRole('Super Admin')),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        // Load roles relationship
        $this->record->load('roles');
        
        // Set roles for the form
        $data['roles'] = $this->record->roles->pluck('id')->toArray();
        
        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Hash password if provided
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            // Remove password from data if empty (keep existing password)
            unset($data['password']);
        }

        return $data;
    }

    protected function afterSave(): void
    {
        // Sync roles
        $roles = $this->form->getState()['roles'] ?? [];
        if (!empty($roles)) {
            $this->record->syncRoles($roles);
        } else {
            // If no role selected, remove all roles (except Super Admin protection)
            if (!$this->record->hasRole('Super Admin')) {
                $this->record->syncRoles([]);
            }
        }
    }
}
