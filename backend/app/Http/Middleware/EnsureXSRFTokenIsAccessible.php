<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie as SymfonyCookie;
use Illuminate\Support\Facades\Cookie;

class EnsureXSRFTokenIsAccessible
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if this is the CSRF cookie route BEFORE processing
        $isCsrfCookieRoute = $request->routeIs('sanctum.csrf-cookie') || 
                             $request->is('sanctum/csrf-cookie') ||
                             str_contains($request->path(), 'sanctum/csrf-cookie');
        
        $response = $next($request);
        
        // Ensure XSRF-TOKEN cookie is set and accessible from JavaScript
        // This middleware ensures the cookie is set with proper attributes for cross-origin requests
        if ($isCsrfCookieRoute) {
            // Ensure session is started
            if (!$request->hasSession()) {
                $request->session()->start();
            }
            
            // Regenerate CSRF token to ensure it's fresh
            $request->session()->regenerateToken();
            $token = csrf_token();
            
            if ($token) {
                // Get session config
                $isLocal = config('app.env') === 'local';
                
                // Build cookie string manually to ensure it's set correctly
                $cookieParts = [
                    'XSRF-TOKEN=' . urlencode($token),
                    'Path=/',
                ];
                
                // Domain - null for local development to allow cross-origin
                if (!$isLocal && config('session.domain')) {
                    $cookieParts[] = 'Domain=' . config('session.domain');
                }
                
                // Secure - only set for HTTPS in production
                // Don't set Secure attribute for HTTP (local development)
                if (!$isLocal && config('session.secure')) {
                    $cookieParts[] = 'Secure';
                }
                
                // HttpOnly - MUST be false for XSRF-TOKEN to be accessible from JavaScript
                // This is the key requirement for Sanctum CSRF protection
                
                // SameSite - Use 'None' for local development (cross-origin), 'Lax' for production
                // Modern browsers require SameSite=None with Secure=true for cross-origin cookies
                // But in local development (HTTP), we use SameSite=None with Secure=false
                // Note: Chrome 80+ may reject SameSite=None without Secure, but it's the only way for HTTP
                // For same-origin (same domain, different ports), browsers may still accept it
                $sameSite = $isLocal ? 'None' : 'Lax';
                if ($sameSite === 'None') {
                    $cookieParts[] = 'SameSite=None';
                } else {
                    $cookieParts[] = 'SameSite=' . $sameSite;
                }
                
                // Build cookie string for logging
                $cookieString = implode('; ', $cookieParts);
                
                // Use Laravel's cookie helper - this is the most reliable method
                $cookie = cookie(
                    'XSRF-TOKEN',
                    $token,
                    0, // Session cookie (expires when browser closes)
                    '/',
                    null, // Domain (null = current domain, allows cross-origin)
                    $isLocal ? false : null, // Secure (false for HTTP in development, null uses config)
                    false, // HttpOnly (false to allow JavaScript access - REQUIRED for XSRF-TOKEN)
                    false, // Raw
                    $sameSite // SameSite ('None' for local development, 'Lax' for production)
                );
                
                // Set cookie on response using Laravel's method
                $response = $response->withCookie($cookie);
                
                // Log in development
                if ($isLocal && config('app.debug')) {
                    \Log::info('XSRF-TOKEN cookie set by middleware', [
                        'token' => substr($token, 0, 20) . '...',
                        'cookie_name' => 'XSRF-TOKEN',
                        'cookie_string' => $cookieString,
                        'http_only' => false,
                        'secure' => $isLocal ? false : null,
                        'same_site' => $isLocal ? null : 'Lax',
                        'path' => $request->path(),
                        'route' => $request->route()?->getName(),
                        'response_headers' => $response->headers->all(),
                    ]);
                }
            } else {
                // Log if token is not available
                if (config('app.debug')) {
                    \Log::warning('XSRF-TOKEN not available in middleware', [
                        'route' => $request->route()?->getName(),
                        'path' => $request->path(),
                        'has_session' => $request->hasSession(),
                    ]);
                }
            }
        }
        
        return $response;
    }
}
