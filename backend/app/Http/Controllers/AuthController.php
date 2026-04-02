<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé.'], 404);
        }
        $token = Str::random(60);
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            ['email' => $request->email, 'token' => Hash::make($token), 'created_at' => now()]
        );
        return response()->json([
            'message' => 'Lien de réinitialisation généré.',
            'debug_url' => "http://localhost:5173/reset-password/$token?email=" . urlencode($user->email)
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $passwordReset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$passwordReset || !Hash::check($request->token, $passwordReset->token)) {
            return response()->json(['message' => 'Le jeton de réinitialisation est invalide ou a expiré.'], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['message' => 'Erreur.'], 404);
        $user->password = Hash::make($request->password);
        $user->save();
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        return response()->json(['message' => 'Votre mot de passe a été mis à jour avec succès.']);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);
        $user = $request->user();
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect.'], 422);
        }
        $user->password = Hash::make($request->new_password);
        $user->save();
        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $userRole = Role::where('nom', 'user')->firstOrFail();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'id_role' => $userRole->id,
        ]);
        return response()->json(['message' => 'Compte créé avec succès.'], 201);
    }

    public function registerAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'secret_code' => 'required'
        ]);
        if ($request->secret_code !== env('ADMIN_REGISTRATION_CODE')) {
            return response()->json(['message' => 'Code secret invalide.'], 403);
        }

        $adminRole = Role::where('nom', 'admin')->firstOrFail();

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'id_role' => $adminRole->id,
        ]);
        return response()->json(['message' => 'Compte administrateur créé avec succès.']);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);
        $user->update($validatedData);
        return response()->json($user);
    }

    public function destroyAccount(Request $request)
    {
        $user = $request->user();
        $user->tokens()->delete();
        $user->delete();
        return response()->json(['message' => 'Votre compte a été supprimé avec succès.']);
    }

    public function listUsers()
    {
        return response()->json(User::with('role')->get());
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->isAdmin()) {
            return response()->json(['message' => 'Impossible de supprimer un administrateur.'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    public function toggleUserStatus(Request $request, $id)
    {
        // On s'assure que l'utilisateur à modifier n'est pas l'utilisateur courant
        if ($request->user()->id == $id) {
            return response()->json(['message' => 'Vous ne pouvez pas modifier votre propre statut.'], 403);
        }

        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json(['message' => 'Impossible de modifier le statut d’un administrateur.'], 403);
        }
        
        $user->is_active = !$user->is_active;
        $user->save();

        return response()->json($user->load('role'));
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Les identifiants sont incorrects.'], 401);
        }

        // Vérifier si le compte est actif
        if (!$user->is_active) {
            return response()->json(['message' => 'Votre compte est désactivé. Veuillez contacter un administrateur.'], 403);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'user' => $user->load('role'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function user(Request $request)
    {
        return $request->user()->load('role');
    }
}