<?php

namespace App\Providers;

use App\Models\Booking;
use App\Policies\BookingPolicy;
use Filament\Support\Facades\FilamentView;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Booking::class => BookingPolicy::class,
        \App\Models\Property::class => \App\Policies\PropertyPolicy::class,
        \App\Models\Lead::class => \App\Policies\LeadPolicy::class,
        \App\Models\Agent::class => \App\Policies\AgentPolicy::class,
        \App\Models\Service::class => \App\Policies\ServicePolicy::class,
        \App\Models\User::class => \App\Policies\UserPolicy::class,
        \Spatie\Permission\Models\Role::class => \App\Policies\RolePolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Inject custom CSS for Filament login page
        FilamentView::registerRenderHook(
            'panels::auth.login.form.before',
            fn (): string => view('filament.custom.login-background')->render()
        );
    }
}
