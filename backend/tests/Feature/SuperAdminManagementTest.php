<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SuperAdminManagementTest extends TestCase
{
    use RefreshDatabase;

    private function seedRoles(): void
    {
        Role::query()->create(['nom' => 'Admin']);
        Role::query()->create(['nom' => 'User']);
    }

    private function makeAdmin(array $overrides = []): User
    {
        return User::query()->create(array_merge([
            'firstname' => 'Admin',
            'lastname' => 'User',
            'email' => uniqid('admin_', true) . '@example.com',
            'passwordHash' => Hash::make('password123'),
            'id_role' => 1,
            'isActive' => true,
            'isSuperAdmin' => false,
        ], $overrides));
    }

    private function makeUser(array $overrides = []): User
    {
        return User::query()->create(array_merge([
            'firstname' => 'Simple',
            'lastname' => 'User',
            'email' => uniqid('user_', true) . '@example.com',
            'passwordHash' => Hash::make('password123'),
            'id_role' => 2,
            'isActive' => true,
            'isSuperAdmin' => false,
        ], $overrides));
    }

    public function test_super_admin_can_create_sub_admin(): void
    {
        $this->seedRoles();
        $super = $this->makeAdmin(['isSuperAdmin' => true]);

        Sanctum::actingAs($super);

        $response = $this->postJson('/api/admin/admins', [
            'firstname' => 'Sub',
            'lastname' => 'Admin',
            'email' => 'sub-admin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertCreated()->assertJsonPath('user.id_role', 1);
        $this->assertDatabaseHas('users', ['email' => 'sub-admin@example.com', 'id_role' => 1]);
    }

    public function test_admin_cannot_create_sub_admin(): void
    {
        $this->seedRoles();
        $admin = $this->makeAdmin();

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/admin/admins', [
            'firstname' => 'Blocked',
            'lastname' => 'Admin',
            'email' => 'blocked-admin@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertForbidden();
    }

    public function test_super_admin_list_includes_admins_and_users(): void
    {
        $this->seedRoles();
        $super = $this->makeAdmin(['isSuperAdmin' => true, 'email' => 'super@example.com']);
        $this->makeAdmin(['email' => 'other-admin@example.com']);
        $this->makeUser(['email' => 'standard@example.com']);

        Sanctum::actingAs($super);

        $response = $this->getJson('/api/admin/users');

        $response->assertOk();
        $this->assertTrue($response->json('currentAdmin.isSuperAdmin'));
        $this->assertGreaterThanOrEqual(3, count($response->json('users')));
    }

    public function test_admin_list_hides_admin_accounts(): void
    {
        $this->seedRoles();
        $admin = $this->makeAdmin(['email' => 'admin-main@example.com']);
        $this->makeAdmin(['email' => 'admin-hidden@example.com']);
        $this->makeUser(['email' => 'visible-user@example.com']);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/users');

        $response->assertOk();
        $this->assertFalse($response->json('currentAdmin.isSuperAdmin'));
        $emails = array_column($response->json('users'), 'email');
        $this->assertContains('visible-user@example.com', $emails);
        $this->assertNotContains('admin-hidden@example.com', $emails);
    }

    public function test_admin_cannot_toggle_other_admin(): void
    {
        $this->seedRoles();
        $admin = $this->makeAdmin();
        $otherAdmin = $this->makeAdmin();

        Sanctum::actingAs($admin);

        $response = $this->putJson('/api/admin/users/' . $otherAdmin->id . '/status');

        $response->assertForbidden();
    }

    public function test_super_admin_can_toggle_other_admin(): void
    {
        $this->seedRoles();
        $super = $this->makeAdmin(['isSuperAdmin' => true]);
        $otherAdmin = $this->makeAdmin(['isActive' => true]);

        Sanctum::actingAs($super);

        $response = $this->putJson('/api/admin/users/' . $otherAdmin->id . '/status');

        $response->assertOk()->assertJsonPath('isActive', false);
    }

    public function test_cannot_toggle_super_admin(): void
    {
        $this->seedRoles();
        $super = $this->makeAdmin(['isSuperAdmin' => true]);
        $otherAdmin = $this->makeAdmin(['isSuperAdmin' => true]);

        Sanctum::actingAs($super);

        $response = $this->putJson('/api/admin/users/' . $otherAdmin->id . '/status');

        $response->assertForbidden();
    }

    public function test_cannot_toggle_self(): void
    {
        $this->seedRoles();
        $admin = $this->makeAdmin();

        Sanctum::actingAs($admin);

        $response = $this->putJson('/api/admin/users/' . $admin->id . '/status');

        $response->assertForbidden();
    }

    public function test_admin_cannot_delete_other_admin(): void
    {
        $this->seedRoles();
        $admin = $this->makeAdmin();
        $otherAdmin = $this->makeAdmin();

        Sanctum::actingAs($admin);

        $response = $this->deleteJson('/api/admin/users/' . $otherAdmin->id);

        $response->assertForbidden();
    }

    public function test_super_admin_can_delete_sub_admin(): void
    {
        $this->seedRoles();
        $super = $this->makeAdmin(['isSuperAdmin' => true]);
        $otherAdmin = $this->makeAdmin();

        Sanctum::actingAs($super);

        $response = $this->deleteJson('/api/admin/users/' . $otherAdmin->id);

        $response->assertOk();
        $this->assertDatabaseMissing('users', ['id' => $otherAdmin->id]);
    }

    public function test_cannot_delete_super_admin(): void
    {
        $this->seedRoles();
        $super = $this->makeAdmin(['isSuperAdmin' => true]);
        $otherSuper = $this->makeAdmin(['isSuperAdmin' => true]);

        Sanctum::actingAs($super);

        $response = $this->deleteJson('/api/admin/users/' . $otherSuper->id);

        $response->assertForbidden();
    }

    public function test_cannot_delete_self_from_admin_route(): void
    {
        $this->seedRoles();
        $super = $this->makeAdmin(['isSuperAdmin' => true]);

        Sanctum::actingAs($super);

        $response = $this->deleteJson('/api/admin/users/' . $super->id);

        $response->assertForbidden();
    }
}
