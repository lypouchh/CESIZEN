<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * AuthService - Singleton Pattern
 * 
 * Gère toute la logique d'authentification centralisée.
 * Implémente le pattern Singleton pour garantir une seule instance
 * de gestion d'authentification dans toute l'application.
 */
class AuthService
{
    private static ?self $instance = null;

    /**
     * Constructeur privé - empêche l'instanciation directe
     */
    private function __construct() {}

    /**
     * Récupère l'instance unique (Singleton)
     */
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Authentifie un utilisateur et retourne un token Sanctum
     */
    public function authenticate(string $email, string $password): ?array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->passwordHash)) {
            return null;
        }

        if (!$user->isActive) {
            return null;
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Enregistre un nouvel utilisateur
     */
    public function register(array $data): User
    {
        return User::create([
            'firstname' => $data['firstname'],
            'lastname' => $data['lastname'],
            'email' => $data['email'],
            'passwordHash' => Hash::make($data['password']),
            'id_role' => 2, // Rôle Utilisateur standard
            'isActive' => true,
            'isSuperAdmin' => false,
        ]);
    }

    /**
     * Invalide tous les tokens d'un utilisateur (logout)
     */
    public function logout(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * Change le mot de passe d'un utilisateur
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->passwordHash)) {
            return false;
        }

        $user->update(['passwordHash' => Hash::make($newPassword)]);
        return true;
    }

    /**
     * Réinitialise le mot de passe via token
     */
    public function resetPassword(User $user, string $newPassword): void
    {
        $user->update(['passwordHash' => Hash::make($newPassword)]);
        $user->tokens()->delete(); // Force logout de toutes les sessions
    }

    /**
     * Vérifie que l'utilisateur est super admin
     */
    public function isSuperAdmin(User $user): bool
    {
        return $user->isSuperAdmin === true && $user->isActive === true;
    }

    /**
     * Vérifie que l'utilisateur est admin
     */
    public function isAdmin(User $user): bool
    {
        return $user->id_role === 1 && $user->isActive === true;
    }
}
