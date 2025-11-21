<?php

namespace App\Filament\Resources\PropertyResource\Pages;

use App\Filament\Resources\PropertyResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use pxlrbt\FilamentExcel\Actions\Tables\ExportAction;
use pxlrbt\FilamentExcel\Actions\Tables\ImportAction;

class ListProperties extends ListRecords
{
    protected static string $resource = PropertyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            ExportAction::make()
                ->label('Export to Excel')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('success'),
            ImportAction::make()
                ->label('Import from Excel')
                ->icon('heroicon-o-arrow-up-tray')
                ->color('primary'),
        ];
    }
}
