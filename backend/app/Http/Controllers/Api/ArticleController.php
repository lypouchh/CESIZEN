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
        ]);

        $article = $request->user()->articles()->create($validated);

        return response()->json($article, 201);
    }

    public function show(Article $article) {
        return response()->json($article->load('user'));
    }

    public function update(Request $request, Article $article) {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'category' => 'sometimes|required|string|max:100',
        ]);

        $article->update($validated);

        return response()->json($article);
    }

    public function destroy(Article $article) {
        $article->delete();

        return response()->json(null, 204);
    }

    public function addFavorite(Request $request, Article $article)
    {
        $request->user()->favoriteArticles()->attach($article);

        return response()->json(['message' => 'Article added to favorites.']);
    }

    public function removeFavorite(Request $request, Article $article)
    {
        $request->user()->favoriteArticles()->detach($article);

        return response()->json(['message' => 'Article removed from favorites.']);
    }

    public function getFavorites(Request $request)
    {
        return response()->json($request->user()->favoriteArticles);
    }
}