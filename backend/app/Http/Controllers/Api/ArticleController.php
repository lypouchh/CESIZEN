<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller {
    public function index() {
        return response()->json(Article::with('user')->get());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|max:100',
            'id_user' => 'required|exists:User,id'
        ]);
        $article = Article::create($validated);
        return response()->json($article, 201);
    }

    public function show(Article $article) {
        return response()->json($article->load('user'));
    }
}