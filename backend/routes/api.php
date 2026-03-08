<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\RespirationSessionController;
use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\AuthController;

// Routes Publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes Protégées (nécessitent d'être connecté)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::apiResource('articles', ArticleController::class);
Route::apiResource('exercises', ExerciseController::class);
Route::apiResource('sessions', RespirationSessionController::class);
