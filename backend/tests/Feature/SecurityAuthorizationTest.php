<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SecurityAuthorizationTest extends TestCase
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
            'lastname' => 'Security',
            'email' => uniqid('admin_sec_', true) . '@example.com',
            'passwordHash' => Hash::make('password123'),
            'id_role' => 1,
            'isActive' => true,
            'isSuperAdmin' => false,
        ], $overrides));
    }

    private function makeUser(array $overrides = []): User
    {
        return User::query()->create(array_merge([
            'firstname' => 'User',
            'lastname' => 'Security',
            'email' => uniqid('user_sec_', true) . '@example.com',
            'passwordHash' => Hash::make('password123'),
            'id_role' => 2,
            'isActive' => true,
            'isSuperAdmin' => false,
        ], $overrides));
    }

    public function test_guest_cannot_access_current_user_endpoint(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertUnauthorized();
    }

    public function test_guest_cannot_logout(): void
    {
        $response = $this->postJson('/api/logout');

        $response->assertUnauthorized();
    }

    public function test_non_admin_cannot_create_article(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/articles', [
            'title' => 'Article bloque',
            'content' => 'Contenu test',
            'category' => 'Stress',
        ]);

        $response->assertForbidden();
    }

    public function test_guest_cannot_create_article(): void
    {
        $response = $this->postJson('/api/articles', [
            'title' => 'Article invite',
            'content' => 'Contenu test',
            'category' => 'Respiration',
        ]);

        $response->assertUnauthorized();
    }

    public function test_admin_can_create_article(): void
    {
        $this->seedRoles();
        $admin = $this->makeAdmin();

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/articles', [
            'title' => 'Article admin',
            'content' => 'Contenu test',
            'category' => 'Respiration',
        ]);

        $response->assertCreated()->assertJsonPath('id_user', $admin->id);
        $this->assertDatabaseHas('articles', [
            'title' => 'Article admin',
            'id_user' => $admin->id,
        ]);
    }

    public function test_non_admin_cannot_create_exercise(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/exercises', [
            'name' => 'Blocage',
            'description' => 'Exercice de test',
            'inhaleDuration' => 4,
            'exhaleDuration' => 6,
            'holdDuration' => 0,
        ]);

        $response->assertForbidden();
    }

    public function test_guest_cannot_create_exercise(): void
    {
        $response = $this->postJson('/api/exercises', [
            'name' => 'Blocage',
            'description' => 'Exercice de test',
            'inhaleDuration' => 4,
            'exhaleDuration' => 6,
            'holdDuration' => 0,
        ]);

        $response->assertUnauthorized();
    }

    public function test_admin_can_create_exercise(): void
    {
        $this->seedRoles();
        $admin = $this->makeAdmin();

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/exercises', [
            'name' => 'Equilibre guide',
            'description' => 'Exercice de coherence cardiaque',
            'inhaleDuration' => 5,
            'exhaleDuration' => 5,
            'holdDuration' => 0,
        ]);

        $response->assertCreated()->assertJsonPath('name', 'Equilibre guide');
        $this->assertDatabaseHas('exercises', [
            'name' => 'Equilibre guide',
        ]);
    }
}
