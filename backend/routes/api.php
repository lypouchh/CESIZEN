<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\RespirationSessionController;
use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\AuthController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Routes réservées aux admins (id_role = 1)
    Route::middleware(function ($request, $next) {
        if ($request->user()->id_role !== 1) {
            return response()->json(['message' => 'Accès refusé. Admin uniquement.'], 403);
        }
        return $next($request);
    })->group(function () {
        Route::post('/articles', [ArticleController::class, 'store']);
        Route::post('/exercises', [ExerciseController::class, 'store']);
        // Gestion des utilisateurs
        Route::get('/admin/users', [AuthController::class, 'listUsers']);
        Route::delete('/admin/users/{id}', [AuthController::class, 'deleteUser']);
    });
});

// Routes pour la récupération de mot de passe
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/register-admin-secret', [AuthController::class, 'registerAdmin']);

Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/exercises', [ExerciseController::class, 'index']);
Route::apiResource('sessions', RespirationSessionController::class);
