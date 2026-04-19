<?php

namespace Tests\Feature;

use App\Models\Exercise;
use App\Models\Role;
use App\Models\RespirationSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RespirationSessionsApiTest extends TestCase
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
            'firstname' => 'User',
            'lastname' => 'Session',
            'email' => uniqid('session_', true) . '@example.com',
            'passwordHash' => Hash::make('password123'),
            'id_role' => 2,
            'isActive' => true,
            'isSuperAdmin' => false,
        ], $overrides));
    }

    private function makeExercise(): Exercise
    {
        return Exercise::query()->create([
            'name' => 'Equilibre',
            'description' => 'Respiration',
            'inhaleDuration' => 5,
            'exhaleDuration' => 5,
            'holdDuration' => 0,
        ]);
    }

    public function test_authenticated_user_can_store_own_session(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();
        $exercise = $this->makeExercise();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/sessions', [
            'duration' => 60,
            'breathingRate' => 6,
            'id_user' => $user->id,
            'id_Exercise' => $exercise->id,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('respiration_sessions', ['id_user' => $user->id, 'id_Exercise' => $exercise->id]);
    }

    public function test_authenticated_user_cannot_store_for_another_user(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();
        $other = $this->makeUser();
        $exercise = $this->makeExercise();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/sessions', [
            'duration' => 30,
            'breathingRate' => 5,
            'id_user' => $other->id,
            'id_Exercise' => $exercise->id,
        ]);

        $response->assertForbidden();
    }

    public function test_store_requires_duration(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();
        $exercise = $this->makeExercise();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/sessions', [
            'breathingRate' => 5,
            'id_user' => $user->id,
            'id_Exercise' => $exercise->id,
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['duration']);
    }

    public function test_store_requires_valid_exercise(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/sessions', [
            'duration' => 50,
            'breathingRate' => 6,
            'id_user' => $user->id,
            'id_Exercise' => 9999,
        ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['id_Exercise']);
    }

    public function test_authenticated_index_returns_only_current_user_sessions(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();
        $other = $this->makeUser();
        $exercise = $this->makeExercise();

        RespirationSession::query()->create([
            'duration' => 40,
            'breathingRate' => 6,
            'id_user' => $user->id,
            'id_Exercise' => $exercise->id,
        ]);
        RespirationSession::query()->create([
            'duration' => 35,
            'breathingRate' => 5,
            'id_user' => $other->id,
            'id_Exercise' => $exercise->id,
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/sessions?id_user=' . $other->id);

        $response->assertOk();
        $this->assertCount(1, $response->json());
        $this->assertSame($user->id, $response->json()[0]['id_user']);
    }

    public function test_guest_index_can_filter_by_user(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();
        $other = $this->makeUser();
        $exercise = $this->makeExercise();

        RespirationSession::query()->create([
            'duration' => 20,
            'breathingRate' => 4,
            'id_user' => $user->id,
            'id_Exercise' => $exercise->id,
        ]);
        RespirationSession::query()->create([
            'duration' => 22,
            'breathingRate' => 4,
            'id_user' => $other->id,
            'id_Exercise' => $exercise->id,
        ]);

        $response = $this->getJson('/api/sessions?id_user=' . $user->id);

        $response->assertOk();
        $this->assertCount(1, $response->json());
        $this->assertSame($user->id, $response->json()[0]['id_user']);
    }

    public function test_guest_index_without_filter_returns_all_sessions(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();
        $other = $this->makeUser();
        $exercise = $this->makeExercise();

        RespirationSession::query()->create([
            'duration' => 20,
            'breathingRate' => 4,
            'id_user' => $user->id,
            'id_Exercise' => $exercise->id,
        ]);
        RespirationSession::query()->create([
            'duration' => 22,
            'breathingRate' => 4,
            'id_user' => $other->id,
            'id_Exercise' => $exercise->id,
        ]);

        $response = $this->getJson('/api/sessions');

        $response->assertOk();
        $this->assertCount(2, $response->json());
    }

    public function test_guest_cannot_store_session_for_existing_user(): void
    {
        $this->seedRoles();
        $user = $this->makeUser();
        $exercise = $this->makeExercise();

        $response = $this->postJson('/api/sessions', [
            'duration' => 66,
            'breathingRate' => 6,
            'id_user' => $user->id,
            'id_Exercise' => $exercise->id,
        ]);

        $response->assertUnauthorized();
    }
}
