<?php

namespace App\Filament\Resources\PropertyResource\Pages;

use App\Filament\Resources\PropertyResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Builder;

class ListProperties extends ListRecords
{
    protected static string $resource = PropertyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    /**
     * Modify the query to eager load relationships and prevent N+1 queries.
     */
    protected function getTableQuery(): Builder
    {
        return parent::getTableQuery()
            ->with(['neighborhood', 'agent']);
    }
}
