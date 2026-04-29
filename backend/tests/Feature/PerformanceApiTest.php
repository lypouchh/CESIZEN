<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Exercise;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PerformanceApiTest extends TestCase
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
            'firstname' => 'Perf',
            'lastname' => 'Admin',
            'email' => uniqid('perf_admin_', true) . '@example.com',
            'passwordHash' => Hash::make('password123'),
            'id_role' => 1,
            'isActive' => true,
            'isSuperAdmin' => false,
        ], $overrides));
    }

    private function seedArticles(int $count = 25): void
    {
        $this->seedRoles();
        $admin = $this->makeAdmin();

        for ($i = 1; $i <= $count; $i += 1) {
            Article::query()->create([
                'title' => "Article {$i}",
                'content' => str_repeat('Contenu respiration ', 20),
                'category' => 'Respiration',
                'id_user' => $admin->id,
            ]);
        }
    }

    private function seedExercises(int $count = 20): void
    {
        for ($i = 1; $i <= $count; $i += 1) {
            Exercise::query()->create([
                'name' => "Exercice {$i}",
                'description' => 'Exercice de test',
                'inhaleDuration' => 5,
                'exhaleDuration' => 5,
                'holdDuration' => 0,
            ]);
        }
    }

    private function assertFastEnough(callable $request, float $thresholdMs): void
    {
        $start = microtime(true);
        $response = $request();
        $elapsedMs = (microtime(true) - $start) * 1000;

        $response->assertOk();
        $this->assertLessThan(
            $thresholdMs,
            $elapsedMs,
            sprintf('Expected response time under %.0f ms, got %.2f ms.', $thresholdMs, $elapsedMs)
        );
    }

    public function test_articles_index_responds_under_threshold(): void
    {
        $this->seedArticles();

        $this->assertFastEnough(fn () => $this->getJson('/api/articles'), 300);
    }

    public function test_exercises_index_responds_under_threshold(): void
    {
        $this->seedExercises();

        $this->assertFastEnough(fn () => $this->getJson('/api/exercises'), 250);
    }

    public function test_article_show_responds_under_threshold(): void
    {
        $this->seedArticles(1);
        $article = Article::query()->firstOrFail();

        $this->assertFastEnough(fn () => $this->getJson('/api/articles/' . $article->id), 200);
    }

    public function test_exercise_show_responds_under_threshold(): void
    {
        $this->seedExercises(1);
        $exercise = Exercise::query()->firstOrFail();

        $this->assertFastEnough(fn () => $this->getJson('/api/exercises/' . $exercise->id), 200);
    }

    public function test_sessions_index_responds_under_threshold_when_empty(): void
    {
        $this->assertFastEnough(fn () => $this->getJson('/api/sessions'), 200);
    }
}
