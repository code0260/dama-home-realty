<?php

namespace App\Providers;

use App\Models\Booking;
use App\Policies\BookingPolicy;
use Filament\Support\Facades\FilamentView;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\Request; // <--- هام جداً: مكتبة الطلبات
use Illuminate\Cookie\Middleware\EncryptCookies;

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
        // 1. إجبار الموقع على HTTPS (للألوان والستايل) - فقط في production
        if (config('app.env') !== 'local') {
        URL::forceScheme('https');
        }

        // 2. إصلاح خطأ 405 (Trust Proxies)
        // هذا الكود يجعل لارفيل يثق في الطلبات القادمة من index.php
        Request::setTrustedProxies(
            ['*'], 
            Request::HEADER_X_FORWARDED_FOR | 
            Request::HEADER_X_FORWARDED_HOST | 
            Request::HEADER_X_FORWARDED_PORT | 
            Request::HEADER_X_FORWARDED_PROTO | 
            Request::HEADER_X_FORWARDED_AWS_ELB
        );

        // 3. استبعاد XSRF-TOKEN من التشفير حتى يمكن قراءته من JavaScript
        $this->app->resolving(EncryptCookies::class, function ($middleware) {
            $middleware->except(['XSRF-TOKEN', 'laravel_session']);
        });

        // 4. تسجيل سياسات الأمان
        $this->registerPolicies();
    }
}
