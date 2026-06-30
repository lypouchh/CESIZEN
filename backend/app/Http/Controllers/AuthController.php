<?php

namespace App\Http\Controllers;

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Carbon;
use Throwable;

class AuthController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        $response = [
            'message' => 'Si cet email existe, un lien de réinitialisation a été envoyé.',
        ];

        if ($user) {
            $token = Str::random(60);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'email' => $request->email,
                    'token' => Hash::make($token),
                    'created_at' => now(),
                ]
            );

            // En local uniquement, on expose le lien pour faciliter les tests manuels.
            if (app()->environment('local')) {
                $response['debug_url'] = "http://localhost:5173/reset-password/$token?email=" . urlencode($user->email);
            }
        }

        return response()->json($response);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $resetRecord = DB::table('password_reset_tokens')->where('email', $request->email)->first();
        if (!$resetRecord) {
            return response()->json(['message' => 'Lien de réinitialisation invalide ou expiré.'], 400);
        }

        $createdAt = Carbon::parse($resetRecord->created_at);
        if ($createdAt->diffInMinutes(now()) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Lien de réinitialisation invalide ou expiré.'], 400);
        }

        if (!Hash::check($request->token, $resetRecord->token)) {
            return response()->json(['message' => 'Lien de réinitialisation invalide ou expiré.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $user->passwordHash = Hash::make($request->password);
        $user->save();

        // Force la reconnexion de toutes les sessions existantes.
        $this->revokeAllRefreshTokensForUser($user->id);

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        // On vérifie que l'ancien mot de passe est correct
        if (!Hash::check($request->current_password, $user->passwordHash)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 422);
        }

        $user->passwordHash = Hash::make($request->new_password);
        $user->save();
        $this->revokeAllRefreshTokensForUser($user->id);

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'passwordHash' => Hash::make($request->password),
            'id_role' => 2, // Rôle Utilisateur standard
            'isActive' => true,
            'isSuperAdmin' => false,
        ]);

        $tokenData = $this->issueTokenPair($user, $request);

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user' => $user,
            'token' => $tokenData['access_token'],
            'access_token' => $tokenData['access_token'],
            'token_type' => 'Bearer',
            'expires_in' => $tokenData['expires_in'],
        ], 201)->cookie($this->buildRefreshCookie($tokenData['refresh_token']));
    }

    public function registerAdmin(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'secret_code' => 'required'
        ]);

        if ($request->secret_code !== env('ADMIN_REGISTRATION_CODE')) {
            return response()->json(['message' => 'Code secret invalide.'], 403);
        }

        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'passwordHash' => Hash::make($request->password),
            'id_role' => 1, // Rôle Admin
            'isActive' => true,
            'isSuperAdmin' => false,
        ]);

        return response()->json(['message' => 'Compte administrateur créé avec succès.']);
    }

    public function createSubAdmin(Request $request)
    {
        $current = $request->user();

        if (!$current->isSuperAdmin()) {
            return response()->json(['message' => 'Action réservée au super admin.'], 403);
        }

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $admin = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'passwordHash' => Hash::make($request->password),
            'id_role' => 1,
            'isActive' => true,
            'isSuperAdmin' => false,
        ]);

        return response()->json([
            'message' => 'Admin subordonné créé avec succès.',
            'user' => $admin,
        ], 201);
    }

    public function listUsers(Request $request)
    {
        $current = $request->user();

        $query = User::with('role');

        if (!$current->isSuperAdmin()) {
            $query->where('id_role', 2);
        }

        $users = $query->orderBy('id')->get();

        return response()->json([
            'users' => $users,
            'currentAdmin' => [
                'id' => $current->id,
                'isSuperAdmin' => $current->isSuperAdmin(),
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'current_password' => 'required',
        ]);

        if (!Hash::check($request->current_password, $user->passwordHash)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 422);
        }

        $user->firstname = $request->firstname;
        $user->lastname = $request->lastname;
        $user->email = $request->email;
        $user->save();

        return response()->json($user);
    }

    public function destroyAccount(Request $request)
    {
        $user = $request->user();
        $this->revokeAllRefreshTokensForUser($user->id);
        $user->delete();

        return response()->json(['message' => 'Compte supprimé.']);
    }

    public function toggleUserStatus($id)
    {
        $current = request()->user();
        $user = User::findOrFail($id);

        if ($user->id === $current->id) {
            return response()->json(['message' => 'Impossible de modifier votre propre statut.'], 403);
        }

        if ($user->isSuperAdmin()) {
            return response()->json(['message' => 'Impossible de modifier le super admin.'], 403);
        }

        if (!$current->isSuperAdmin() && $user->id_role === 1) {
            return response()->json(['message' => 'Seul le super admin peut gérer les autres admins.'], 403);
        }

        $user->isActive = !$user->isActive;
        $user->save();

        return response()->json($user);
    }

    public function deleteUser(Request $request, $id)
    {
        $current = $request->user();
        $user = User::findOrFail($id);

        if ($user->id === $current->id) {
            return response()->json(['message' => 'Impossible de supprimer votre propre compte ici.'], 403);
        }

        if ($user->isSuperAdmin()) {
            return response()->json(['message' => 'Impossible de supprimer le super admin.'], 403);
        }

        if (!$current->isSuperAdmin() && $user->id_role === 1) {
            return response()->json(['message' => 'Seul le super admin peut supprimer les autres admins.'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    // Connexion
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->passwordHash)) {
            return response()->json([
                'message' => 'Les identifiants sont incorrects.'
            ], 401);
        }

        if (!$user->isActive) {
            return response()->json([
                'message' => 'Votre compte est désactivé. Contactez un administrateur.'
            ], 403);
        }

        $tokenData = $this->issueTokenPair($user, $request);

        return response()->json([
            'user' => $user,
            'token' => $tokenData['access_token'],
            'access_token' => $tokenData['access_token'],
            'token_type' => 'Bearer',
            'expires_in' => $tokenData['expires_in'],
        ])->cookie($this->buildRefreshCookie($tokenData['refresh_token']));
    }

    public function refresh(Request $request)
    {
        $refreshToken = $this->extractRefreshToken($request);
        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token manquant.'], 401);
        }

        $hashed = hash('sha256', $refreshToken);

        $storedToken = RefreshToken::where('token_hash', $hashed)
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->first();

        if (!$storedToken) {
            return response()->json(['message' => 'Refresh token invalide ou expire.'], 401);
        }

        $user = User::find($storedToken->user_id);
        if (!$user || !$user->isActive) {
            return response()->json(['message' => 'Utilisateur invalide ou desactive.'], 401);
        }

        $newTokenData = $this->issueTokenPair($user, $request);
        $storedToken->update([
            'revoked_at' => now(),
            'replaced_by_token_hash' => hash('sha256', $newTokenData['refresh_token']),
        ]);

        return response()->json([
            'access_token' => $newTokenData['access_token'],
            'token_type' => 'Bearer',
            'expires_in' => $newTokenData['expires_in'],
        ])->cookie($this->buildRefreshCookie($newTokenData['refresh_token']));
    }

    // Déconnexion
    public function logout(Request $request)
    {
        $refreshToken = $this->extractRefreshToken($request);

        if ($refreshToken) {
            $hashed = hash('sha256', $refreshToken);
            RefreshToken::where('user_id', $request->user()->id)
                ->where('token_hash', $hashed)
                ->whereNull('revoked_at')
                ->update(['revoked_at' => now()]);
        }

        try {
            if (auth('api')->getToken()) {
                auth('api')->invalidate(true);
            }
        } catch (Throwable) {
            // Token deja invalide ou absent: logout idempotent.
        }

        return response()->json(['message' => 'Déconnexion réussie'])
            ->cookie($this->clearRefreshCookie());
    }

    // Récupérer l'utilisateur connecté
    public function user(Request $request)
    {
        return $request->user()->load('role');
    }

    private function issueTokenPair(User $user, Request $request): array
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

    private function revokeAllRefreshTokensForUser(int $userId): void
    {
        RefreshToken::where('user_id', $userId)
            ->whereNull('revoked_at')
            ->update(['revoked_at' => now()]);
    }

    private function extractRefreshToken(Request $request): ?string
    {
        $fromBody = $request->input('refresh_token');
        if (is_string($fromBody) && $fromBody !== '') {
            return $fromBody;
        }

        $cookieName = (string) env('JWT_REFRESH_COOKIE_NAME', 'refresh_token');
        $fromCookie = $request->cookie($cookieName);

        return is_string($fromCookie) && $fromCookie !== '' ? $fromCookie : null;
    }

    private function buildRefreshCookie(string $refreshToken): \Symfony\Component\HttpFoundation\Cookie
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

    private function clearRefreshCookie(): \Symfony\Component\HttpFoundation\Cookie
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
}
