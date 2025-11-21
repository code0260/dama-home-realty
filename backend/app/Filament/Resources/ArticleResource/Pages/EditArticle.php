<?php

namespace App\Filament\Resources\ArticleResource\Pages;

use App\Filament\Resources\ArticleResource;
use App\Services\ImageOptimizationService;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditArticle extends EditRecord
{
    protected static string $resource = ArticleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        $this->optimizeImage();
    }

    protected function optimizeImage(): void
    {
        $article = $this->record;
        $image = $article->image;

        if (empty($image)) {
            return;
        }

        // Only optimize newly uploaded images (check if image was changed)
        if (!$this->record->wasChanged('image')) {
            return;
        }

        $optimizationService = app(ImageOptimizationService::class);
        $optimizedImage = $optimizationService->optimizeToWebP($image, 'public');

        $article->update(['image' => $optimizedImage]);
    }
}
