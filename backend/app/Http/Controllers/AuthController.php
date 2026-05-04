<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Carbon;

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
        $user->tokens()->delete();

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

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user' => $user,
            'token' => $token
        ], 201);
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
        ]);

        $user->firstname = $request->firstname;
        $user->lastname = $request->lastname;
        $user->email = $request->email;
        $user->save();

        return response()->json($user);
    }

    public function destroyAccount(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
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

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    // Déconnexion
    public function logout(Request $request)
    {
        // Supprime le token actuel
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    // Récupérer l'utilisateur connecté
    public function user(Request $request)
    {
        return $request->user()->load('role');
    }
}