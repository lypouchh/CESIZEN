<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RespirationSession;
use Illuminate\Http\Request;

class RespirationSessionController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->query('id_user');
        $query = RespirationSession::with('exercise');

        if ($request->user()) {
            $query->where('id_user', $request->user()->id);
        } elseif ($userId) {
            $query->where('id_user', $userId);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'duration' => 'required|integer',
            'breathingRate' => 'required|integer',
            'repetitions' => 'nullable|integer|min:1',
            'id_user' => 'required|exists:users,id',
            'id_Exercise' => 'required|exists:exercises,id',
        ]);

        $validated['repetitions'] = isset($validated['repetitions'])
            ? (int) $validated['repetitions']
            : 1;

        $authenticatedUser = $request->user();
        $requestedUserId = (int) $validated['id_user'];

        if ($authenticatedUser && (int) $authenticatedUser->id !== $requestedUserId) {
            return response()->json(['message' => 'Action non autorisée.'], 403);
        }

        return response()->json(RespirationSession::create($validated), 201);
    }
}
