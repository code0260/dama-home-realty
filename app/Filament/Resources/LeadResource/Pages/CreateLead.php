<?php

namespace App\Filament\Resources\LeadResource\Pages;

use App\Filament\Resources\LeadResource;
use App\Notifications\NewLeadNotification;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Notification;

class CreateLead extends CreateRecord
{
    protected static string $resource = LeadResource::class;

    protected function afterCreate(): void
    {
        $lead = $this->record;
        $lead->load('property');

        // Notify Super Admins
        $admins = \App\Models\User::role('Super Admin')->get();
        Notification::send($admins, new NewLeadNotification($lead));
    }
}
