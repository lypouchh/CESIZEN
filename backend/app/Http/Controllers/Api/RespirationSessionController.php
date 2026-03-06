<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RespirationSession;
use Illuminate\Http\Request;

class RespirationSessionController extends Controller {
    public function index(Request $request) {
        $userId = $request->query('id_user');
        $query = RespirationSession::with('exercise');
        if ($userId) $query->where('id_user', $userId);
        return response()->json($query->get());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'duration' => 'required|integer',
            'breathingRate' => 'required|integer',
            'id_user' => 'required|exists:User,id',
            'id_Exercise' => 'required|exists:Exercise,id'
        ]);
        return response()->json(RespirationSession::create($validated), 201);
    }
}