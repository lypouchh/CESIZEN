<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('auth-login', function (Request $request) {
            $key = strtolower((string) $request->input('email')) . '|' . $request->ip();

            return Limit::perMinute((int) env('RATE_LIMIT_LOGIN_PER_MINUTE', 5))
                ->by($key)
                ->response(function () {
                    return response()->json([
                        'message' => 'Trop de tentatives de connexion. Reessayez dans une minute.',
                    ], 429);
                });
        });

        RateLimiter::for('auth-register', function (Request $request) {
            return Limit::perMinute((int) env('RATE_LIMIT_REGISTER_PER_MINUTE', 3))
                ->by($request->ip());
        });

        RateLimiter::for('auth-password-reset', function (Request $request) {
            $key = strtolower((string) $request->input('email')) . '|' . $request->ip();

            return Limit::perMinute((int) env('RATE_LIMIT_PASSWORD_PER_MINUTE', 3))
                ->by($key);
        });
    }
}
