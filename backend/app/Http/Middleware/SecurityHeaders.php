<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // Only add HSTS in production
        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // Skip CSP for admin panel (Filament/Livewire needs more flexibility)
        if ($request->is('admin/*')) {
            // In development, skip CSP entirely for admin panel to avoid Livewire issues
            if (app()->environment('local', 'development')) {
                // Skip CSP for admin panel in development
                return $response;
            }
            
            // More permissive CSP for Filament admin panel in production
            $csp = "default-src 'self'; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://cdn.jsdelivr.net; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net; " .
                   "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net data:; " .
                   "img-src 'self' data: https: blob:; " .
                   "connect-src 'self' https://api.openai.com https://maps.googleapis.com ws: wss: http: https:; " .
                   "frame-src 'self' https://maps.googleapis.com; " .
                   "form-action 'self';";
        } else {
            // Stricter CSP for public pages
            $csp = "default-src 'self'; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://cdn.jsdelivr.net; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net; " .
                   "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net data:; " .
                   "img-src 'self' data: https: blob:; " .
                   "connect-src 'self' https://api.openai.com https://maps.googleapis.com ws: wss:; " .
                   "frame-src 'self' https://maps.googleapis.com;";
        }
        
        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}

