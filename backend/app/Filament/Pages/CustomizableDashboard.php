<?php

namespace App\Filament\Pages;

use App\Models\DashboardLayout;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Auth;

class CustomizableDashboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';
    
    protected static string $view = 'filament.pages.customizable-dashboard';
    
    protected static ?string $navigationLabel = 'Custom Dashboard';
    
    protected static ?int $navigationSort = 0;
    
    protected static ?string $title = 'Customizable Dashboard';
    
    protected static array $widgets = [
        \App\Filament\Widgets\StatsOverview::class,
        \App\Filament\Widgets\AdvancedRevenueChart::class,
        \App\Filament\Widgets\BookingsAnalytics::class,
    ];

    public function mount(): void
    {
        // Load user's dashboard layout
        $this->loadUserLayout();
    }

    protected function loadUserLayout(): void
    {
        $user = Auth::user();
        
        $layout = DashboardLayout::where('user_id', $user->id)
            ->where('is_default', true)
            ->first();
        
        if (!$layout) {
            // Create default layout
            $layout = DashboardLayout::create([
                'user_id' => $user->id,
                'name' => 'Default Layout',
                'is_default' => true,
                'widgets_config' => $this->getDefaultWidgetsConfig(),
                'grid_config' => $this->getDefaultGridConfig(),
            ]);
        }
    }

    protected function getDefaultWidgetsConfig(): array
    {
        return [
            'StatsOverview' => [
                'visible' => true,
                'position' => ['x' => 0, 'y' => 0],
                'size' => ['w' => 12, 'h' => 2],
            ],
            'RevenueChart' => [
                'visible' => true,
                'position' => ['x' => 0, 'y' => 2],
                'size' => ['w' => 6, 'h' => 4],
            ],
            'BookingsChart' => [
                'visible' => true,
                'position' => ['x' => 6, 'y' => 2],
                'size' => ['w' => 6, 'h' => 4],
            ],
        ];
    }

    protected function getDefaultGridConfig(): array
    {
        return [
            'columns' => 12,
            'rowHeight' => 50,
            'margin' => [10, 10],
        ];
    }

    public function saveLayout(array $widgetsConfig, array $gridConfig): void
    {
        $user = Auth::user();
        
        DashboardLayout::updateOrCreate(
            [
                'user_id' => $user->id,
                'is_default' => true,
            ],
            [
                'widgets_config' => $widgetsConfig,
                'grid_config' => $gridConfig,
            ]
        );
    }
    
    public function resetLayout(): void
    {
        $user = Auth::user();
        
        DashboardLayout::where('user_id', $user->id)
            ->where('is_default', true)
            ->delete();
        
        // Create default layout
        $this->loadUserLayout();
    }
    
    public function getWidgets(): array
    {
        return static::$widgets;
    }
    
    public function getColumns(): int
    {
        return 12;
    }
}

