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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string',
            'inhaleDuration' => 'required|integer|min:1',
            'exhaleDuration' => 'required|integer|min:1',
            'holdDuration' => 'required|integer|min:0',
        ]);

        $exercise = Exercise::create($validated);

        return response()->json($exercise, 201);
    }

    public function update(Request $request, Exercise $exercise)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'description' => 'sometimes|required|string',
            'inhaleDuration' => 'sometimes|required|integer|min:1',
            'exhaleDuration' => 'sometimes|required|integer|min:1',
            'holdDuration' => 'sometimes|required|integer|min:0',
        ]);

        $exercise->update($validated);

        return response()->json($exercise);
    }

    public function destroy(Exercise $exercise)
    {
        $exercise->delete();

        return response()->json(null, 204);
    }
}