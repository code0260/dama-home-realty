<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Symfony\Component\HttpFoundation\Response;

class RateLimitExceeded extends ThrottleRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next, $maxAttempts = 60, $decayMinutes = 1, $prefix = '')
    {
        try {
            return parent::handle($request, $next, $maxAttempts, $decayMinutes, $prefix);
        } catch (\Illuminate\Http\Exceptions\ThrottleRequestsException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Too many requests. Please try again later.',
                'retry_after' => $e->getHeaders()['Retry-After'] ?? 60,
            ], 429);
        }
    }
}

