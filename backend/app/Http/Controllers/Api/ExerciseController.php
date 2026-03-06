<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseController extends Controller {
    public function index() {
        return response()->json(Exercise::all());
    }

    public function show(Exercise $exercise) {
        return response()->json($exercise);
    }

    // Les méthodes store/update/delete peuvent être ajoutées ici pour l'administration
}