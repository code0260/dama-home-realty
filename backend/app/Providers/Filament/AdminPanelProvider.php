<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->brandName('Dama Home Realty')
            ->brandLogo(asset('images/logo.png'))
            ->brandLogoHeight('3rem')
            ->favicon(asset('images/icon-192x192.png'))
            ->colors([
                'primary' => Color::hex('#B49162'), // Bronze/Gold - Dama Home Realty brand color
                'gray' => Color::Slate, // Cool-toned gray to match Navy Blue vibe
            ])
            ->font('Cairo') // Google Font: Cairo (supports Arabic & English)
            ->sidebarCollapsibleOnDesktop() // Enable collapsible sidebar
            ->maxContentWidth('full') // Better view of tables
            ->globalSearchKeyBindings(['command+k', 'ctrl+k']) // Keyboard shortcuts
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
                \App\Filament\Pages\CustomizableDashboard::class,
                \App\Filament\Pages\GlobalSearch::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                Widgets\AccountWidget::class,
                \App\Filament\Widgets\StatsOverview::class,
                \App\Filament\Widgets\RevenueChart::class,
                \App\Filament\Widgets\AdvancedRevenueChart::class,
                \App\Filament\Widgets\RevenueBreakdown::class,
                \App\Filament\Widgets\RevenueForecast::class,
                \App\Filament\Widgets\BookingsChart::class,
                \App\Filament\Widgets\BookingsAnalytics::class,
                \App\Filament\Widgets\UpcomingBookings::class,
                \App\Filament\Widgets\PropertiesStatistics::class,
                \App\Filament\Widgets\PropertyPerformanceTable::class,
                \App\Filament\Widgets\PopularNeighborhoods::class,
                \App\Filament\Widgets\LeadsFunnel::class,
                \App\Filament\Widgets\LeadSources::class,
                \App\Filament\Widgets\AgentsLeaderboard::class,
                \App\Filament\Widgets\PropertiesMap::class,
                \App\Filament\Widgets\BookingsTimeline::class,
                \App\Filament\Widgets\LatestLeads::class,
                // AI Integration Widgets
                \App\Filament\Widgets\AIInsights::class,
                \App\Filament\Widgets\AIChatInterface::class,
                \App\Filament\Widgets\AIPoweredReports::class,
                // Collaboration Widgets
                \App\Filament\Widgets\TeamActivity::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
