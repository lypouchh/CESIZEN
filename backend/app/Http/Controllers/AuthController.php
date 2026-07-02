<?php

namespace App\Http\Controllers;

use App\Models\RefreshToken;
use App\Models\User;
use App\Services\AuthTokenService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Throwable;

class AuthController extends Controller
{
    public function __construct(private readonly AuthTokenService $authTokenService)
    {
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        $response = [
            'message' => 'Si cet email existe, un lien de réinitialisation a été envoyé.',
        ];

        if ($user) {
            $token = $this->authTokenService->generatePasswordResetToken();

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'email' => $request->email,
                    'token' => Hash::make($token),
                    'created_at' => now(),
                ]
            );

            if (app()->environment('local')) {
                $response['debug_url'] = 'http://localhost:5173/reset-password/' . $token . '?email=' . urlencode($user->email);
            }

            $this->logSecurityEvent('password_reset_requested', $request, [
                'user_id' => $user->id,
            ]);
        }

        return response()->json($response);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', ...$this->passwordRules()],
        ]);

        $resetRecord = DB::table('password_reset_tokens')->where('email', $request->email)->first();
        if (!$resetRecord) {
            $this->logSecurityEvent('password_reset_failed', $request, [
                'reason' => 'missing_reset_record',
            ]);
            return response()->json(['message' => 'Lien de réinitialisation invalide ou expiré.'], 400);
        }

        $createdAt = Carbon::parse($resetRecord->created_at);
        if ($createdAt->diffInMinutes(now()) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            $this->logSecurityEvent('password_reset_failed', $request, [
                'reason' => 'expired_token',
            ]);
            return response()->json(['message' => 'Lien de réinitialisation invalide ou expiré.'], 400);
        }

        if (!Hash::check($request->token, $resetRecord->token)) {
            $this->logSecurityEvent('password_reset_failed', $request, [
                'reason' => 'invalid_token',
            ]);
            return response()->json(['message' => 'Lien de réinitialisation invalide ou expiré.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            $this->logSecurityEvent('password_reset_failed', $request, [
                'reason' => 'missing_user',
            ]);
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }

        $user->passwordHash = Hash::make($request->password);
        $user->save();

        $this->authTokenService->revokeAllRefreshTokensForUser($user->id);
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        $this->logSecurityEvent('password_reset_success', $request, [
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => ['required', 'confirmed', ...$this->passwordRules()],
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->passwordHash)) {
            $this->logSecurityEvent('password_change_failed', $request, [
                'user_id' => $user->id,
                'reason' => 'invalid_current_password',
            ]);
            return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 422);
        }

        $user->passwordHash = Hash::make($request->new_password);
        $user->save();
        $this->authTokenService->revokeAllRefreshTokensForUser($user->id);

        $this->logSecurityEvent('password_change_success', $request, [
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', ...$this->passwordRules()],
        ]);

        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'passwordHash' => Hash::make($request->password),
            'id_role' => 2,
            'isActive' => true,
            'isSuperAdmin' => false,
        ]);

        $tokenData = $this->authTokenService->issueTokenPair($user, $request);

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user' => $user,
            'token' => $tokenData['access_token'],
            'access_token' => $tokenData['access_token'],
            'token_type' => 'Bearer',
            'expires_in' => $tokenData['expires_in'],
        ], 201)->cookie($this->authTokenService->buildRefreshCookie($tokenData['refresh_token']));
    }

    public function registerAdmin(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', ...$this->passwordRules()],
            'secret_code' => 'required',
        ]);

        if ($request->secret_code !== env('ADMIN_REGISTRATION_CODE')) {
            $this->logSecurityEvent('admin_registration_failed', $request, [
                'reason' => 'invalid_secret_code',
            ]);
            return response()->json(['message' => 'Code secret invalide.'], 403);
        }

        User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'passwordHash' => Hash::make($request->password),
            'id_role' => 1,
            'isActive' => true,
            'isSuperAdmin' => false,
        ]);

        return response()->json(['message' => 'Compte administrateur créé avec succès.']);
    }

    public function createSubAdmin(Request $request)
    {
        $current = $request->user();

        if (!$current->isSuperAdmin()) {
            $this->logSecurityEvent('admin_action_denied', $request, [
                'action' => 'create_sub_admin',
                'actor_user_id' => $current?->id,
            ]);
            return response()->json(['message' => 'Action réservée au super admin.'], 403);
        }

        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', ...$this->passwordRules()],
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

        $this->logSecurityEvent('admin_action_success', $request, [
            'action' => 'create_sub_admin',
            'actor_user_id' => $current->id,
            'target_user_id' => $admin->id,
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
        $this->authTokenService->revokeAllRefreshTokensForUser($user->id);
        $user->delete();

        return response()->json(['message' => 'Compte supprimé.']);
    }

    public function toggleUserStatus($id)
    {
        $current = request()->user();
        $user = User::findOrFail($id);

        if ($user->id === $current->id) {
            $this->logSecurityEvent('admin_action_denied', request(), [
                'action' => 'toggle_user_status',
                'reason' => 'self_target',
                'actor_user_id' => $current->id,
                'target_user_id' => $user->id,
            ]);
            return response()->json(['message' => 'Impossible de modifier votre propre statut.'], 403);
        }

        if ($user->isSuperAdmin()) {
            $this->logSecurityEvent('admin_action_denied', request(), [
                'action' => 'toggle_user_status',
                'reason' => 'super_admin_target',
                'actor_user_id' => $current->id,
                'target_user_id' => $user->id,
            ]);
            return response()->json(['message' => 'Impossible de modifier le super admin.'], 403);
        }

        if (!$current->isSuperAdmin() && $user->id_role === 1) {
            $this->logSecurityEvent('admin_action_denied', request(), [
                'action' => 'toggle_user_status',
                'reason' => 'insufficient_role',
                'actor_user_id' => $current->id,
                'target_user_id' => $user->id,
            ]);
            return response()->json(['message' => 'Seul le super admin peut gérer les autres admins.'], 403);
        }

        $user->isActive = !$user->isActive;
        $user->save();

        $this->logSecurityEvent('admin_action_success', request(), [
            'action' => 'toggle_user_status',
            'actor_user_id' => $current->id,
            'target_user_id' => $user->id,
            'is_active' => $user->isActive,
        ]);

        return response()->json($user);
    }

    public function deleteUser(Request $request, $id)
    {
        $current = $request->user();
        $user = User::findOrFail($id);

        if ($user->id === $current->id) {
            $this->logSecurityEvent('admin_action_denied', $request, [
                'action' => 'delete_user',
                'reason' => 'self_target',
                'actor_user_id' => $current->id,
                'target_user_id' => $user->id,
            ]);
            return response()->json(['message' => 'Impossible de supprimer votre propre compte ici.'], 403);
        }

        if ($user->isSuperAdmin()) {
            $this->logSecurityEvent('admin_action_denied', $request, [
                'action' => 'delete_user',
                'reason' => 'super_admin_target',
                'actor_user_id' => $current->id,
                'target_user_id' => $user->id,
            ]);
            return response()->json(['message' => 'Impossible de supprimer le super admin.'], 403);
        }

        if (!$current->isSuperAdmin() && $user->id_role === 1) {
            $this->logSecurityEvent('admin_action_denied', $request, [
                'action' => 'delete_user',
                'reason' => 'insufficient_role',
                'actor_user_id' => $current->id,
                'target_user_id' => $user->id,
            ]);
            return response()->json(['message' => 'Seul le super admin peut supprimer les autres admins.'], 403);
        }

        $user->delete();

        $this->logSecurityEvent('admin_action_success', $request, [
            'action' => 'delete_user',
            'actor_user_id' => $current->id,
            'target_user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->passwordHash)) {
            $this->logSecurityEvent('login_failed', $request, [
                'reason' => 'invalid_credentials',
            ]);
            return response()->json([
                'message' => 'Les identifiants sont incorrects.',
            ], 401);
        }

        if (!$user->isActive) {
            $this->logSecurityEvent('login_failed', $request, [
                'reason' => 'inactive_account',
                'user_id' => $user->id,
            ]);
            return response()->json([
                'message' => 'Votre compte est désactivé. Contactez un administrateur.',
            ], 403);
        }

        $tokenData = $this->authTokenService->issueTokenPair($user, $request);

        $this->logSecurityEvent('login_success', $request, [
            'user_id' => $user->id,
        ]);

        return response()->json([
            'user' => $user,
            'token' => $tokenData['access_token'],
            'access_token' => $tokenData['access_token'],
            'token_type' => 'Bearer',
            'expires_in' => $tokenData['expires_in'],
        ])->cookie($this->authTokenService->buildRefreshCookie($tokenData['refresh_token']));
    }

    public function refresh(Request $request)
    {
        $refreshToken = $this->authTokenService->extractRefreshToken($request);
        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token manquant.'], 401);
        }

        $hashed = hash('sha256', $refreshToken);

        $storedToken = RefreshToken::where('token_hash', $hashed)
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->first();

        if (!$storedToken) {
            $this->logSecurityEvent('refresh_failed', $request, [
                'reason' => 'invalid_or_expired_refresh_token',
            ]);
            return response()->json(['message' => 'Refresh token invalide ou expire.'], 401);
        }

        $user = User::find($storedToken->user_id);
        if (!$user || !$user->isActive) {
            $this->logSecurityEvent('refresh_failed', $request, [
                'reason' => 'inactive_or_missing_user',
                'user_id' => $storedToken->user_id,
            ]);
            return response()->json(['message' => 'Utilisateur invalide ou desactive.'], 401);
        }

        $newTokenData = $this->authTokenService->issueTokenPair($user, $request);
        $storedToken->update([
            'revoked_at' => now(),
            'replaced_by_token_hash' => hash('sha256', $newTokenData['refresh_token']),
        ]);

        $this->logSecurityEvent('refresh_success', $request, [
            'user_id' => $user->id,
        ]);

        return response()->json([
            'access_token' => $newTokenData['access_token'],
            'token_type' => 'Bearer',
            'expires_in' => $newTokenData['expires_in'],
        ])->cookie($this->authTokenService->buildRefreshCookie($newTokenData['refresh_token']));
    }

    public function logout(Request $request)
    {
        $refreshToken = $this->authTokenService->extractRefreshToken($request);

        if ($refreshToken) {
            $hashed = hash('sha256', $refreshToken);
            RefreshToken::where('user_id', $request->user()->id)
                ->where('token_hash', $hashed)
                ->whereNull('revoked_at')
                ->update(['revoked_at' => now()]);
        }

        $this->logSecurityEvent('logout', $request, [
            'user_id' => $request->user()?->id,
        ]);

        try {
            if (auth('api')->getToken()) {
                auth('api')->invalidate(true);
            }
        } catch (Throwable) {
            // Token deja invalide ou absent: logout idempotent.
        }

        return response()->json(['message' => 'Déconnexion réussie'])
            ->cookie($this->authTokenService->clearRefreshCookie());
    }

    public function user(Request $request)
    {
        return $request->user()->load('role');
    }

    /**
     * @return array<int, \Illuminate\Validation\Rules\Password>
     */
    private function passwordRules(): array
    {
        $rule = Password::min(app()->environment('production') ? 12 : 8)
            ->letters()
            ->numbers();

        if (app()->environment('production')) {
            $rule = $rule->mixedCase()->symbols();
        }

        return [$rule];
    }

    private function logSecurityEvent(string $event, Request $request, array $context = []): void
    {
        Log::channel('security')->info($event, array_merge($context, [
            'ip' => $request->ip(),
            'email' => strtolower((string) $request->input('email', '')),
            'path' => $request->path(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
        ]));
    }
}
