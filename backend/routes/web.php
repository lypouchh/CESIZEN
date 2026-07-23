<?php

// Démo soutenance : PR de démonstration du workflow develop (aucun changement fonctionnel).
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => config('app.name', 'CESIZEN'),
        'color' => env('APP_COLOR', 'unknown'),
        'version' => app()->version(),
    ]);
});
