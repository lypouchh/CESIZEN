<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\RespirationSessionController;
use App\Http\Controllers\Api\ExerciseController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('articles', ArticleController::class);
Route::apiResource('exercises', ExerciseController::class);
Route::apiResource('sessions', RespirationSessionController::class);
