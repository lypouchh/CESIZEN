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
        // On vérifie que l'utilisateur est connecté ET qu'il a le rôle admin via la méthode dédiée.
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Accès refusé. Action réservée aux administrateurs.'], 403);
        }

        return $next($request);
    }
}