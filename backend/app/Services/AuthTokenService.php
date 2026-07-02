<?php

namespace App\Services;

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Cookie;

class AuthTokenService
{
    /**
     * @return array{access_token: string, refresh_token: string, expires_in: int}
     */
    public function issueTokenPair(User $user, Request $request): array
    {
        $ttlMinutes = (int) config('jwt.ttl', 15);
        $accessToken = auth('api')->setTTL($ttlMinutes)->fromUser($user);

        $plainRefreshToken = Str::random(96);
        $refreshTtlMinutes = (int) env('JWT_REFRESH_TOKEN_TTL', 10080);

        RefreshToken::create([
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $plainRefreshToken),
            'expires_at' => now()->addMinutes($refreshTtlMinutes),
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 255, ''),
        ]);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $plainRefreshToken,
            'expires_in' => $ttlMinutes * 60,
        ];
    }

    public function revokeAllRefreshTokensForUser(int $userId): void
    {
        RefreshToken::where('user_id', $userId)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);
    }

    public function extractRefreshToken(Request $request): ?string
    {
        $fromBody = $request->input('refresh_token');
        if (is_string($fromBody) && $fromBody !== '') {
            return $fromBody;
        }

        $cookieName = (string) env('JWT_REFRESH_COOKIE_NAME', 'refresh_token');
        $fromCookie = $request->cookie($cookieName);

        return is_string($fromCookie) && $fromCookie !== '' ? $fromCookie : null;
    }

    public function buildRefreshCookie(string $refreshToken): Cookie
    {
        $cookieName = (string) env('JWT_REFRESH_COOKIE_NAME', 'refresh_token');
        $cookieMinutes = (int) env('JWT_REFRESH_TOKEN_TTL', 10080);
        $secure = app()->environment('production');
        $sameSite = $secure ? 'none' : 'lax';

        return cookie(
            $cookieName,
            $refreshToken,
            $cookieMinutes,
            '/',
            null,
            $secure,
            true,
            false,
            $sameSite,
        );
    }

    public function clearRefreshCookie(): Cookie
    {
        $cookieName = (string) env('JWT_REFRESH_COOKIE_NAME', 'refresh_token');
        $secure = app()->environment('production');
        $sameSite = $secure ? 'none' : 'lax';

        return cookie(
            $cookieName,
            '',
            -1,
            '/',
            null,
            $secure,
            true,
            false,
            $sameSite,
        );
    }

    public function generatePasswordResetToken(): string
    {
        return Str::random(60);
    }
}
