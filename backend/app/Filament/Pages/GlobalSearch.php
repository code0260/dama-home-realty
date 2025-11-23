<?php

namespace App\Filament\Pages;

use App\Services\SearchService;
use Filament\Pages\Page;
use Illuminate\Contracts\Support\Htmlable;

class GlobalSearch extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-magnifying-glass';
    
    protected static string $view = 'filament.pages.global-search';
    
    protected static ?string $navigationLabel = 'Global Search';
    
    protected static ?int $navigationSort = 1;
    
    protected static ?string $title = 'Global Search';

    public string $searchQuery = '';
    public array $searchResults = [];
    public array $filters = [];
    public bool $isSearching = false;

    protected SearchService $searchService;

    public function boot(SearchService $searchService): void
    {
        $this->searchService = $searchService;
    }

    public function search(): void
    {
        if (empty($this->searchQuery)) {
            $this->searchResults = [];
            return;
        }

        $this->isSearching = true;
        
        $this->searchResults = $this->searchService->search($this->searchQuery, $this->filters);
        
        $this->isSearching = false;
    }

    public function clearSearch(): void
    {
        $this->searchQuery = '';
        $this->searchResults = [];
        $this->filters = [];
    }

    public function getSuggestions(): array
    {
        if (strlen($this->searchQuery) < 2) {
            return [];
        }

        return $this->searchService->getSuggestions($this->searchQuery);
    }
}

