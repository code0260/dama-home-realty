<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CompressionMiddleware
{
    /**
     * Handle an incoming request and compress the response.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only compress if client accepts compression and response is compressible
        if (!$this->shouldCompress($request, $response)) {
            return $response;
        }

        // Get the content
        $content = $response->getContent();

        // Determine compression method (prefer gzip, fallback to deflate)
        $acceptEncoding = $request->header('Accept-Encoding', '');
        $compressionMethod = null;

        if (str_contains($acceptEncoding, 'gzip') && function_exists('gzencode')) {
            $compressionMethod = 'gzip';
            $compressed = gzencode($content, 6); // Compression level 6 (balanced)
        } elseif (str_contains($acceptEncoding, 'deflate') && function_exists('gzdeflate')) {
            $compressionMethod = 'deflate';
            $compressed = gzdeflate($content, 6);
        }

        // Only compress if compression was successful and reduced size
        if ($compressionMethod && $compressed !== false && strlen($compressed) < strlen($content)) {
            $response->setContent($compressed);
            $response->headers->set('Content-Encoding', $compressionMethod);
            $response->headers->set('Vary', 'Accept-Encoding');
            $response->headers->remove('Content-Length'); // Let server calculate
        }

        return $response;
    }

    /**
     * Determine if the response should be compressed.
     */
    private function shouldCompress(Request $request, Response $response): bool
    {
        // Don't compress if client doesn't accept compression
        $acceptEncoding = $request->header('Accept-Encoding', '');
        if (empty($acceptEncoding) || (!str_contains($acceptEncoding, 'gzip') && !str_contains($acceptEncoding, 'deflate'))) {
            return false;
        }

        // Don't compress if response is already compressed
        if ($response->headers->has('Content-Encoding')) {
            return false;
        }

        // Only compress text-based content types
        $contentType = $response->headers->get('Content-Type', '');
        $compressibleTypes = [
            'application/json',
            'application/javascript',
            'text/html',
            'text/css',
            'text/xml',
            'text/plain',
            'application/xml',
        ];

        $shouldCompress = false;
        foreach ($compressibleTypes as $type) {
            if (str_contains($contentType, $type)) {
                $shouldCompress = true;
                break;
            }
        }

        // Don't compress very small responses (overhead not worth it)
        if ($shouldCompress && strlen($response->getContent()) < 1024) {
            return false;
        }

        return $shouldCompress;
    }
}
