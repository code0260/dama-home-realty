<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimitDashboard
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = 'dashboard:' . $request->user()?->id ?? $request->ip();

        if (RateLimiter::tooManyAttempts($key, 60)) {
            return response()->json([
                'message' => 'Too many requests. Please try again later.',
            ], 429);
        }

        RateLimiter::hit($key, 60); // 60 requests per minute

        return $next($request);
    }
}

