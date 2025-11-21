<?php

namespace App\Filament\Resources\PropertyResource\Pages;

use App\Filament\Resources\PropertyResource;
use App\Services\ImageOptimizationService;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditProperty extends EditRecord
{
    protected static string $resource = PropertyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->visible(fn () => auth()->user()->hasRole('Super Admin')),
        ];
    }

    protected function afterSave(): void
    {
        $this->optimizeImages();
    }

    protected function optimizeImages(): void
    {
        $property = $this->record;
        $images = $property->images ?? [];

        if (empty($images)) {
            return;
        }

        // Only optimize newly uploaded images (check if images were changed)
        if (!$this->record->wasChanged('images')) {
            return;
        }

        $optimizationService = app(ImageOptimizationService::class);
        $optimizedImages = $optimizationService->optimizeToWebP($images, 'public');

        $property->update(['images' => $optimizedImages]);
    }
}
