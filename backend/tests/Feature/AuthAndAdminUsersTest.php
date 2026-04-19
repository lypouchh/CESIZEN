<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthAndAdminUsersTest extends TestCase
{
    use RefreshDatabase;

    private function seedRoles(): void
    {
        Role::query()->create(['nom' => 'Admin']);
        Role::query()->create(['nom' => 'User']);
    }

    public function test_register_returns_user_and_token(): void
    {
        $this->seedRoles();

        $response = $this->postJson('/api/register', [
            'firstname' => 'Jean',
            'lastname' => 'Dupont',
            'email' => 'jean.dupont@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response
            ->assertCreated()
            ->assertJsonStructure([
                'message',
                'user' => ['id', 'firstname', 'lastname', 'email', 'id_role', 'isActive'],
                'token',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'jean.dupont@example.com',
            'id_role' => 2,
            'isActive' => 1,
        ]);
    }

    public function test_admin_can_list_users(): void
    {
        $this->seedRoles();

        $admin = User::query()->create([
            'firstname' => 'Admin',
            'lastname' => 'Test',
            'email' => 'admin@example.com',
            'passwordHash' => bcrypt('password123'),
            'id_role' => 1,
            'isActive' => true,
        ]);

        User::query()->create([
            'firstname' => 'Alice',
            'lastname' => 'User',
            'email' => 'alice@example.com',
            'passwordHash' => bcrypt('password123'),
            'id_role' => 2,
            'isActive' => true,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/users');

        $response
            ->assertOk()
            ->assertJsonPath('currentAdmin.isSuperAdmin', false)
            ->assertJsonFragment(['email' => 'alice@example.com']);

        $this->assertCount(1, $response->json('users'));
    }

    public function test_non_admin_cannot_list_users(): void
    {
        $this->seedRoles();

        $user = User::query()->create([
            'firstname' => 'Simple',
            'lastname' => 'User',
            'email' => 'user@example.com',
            'passwordHash' => bcrypt('password123'),
            'id_role' => 2,
            'isActive' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/users');

        $response->assertForbidden();
    }

    public function test_authenticated_user_can_update_profile(): void
    {
        $this->seedRoles();

        $user = User::query()->create([
            'firstname' => 'Old',
            'lastname' => 'Name',
            'email' => 'old@example.com',
            'passwordHash' => bcrypt('password123'),
            'id_role' => 2,
            'isActive' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->putJson('/api/user', [
            'firstname' => 'New',
            'lastname' => 'Name',
            'email' => 'new@example.com',
        ]);

        $response
            ->assertOk()
            ->assertJsonFragment([
                'firstname' => 'New',
                'email' => 'new@example.com',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'firstname' => 'New',
            'email' => 'new@example.com',
        ]);
    }

    public function test_authenticated_user_can_delete_own_account(): void
    {
        $this->seedRoles();

        $user = User::query()->create([
            'firstname' => 'Delete',
            'lastname' => 'Me',
            'email' => 'deleteme@example.com',
            'passwordHash' => bcrypt('password123'),
            'id_role' => 2,
            'isActive' => true,
        ]);

        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/user');

        $response->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
