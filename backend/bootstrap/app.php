<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();
        
        // Exclude CSRF protection for specific API routes
        $middleware->validateCsrfTokens(except: [
            'api/ai-concierge/chat',
            'api/ai-search',
            'api/webhooks/stripe',
        ]);

        // Add security headers
        $middleware->append(\App\Http\Middleware\SecurityHeaders::class);
        
        // Add response compression for API routes
        $middleware->append(\App\Http\Middleware\CompressionMiddleware::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
