<?php

namespace App\Factories;

use App\Models\Article;
use App\Models\User;

/**
 * ContentFactory - Abstract Factory Pattern
 * 
 * Usine abstraite pour créer différents types de contenus d'information.
 * Fournit une interface commune pour la création de contenus éducatifs.
 */
abstract class ContentFactory
{
    /**
     * Crée une instance de contenu selon le type
     */
    public static function make(string $type, array $data): mixed
    {
        return match($type) {
            'article' => self::createArticle($data),
            'educational' => self::createEducationalContent($data),
            'tip' => self::createTip($data),
            default => throw new \InvalidArgumentException("Type de contenu '$type' non supporté")
        };
    }

    /**
     * Crée un article standard
     */
    private static function createArticle(array $data): Article
    {
        $user = User::find($data['user_id'] ?? null) 
            ?? User::where('isSuperAdmin', true)->first();

        return ArticleFactory::create($user, $data);
    }

    /**
     * Crée un contenu éducatif structuré
     */
    private static function createEducationalContent(array $data): Article
    {
        $user = User::find($data['user_id'] ?? null) 
            ?? User::where('isSuperAdmin', true)->first();

        // Forcer la catégorie en "Éducation" pour le contenu éducatif
        $data['category'] = 'Éducation';

        return ArticleFactory::create($user, $data);
    }

    /**
     * Crée un conseil/tip rapide
     */
    private static function createTip(array $data): Article
    {
        $user = User::find($data['user_id'] ?? null) 
            ?? User::where('isSuperAdmin', true)->first();

        // Les tips sont des articles courts dans la catégorie "Tips"
        $data['category'] = 'Tips';
        
        // Limiter la taille du contenu pour les tips
        if (strlen($data['content'] ?? '') > 500) {
            $data['content'] = substr($data['content'], 0, 500) . '...';
        }

        return ArticleFactory::create($user, $data);
    }

    /**
     * Crée une collection de contenus de démonstration
     */
    public static function createDemoCollection(User $author): array
    {
        return [
            self::createEducationalContent([
                'user_id' => $author->id,
                'title' => 'Guide complet de la respiration consciente',
                'content' => 'La respiration consciente est une pratique millénaire...',
                'category' => 'Éducation'
            ]),
            self::createTip([
                'user_id' => $author->id,
                'title' => '5 bénéfices de la respiration quotidienne',
                'content' => '1. Réduit le stress\n2. Améliore la concentration\n3. Renforce l\'immunité\n4. Régule le cœur\n5. Apaise l\'esprit',
                'category' => 'Tips'
            ]),
            self::createArticle([
                'user_id' => $author->id,
                'title' => 'Comment débuter avec la respiration',
                'content' => 'Pour débuter, trouvez un endroit calme...',
                'category' => 'Bien-être'
            ]),
        ];
    }
}
