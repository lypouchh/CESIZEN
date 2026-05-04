<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Créer les rôles
        \App\Models\Role::create(['nom' => 'Admin']);
        \App\Models\Role::create(['nom' => 'User']);

        // Créer des exercises de base
        \App\Models\Exercise::create([
            'name' => 'Équilibre (5-5)',
            'description' => 'Respiration équilibrée pour le quotidien',
            'inhaleDuration' => 5,
            'exhaleDuration' => 5,
            'holdDuration' => 0
        ]);

        \App\Models\Exercise::create([
            'name' => 'Relaxation (4-6)',
            'description' => 'Respiration relaxante pour le stress',
            'inhaleDuration' => 4,
            'exhaleDuration' => 6,
            'holdDuration' => 0
        ]);

        \App\Models\Exercise::create([
            'name' => 'Sommeil (7-4-8)',
            'description' => 'Respiration pour favoriser l\'endormissement',
            'inhaleDuration' => 7,
            'exhaleDuration' => 8,
            'holdDuration' => 4
        ]);

        // Créer un admin
        User::create([
            'firstname' => 'Admin',
            'lastname' => 'CESIZEN',
            'email' => 'admin@cesizen.fr',
            'passwordHash' => bcrypt('admin123'),
            'id_role' => 1,
            'isActive' => true,
            'isSuperAdmin' => true,
        ]);

        // Compte utilisateur de démonstration
        User::create([
            'firstname' => 'User',
            'lastname' => 'Demo',
            'email' => 'user@cesizen.fr',
            'passwordHash' => bcrypt('user12345'),
            'id_role' => 2,
            'isActive' => true,
            'isSuperAdmin' => false,
        ]);

        // Créer des articles de démonstration
        \App\Models\Article::create([
            'title' => 'Qu\'est-ce que la cohérence cardiaque ?',
            'content' => 'La cohérence cardiaque est une technique de respiration qui permet d\'harmoniser le rythme cardiaque avec la respiration. Cette méthode simple et efficace aide à réduire le stress, améliorer la concentration et favoriser le bien-être général.

La cohérence cardiaque repose sur un principe simple : respirer à un rythme de 6 respirations par minute (soit 5 secondes d\'inspiration et 5 secondes d\'expiration). Cette fréquence spécifique permet de synchroniser les variations du rythme cardiaque avec la respiration, créant un état d\'équilibre appelé "cohérence".

Les bienfaits de la cohérence cardiaque sont nombreux :
- Réduction du stress et de l\'anxiété
- Amélioration de la concentration et de la performance cognitive
- Meilleure gestion des émotions
- Renforcement du système immunitaire
- Amélioration de la qualité du sommeil

Cette technique peut être pratiquée n\'importe où, n\'importe quand, et ne nécessite aucun équipement particulier. Quelques minutes par jour suffisent pour ressentir ses effets bénéfiques.',
            'category' => 'Bien-être',
            'id_user' => 1
        ]);

        \App\Models\Article::create([
            'title' => 'Les différents rythmes de respiration',
            'content' => 'Il existe plusieurs rythmes de respiration adaptés à différentes situations et objectifs. Chaque rythme a ses propres bienfaits et applications.

1. **Respiration 5-5 (équilibre)** : 5 secondes inspiration, 5 secondes expiration
   - Idéale pour le quotidien
   - Aide à maintenir l\'équilibre émotionnel
   - Parfaite pour les débutants

2. **Respiration 4-6 (relaxation)** : 4 secondes inspiration, 6 secondes expiration
   - Favorise la détente profonde
   - Réduit efficacement le stress
   - Aide à s\'endormir plus facilement

3. **Respiration 7-4-8 (sommeil)** : 7 secondes inspiration, 4 secondes rétention, 8 secondes expiration
   - Technique avancée pour le sommeil
   - Puissant effet calmant
   - À pratiquer le soir avant de dormir

Chaque rythme peut être adapté selon vos besoins du moment. L\'important est la régularité de la pratique pour en ressentir pleinement les bienfaits.',
            'category' => 'Respiration',
            'id_user' => 1
        ]);

        \App\Models\Article::create([
            'title' => 'La cohérence cardiaque au travail',
            'content' => 'La cohérence cardiaque trouve une application particulièrement pertinente dans l\'environnement professionnel. Face au stress quotidien, aux deadlines serrées et aux exigences constantes, cette technique offre un outil précieux pour maintenir performance et bien-être.

Dans un contexte professionnel, la cohérence cardiaque permet :
- De gérer le stress des réunions importantes
- D\'améliorer la concentration lors de tâches complexes
- De récupérer plus rapidement après une journée intense
- De mieux gérer les relations interpersonnelles

De nombreuses entreprises intègrent désormais des programmes de cohérence cardiaque dans leur politique de bien-être au travail. Quelques minutes de pratique par jour peuvent considérablement améliorer la qualité de vie professionnelle et réduire l\'absentéisme lié au stress.

La cohérence cardiaque est particulièrement efficace avant une présentation importante, pendant une pause déjeuner, ou en fin de journée pour "décompresser" avant de rentrer chez soi.',
            'category' => 'Santé',
            'id_user' => 1
        ]);
    }
}
