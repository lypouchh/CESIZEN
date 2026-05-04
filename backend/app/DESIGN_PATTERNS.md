# Patterns Architecturaux Implémentés

## Vue d'ensemble

Cette documentation explique les 3 patterns architecturaux principaux utilisés dans CESIZEN :

1. **MVC** - Architecture générale
2. **Singleton** - Authentification centralisée
3. **Factory** - Création d'objets métier

---

## 1. MVC (Model-View-Controller)

### Description
Laravel utilise l'architecture MVC par défaut. Chaque couche a une responsabilité claire :

- **Model** : Représente les données (User, Article, Exercise, RespirationSession, Role)
- **View** : Interface utilisateur (React en frontend)
- **Controller** : Logique métier et coordination

### Structure du projet
```
backend/
├── app/
│   ├── Http/Controllers/        # Controllers
│   ├── Models/                   # Models (Eloquent)
│   └── Services/                 # Services (couche métier)
└── resources/views/              # Views (peu utilisées avec React)

frontend/
├── src/
│   ├── pages/                    # Composants React (Views)
│   ├── components/               # Composants réutilisables
│   └── services/                 # Services API
```

---

## 2. Singleton Pattern - AuthService

### Description
Le pattern Singleton garantit qu'une seule instance d'une classe existe pendant toute la vie de l'application. C'est idéal pour l'authentification car on ne veut qu'un seul gestionnaire d'authentification.

### Fichier
`app/Services/AuthService.php`

### Caractéristiques
- Constructeur privé pour empêcher l'instanciation directe
- Méthode statique `getInstance()` pour accéder à l'instance unique
- Centralise toute la logique d'authentification

### Utilisation
```php
use App\Services\AuthService;

$authService = AuthService::getInstance();

// Authentifier
$result = $authService->authenticate('admin@cesizen.fr', 'password');

// Enregistrer
$user = $authService->register([
    'firstname' => 'John',
    'lastname' => 'Doe',
    'email' => 'john@example.com',
    'password' => 'secure123'
]);

// Logout
$authService->logout($user);

// Vérifier si super admin
if ($authService->isSuperAdmin($user)) {
    // Accès administrateur
}
```

### Avantages
- ✅ Une seule instance pour toute l'application
- ✅ Logique d'authentification centralisée
- ✅ Facile à tester et à maintenir
- ✅ Prévient les incohérences d'état

---

## 3. Factory Pattern - Création d'Objets

### A. ArticleFactory

#### Description
Le pattern Factory centralise la création d'Articles avec validation et règles métier.

#### Fichier
`app/Factories/ArticleFactory.php`

#### Utilisation
```php
use App\Factories\ArticleFactory;
use App\Models\User;

$author = User::find(1);

// Créer un article standard
$article = ArticleFactory::create($author, [
    'title' => 'Ma première article',
    'content' => 'Contenu de l\'article...',
    'category' => 'Bien-être'
]);

// Créer un article de démonstration
$demoArticle = ArticleFactory::createDemo($author);

// Créer à partir d'un brouillon
$draftArticle = ArticleFactory::createFromDraft($author, [
    'title' => 'Titre du brouillon',
    'content' => 'Contenu du brouillon'
]);
```

#### Règles Métier
- Titre limité à 255 caractères, trimé
- Contenu toujours trimé
- Catégories normalisées (Bien-être, Santé, Lifestyle, Technique, Autres)

---

### B. ExerciseFactory

#### Description
Le pattern Factory pour créer des Exercices de respiration avec validation des durées.

#### Fichier
`app/Factories/ExerciseFactory.php`

#### Utilisation
```php
use App\Factories\ExerciseFactory;

// Créer un exercice personnalisé
$exercise = ExerciseFactory::create([
    'name' => 'Ma respiration',
    'description' => 'Description...',
    'inhaleDuration' => 5,
    'exhaleDuration' => 5,
    'holdDuration' => 0
]);

// Créer les 3 exercices de base
$defaults = ExerciseFactory::createDefaults();

// Box breathing (4-4-4-4)
$boxBreathing = ExerciseFactory::createBoxBreathing();

// Calming breath (4-7-8)
$calmingBreath = ExerciseFactory::createCalmingBreath();

// Exercice personnalisé rapide
$custom = ExerciseFactory::createCustom('Ma technique', 6, 6, 0);
```

#### Validation
- Inhalation et exhalation > 0
- Apnée ≥ 0
- Durée totale ≤ 60 secondes

#### Avantages
- ✅ Créer rapidement les exercices de base
- ✅ Validation centralisée des durées
- ✅ Typage et cohérence garantis
- ✅ Facile d'ajouter de nouveaux types d'exercices

---

### C. ContentFactory (Abstract Factory)

#### Description
Usine abstraite pour créer différents types de contenus d'information avec une interface commune.

#### Fichier
`app/Factories/ContentFactory.php`

#### Utilisation
```php
use App\Factories\ContentFactory;

// Créer un article standard
$article = ContentFactory::make('article', [
    'user_id' => 1,
    'title' => 'Titre',
    'content' => 'Contenu...',
    'category' => 'Bien-être'
]);

// Créer un contenu éducatif structuré
$educational = ContentFactory::make('educational', [
    'user_id' => 1,
    'title' => 'Guide complet',
    'content' => 'Contenu éducatif...'
]);

// Créer un conseil rapide (tip)
$tip = ContentFactory::make('tip', [
    'user_id' => 1,
    'title' => '5 conseils',
    'content' => 'Conseils rapides...'
]);

// Créer une collection de démo
$collection = ContentFactory::createDemoCollection($user);
```

#### Types Supportés
- `article` - Article standard
- `educational` - Contenu éducatif (catégorie forcée à "Éducation")
- `tip` - Conseil rapide (limité à 500 caractères, catégorie "Tips")

#### Avantages
- ✅ Interface commune pour tous les contenus
- ✅ Extensible facilement (ajouter de nouveaux types)
- ✅ Logique de création centralisée
- ✅ Respect du principe Open/Closed

---

## 4. Intégration dans les Controllers

### Avant (sans Factory)
```php
public function store(Request $request)
{
    $validated = $request->validate([...]);
    $article = $request->user()->articles()->create($validated);
    return response()->json($article, 201);
}
```

### Après (avec Factory)
```php
use App\Factories\ArticleFactory;

public function store(Request $request)
{
    $validated = $request->validate([...]);
    $article = ArticleFactory::create($request->user(), $validated);
    return response()->json($article, 201);
}
```

### Avantages
- ✅ Controllers plus minces
- ✅ Logique métier externalisée
- ✅ Réutilisable dans d'autres contexts (API, Artisan, etc.)
- ✅ Facilite les tests unitaires

---

## 5. Résumé des Patterns

| Pattern | Classe | Responsabilité | Bénéfice |
|---------|--------|-----------------|----------|
| **MVC** | Architecture globale | Séparation des responsabilités | Maintenabilité |
| **Singleton** | `AuthService` | Instance unique d'authentification | Cohérence d'état |
| **Factory** | `ArticleFactory` | Création validée d'Articles | Cohérence métier |
| **Factory** | `ExerciseFactory` | Création validée d'Exercices | Validation durées |
| **Abstract Factory** | `ContentFactory` | Création polymorphe de contenus | Extensibilité |

---

## 6. Bonnes Pratiques

### ✅ À faire
- Utiliser les Factories pour créer des objets métier
- Centraliser la validation métier dans les Factories
- Utiliser AuthService::getInstance() pour l'authentification
- Garder les Controllers minces

### ❌ À éviter
- Créer des objets directement dans les Controllers : `new Article(...)`
- Dupliquer la logique de création
- Laisser l'authentification sans service centralisé
- Mettre la validation métier dans les Models

---

## 7. Tests

### Test du Singleton
```php
$auth1 = AuthService::getInstance();
$auth2 = AuthService::getInstance();

$this->assertSame($auth1, $auth2); // Même instance ✓
```

### Test de la Factory
```php
$article = ArticleFactory::create($user, [
    'title' => 'Test',
    'content' => 'Contenu',
    'category' => 'Bien-être'
]);

$this->assertInstanceOf(Article::class, $article);
$this->assertEquals('Test', $article->title);
```

---

## Conclusion

Ton architecture utilise maintenant les 3 patterns demandés :
1. **MVC** ✅ - Structure fondamentale de Laravel
2. **Singleton** ✅ - `AuthService` pour l'authentification
3. **Factory** ✅ - `ArticleFactory`, `ExerciseFactory`, `ContentFactory`

Ces patterns apportent :
- 🎯 **Cohérence** : Logique métier centralisée
- 🔒 **Sécurité** : Validation garantie
- 📦 **Réutilisabilité** : Code utilisable partout
- 🧪 **Testabilité** : Facile à tester en isolation
- 🚀 **Scalabilité** : Facile d'ajouter de nouvelles fonctionnalités
