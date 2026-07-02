<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigins = $this->resolveAllowedOrigins();

        $origin = $request->headers->get('origin');
        $originAllowed = $origin && in_array($origin, $allowedOrigins, true);

        if ($request->isMethod('options')) {
            $preflight = response('', 200)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
                ->header('Access-Control-Max-Age', '86400');

            if ($originAllowed) {
                $preflight->header('Access-Control-Allow-Origin', $origin)
                    ->header('Access-Control-Allow-Credentials', 'true');
            }

            $preflight->header('Vary', 'Origin');

            return $preflight;
        }

        $response = $next($request);

        if ($originAllowed) {
            $response->header('Access-Control-Allow-Origin', $origin)
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Vary', 'Origin');
        } else {
            $response->header('Vary', 'Origin');
        }

        return $response;
    }

    /**
     * @return array<int, string>
     */
    private function resolveAllowedOrigins(): array
    {
        $originsFromEnv = array_filter(array_map(
            static fn (string $origin) => trim($origin),
            explode(',', (string) env('CORS_ALLOWED_ORIGINS', ''))
        ));

        if (!empty($originsFromEnv)) {
            return array_values(array_unique($originsFromEnv));
        }

        if (!app()->environment('production')) {
            return [
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'http://localhost:3000',
                'http://127.0.0.1:3000',
            ];
        }

        return [];
    }
}
