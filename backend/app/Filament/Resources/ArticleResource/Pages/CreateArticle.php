<?php

namespace App\Filament\Resources\ArticleResource\Pages;

use App\Filament\Resources\ArticleResource;
use App\Services\ImageOptimizationService;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateArticle extends CreateRecord
{
    protected static string $resource = ArticleResource::class;

    protected function afterCreate(): void
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

        $optimizationService = app(ImageOptimizationService::class);
        $optimizedImage = $optimizationService->optimizeToWebP($image, 'public');

        $article->update(['image' => $optimizedImage]);
    }
}
