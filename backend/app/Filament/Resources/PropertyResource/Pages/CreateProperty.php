<?php

namespace App\Filament\Resources\PropertyResource\Pages;

use App\Filament\Resources\PropertyResource;
use App\Services\ImageOptimizationService;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateProperty extends CreateRecord
{
    protected static string $resource = PropertyResource::class;

    protected function afterCreate(): void
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

        $optimizationService = app(ImageOptimizationService::class);
        $optimizedImages = $optimizationService->optimizeToWebP($images, 'public');

        $property->update(['images' => $optimizedImages]);
    }
}
