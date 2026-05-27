<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\RespirationSessionController;
use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\EnsureUserIsAdmin;

// Routes Publiques
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth-login');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth-register');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);
    Route::delete('/user', [AuthController::class, 'destroyAccount']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Routes réservées aux admins (id_role = 1)
    Route::middleware(EnsureUserIsAdmin::class)->group(function () {
        // Gestion des utilisateurs
        Route::get('/admin/users', [AuthController::class, 'listUsers']);
        Route::post('/admin/admins', [AuthController::class, 'createSubAdmin']);
        Route::put('/admin/users/{id}/status', [AuthController::class, 'toggleUserStatus']);
        Route::delete('/admin/users/{id}', [AuthController::class, 'deleteUser']);
    });

    // Articles (CRUD Admin)
    Route::apiResource('articles', ArticleController::class)->except(['index', 'show'])->middleware(EnsureUserIsAdmin::class);

    // Favoris
    Route::post('articles/{article}/favorite', [ArticleController::class, 'addFavorite']);
    Route::delete('articles/{article}/favorite', [ArticleController::class, 'removeFavorite']);
    Route::get('favorites', [ArticleController::class, 'getFavorites']);

    // Exercises (CRUD Admin)
    Route::apiResource('exercises', ExerciseController::class)->except(['index', 'show'])->middleware(EnsureUserIsAdmin::class);
});

// Routes pour la récupération de mot de passe
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:auth-password-reset');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:auth-password-reset');
Route::post('/register-admin-secret', [AuthController::class, 'registerAdmin']);

// Routes Publiques pour Articles et Exercises
Route::apiResource('articles', ArticleController::class)->only(['index', 'show']);
Route::apiResource('exercises', ExerciseController::class)->only(['index', 'show']);
Route::get('sessions', [RespirationSessionController::class, 'index']);
Route::middleware('auth:sanctum')->post('sessions', [RespirationSessionController::class, 'store']);
