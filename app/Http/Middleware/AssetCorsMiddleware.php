<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AssetCorsMiddleware
{
    /**
     * Handle an incoming request for build assets.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only add CORS headers for build assets
        if (str_starts_with($request->path(), 'build/')) {
            $response->headers->set('Access-Control-Allow-Origin', 'https://acms.egypt-soft.net');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin');
            $response->headers->set('Access-Control-Max-Age', '86400'); // 24 hours
            $response->headers->set('Cache-Control', 'public, max-age=31536000'); // 1 year for assets
        }

        return $response;
    }
}
