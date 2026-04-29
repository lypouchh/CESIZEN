<?php

namespace App\Factories;

use App\Models\Exercise;

/**
 * ExerciseFactory - Factory Pattern
 * 
 * Centralise la création d'objets Exercise (exercices de respiration)
 * avec validation et règles métier.
 */
class ExerciseFactory
{
    /**
     * Crée un exercice avec validation
     */
    public static function create(array $data): Exercise
    {
        self::validateDurations($data);

        return Exercise::create([
            'name' => self::sanitizeName($data['name']),
            'description' => self::sanitizeDescription($data['description']),
            'inhaleDuration' => (int) $data['inhaleDuration'],
            'exhaleDuration' => (int) $data['exhaleDuration'],
            'holdDuration' => (int) ($data['holdDuration'] ?? 0),
        ]);
    }

    /**
     * Crée les exercices de base (respiration équilibrée, relaxation, sommeil)
     */
    public static function createDefaults(): array
    {
        return [
            self::create([
                'name' => 'Équilibre (5-5)',
                'description' => 'Respiration équilibrée pour le quotidien',
                'inhaleDuration' => 5,
                'exhaleDuration' => 5,
                'holdDuration' => 0
            ]),
            self::create([
                'name' => 'Relaxation (4-6)',
                'description' => 'Respiration relaxante pour le stress',
                'inhaleDuration' => 4,
                'exhaleDuration' => 6,
                'holdDuration' => 0
            ]),
            self::create([
                'name' => 'Sommeil (7-4-8)',
                'description' => 'Respiration pour favoriser l\'endormissement',
                'inhaleDuration' => 7,
                'exhaleDuration' => 8,
                'holdDuration' => 4
            ]),
        ];
    }

    /**
     * Crée un exercice personnalisé
     */
    public static function createCustom(string $name, int $inhale, int $exhale, int $hold = 0): Exercise
    {
        return self::create([
            'name' => $name,
            'description' => "Exercice personnalisé : $name",
            'inhaleDuration' => $inhale,
            'exhaleDuration' => $exhale,
            'holdDuration' => $hold,
        ]);
    }

    /**
     * Crée une respiration carrée (box breathing) 4-4-4-4
     */
    public static function createBoxBreathing(): Exercise
    {
        return self::create([
            'name' => 'Respiration Carrée (4-4-4-4)',
            'description' => 'Technique de respiration carrée pour la concentration',
            'inhaleDuration' => 4,
            'exhaleDuration' => 4,
            'holdDuration' => 4,
        ]);
    }

    /**
     * Crée une respiration 4-7-8 (calming breath)
     */
    public static function createCalmingBreath(): Exercise
    {
        return self::create([
            'name' => 'Respiration Apaisante (4-7-8)',
            'description' => 'Technique apaisante pour réduire l\'anxiété',
            'inhaleDuration' => 4,
            'exhaleDuration' => 8,
            'holdDuration' => 7,
        ]);
    }

    /**
     * Valide les durées de respiration
     */
    private static function validateDurations(array $data): void
    {
        $inhale = (int) ($data['inhaleDuration'] ?? 0);
        $exhale = (int) ($data['exhaleDuration'] ?? 0);
        $hold = (int) ($data['holdDuration'] ?? 0);

        if ($inhale <= 0 || $exhale <= 0) {
            throw new \InvalidArgumentException('Les durées d\'inhalation et d\'exhalation doivent être positives');
        }

        if ($hold < 0) {
            throw new \InvalidArgumentException('La durée d\'apnée ne peut pas être négative');
        }

        $total = $inhale + $exhale + $hold;
        if ($total > 60) {
            throw new \InvalidArgumentException('La durée totale de l\'exercice ne doit pas dépasser 60 secondes');
        }
    }

    /**
     * Nettoie le nom de l'exercice
     */
    private static function sanitizeName(string $name): string
    {
        return trim(substr($name, 0, 255));
    }

    /**
     * Nettoie la description
     */
    private static function sanitizeDescription(string $description): string
    {
        return trim($description);
    }
}
