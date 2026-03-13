<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->id_role !== 1) {
            return response()->json(['message' => 'Accès refusé. Admin uniquement.'], 403);
        }

        return $next($request);
    }
}