<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthValidationAndFlowsTest extends TestCase
{
    use RefreshDatabase;

    private function seedRoles(): void
    {
        Role::query()->create(['nom' => 'Admin']);
        Role::query()->create(['nom' => 'User']);
    }

    private function makeUser(array $overrides = []): User
    {
        return User::query()->create(array_merge([
            'firstname' => 'Test',
            'lastname' => 'User',
            'email' => 'user@example.com',
            'passwordHash' => Hash::make('password123'),
            'id_role' => 2,
            'isActive' => true,
            'isSuperAdmin' => false,
        ], $overrides));
    }

    public function test_register_requires_firstname(): void
    {
        $this->seedRoles();

        $response = $this->postJson('/api/register', [
            'lastname' => 'Dupont',
            'email' => 'jean@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['firstname']);
    }

    public function test_register_requires_password_confirmation_match(): void
    {
        $this->seedRoles();

        $response = $this->postJson('/api/register', [
            'firstname' => 'Jean',
            'lastname' => 'Dupont',
            'email' => 'jean@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different123',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['password']);
    }

    public function test_register_rejects_duplicate_email(): void
    {
        $this->seedRoles();
        $this->makeUser(['email' => 'dup@example.com']);

        $response = $this->postJson('/api/register', [
            'firstname' => 'Other',
            'lastname' => 'User',
            'email' => 'dup@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['email']);
    }

    public function test_login_returns_401_for_wrong_password(): void
    {
        $this->seedRoles();
        $this->makeUser(['email' => 'login@example.com']);

        $response = $this->postJson('/api/login', [
            'email' => 'login@example.com',
            'password' => 'bad-password',
        ]);

        $response->assertStatus(401)->assertJsonFragment(['message' => 'Les identifiants sont incorrects.']);
    }

    public function test_login_returns_token_for_valid_credentials(): void
    {
        $this->seedRoles();
        $this->makeUser(['email' => 'loginok@example.com']);

        $response = $this->postJson('/api/login', [
            'email' => 'loginok@example.com',
            'password' => 'password123',
        ]);

        $response
            ->assertOk()
            ->assertJsonStructure(['user', 'token']);
    }

    public function test_login_returns_403_for_inactive_user(): void
    {
        $this->seedRoles();
        $this->makeUser([
            'email' => 'inactive@example.com',
            'isActive' => false,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'inactive@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)->assertJsonFragment([
            'message' => 'Votre compte est désactivé. Contactez un administrateur.',
        ]);
    }

    public function test_forgot_password_does_not_disclose_unknown_email(): void
    {
        $response = $this->postJson('/api/forgot-password', [
            'email' => 'unknown@example.com',
        ]);

        $response->assertOk()->assertJsonFragment([
            'message' => 'Si cet email existe, un lien de réinitialisation a été envoyé.',
        ]);
    }

    public function test_reset_password_rejects_when_no_reset_request_exists(): void
    {
        $this->seedRoles();
        $user = $this->makeUser(['email' => 'reset@example.com']);

        $response = $this->postJson('/api/reset-password', [
            'email' => $user->email,
            'token' => 'invalid-token',
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(400)->assertJsonFragment([
            'message' => 'Lien de réinitialisation invalide ou expiré.',
        ]);
    }

    public function test_change_password_requires_authentication(): void
    {
        $response = $this->postJson('/api/change-password', [
            'current_password' => 'password123',
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123',
        ]);

        $response->assertUnauthorized();
    }

    public function test_change_password_rejects_wrong_current_password(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/change-password', [
            'current_password' => 'wrong-current',
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123',
        ]);

        $response->assertStatus(422)->assertJsonFragment(['message' => 'Le mot de passe actuel est incorrect.']);
    }

    public function test_change_password_updates_hash_on_success(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/change-password', [
            'current_password' => 'password123',
            'new_password' => 'newpassword123',
            'new_password_confirmation' => 'newpassword123',
        ]);

        $response->assertOk();

        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', (string) $user->getAttribute('passwordHash')));
    }

    public function test_update_profile_rejects_duplicate_email(): void
    {
        $this->seedRoles();
        $userA = $this->makeUser(['email' => 'a@example.com']);
        $this->makeUser(['email' => 'b@example.com']);

        Sanctum::actingAs($userA);

        $response = $this->putJson('/api/user', [
            'firstname' => 'A',
            'lastname' => 'User',
            'email' => 'b@example.com',
            'current_password' => 'password123',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['email']);
    }

    public function test_update_profile_requires_current_password(): void
    {
        $this->seedRoles();
        $user = $this->makeUser(['email' => 'profile@example.com']);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/user', [
            'firstname' => 'Profile',
            'lastname' => 'User',
            'email' => 'profile@example.com',
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['current_password']);
    }

    public function test_update_profile_rejects_wrong_current_password(): void
    {
        $this->seedRoles();
        $user = $this->makeUser(['email' => 'profile@example.com']);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/user', [
            'firstname' => 'Updated',
            'lastname' => 'User',
            'email' => 'profile@example.com',
            'current_password' => 'wrong-password',
        ]);

        $response->assertStatus(422)->assertJsonFragment(['message' => 'Le mot de passe actuel est incorrect.']);
    }

    public function test_update_profile_accepts_valid_current_password(): void
    {
        $this->seedRoles();
        $user = $this->makeUser(['email' => 'profile@example.com']);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/user', [
            'firstname' => 'Updated',
            'lastname' => 'Name',
            'email' => 'updated@example.com',
            'current_password' => 'password123',
        ]);

        $response->assertOk()->assertJsonPath('email', 'updated@example.com');

        $user->refresh();
        $this->assertSame('Updated', $user->firstname);
        $this->assertSame('updated@example.com', $user->email);
    }

    public function test_user_endpoint_returns_role_relation(): void
    {
        $this->seedRoles();
        $admin = $this->makeUser([
            'id_role' => 1,
            'email' => 'admin-role@example.com',
            'isSuperAdmin' => true,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/user');

        $response
            ->assertOk()
            ->assertJsonPath('role.nom', 'Admin');
    }
}
