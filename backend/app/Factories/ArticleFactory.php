<?php

namespace App\Factories;

use App\Models\Article;
use App\Models\User;

/**
 * ArticleFactory - Factory Pattern
 * 
 * Centralise la création d'objets Article avec validation
 * et application de règles métier cohérentes.
 */
class ArticleFactory
{
    /**
     * Crée un article avec validation et règles métier
     */
    public static function create(User $author, array $data): Article
    {
        return Article::create([
            'title' => self::sanitizeTitle($data['title']),
            'content' => self::sanitizeContent($data['content']),
            'category' => self::normalizeCategory($data['category']),
            'id_user' => $author->id,
        ]);
    }

    /**
     * Crée un article de démonstration
     */
    public static function createDemo(User $author): Article
    {
        return self::create($author, [
            'title' => 'Article de démonstration : La respiration consciente',
            'content' => 'La respiration consciente est une technique de pleine conscience...',
            'category' => 'Bien-être'
        ]);
    }

    /**
     * Crée un article à partir d'un brouillon (draft)
     */
    public static function createFromDraft(User $author, array $draft): Article
    {
        if (!isset($draft['title']) || !isset($draft['content'])) {
            throw new \InvalidArgumentException('Un brouillon doit contenir title et content');
        }

        return self::create($author, $draft);
    }

    /**
     * Nettoie le titre
     */
    private static function sanitizeTitle(string $title): string
    {
        return trim(substr($title, 0, 255));
    }

    /**
     * Nettoie le contenu
     */
    private static function sanitizeContent(string $content): string
    {
        return trim($content);
    }

    /**
     * Normalise la catégorie
     */
    private static function normalizeCategory(string $category): string
    {
        $validCategories = [
            'Bien-être',
            'Santé',
            'Lifestyle',
            'Technique',
            'Autres'
        ];

        $normalized = trim(substr($category, 0, 100));
        
        return in_array($normalized, $validCategories) 
            ? $normalized 
            : 'Autres';
    }
}
