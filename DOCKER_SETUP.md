# 🐳 Docker Setup pour CESIZEN

Ce projet est configuré avec Docker pour faciliter le développement et les tests.

## 📋 Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installé et en cours d'exécution
- Git

## 🚀 Démarrage rapide

### Windows
```bash
docker-init.bat
```

### macOS / Linux
```bash
chmod +x docker-init.sh
./docker-init.sh
```

Ou manuellement:
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev up -d
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan migrate
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan db:seed
```

## 📍 Accès aux services

Une fois les containers lancés:

- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **MySQL**: `localhost:3306`
  - Utilisateur: `cesizen_user`
  - Mot de passe: `password`
  - Base de données: `cesizen`

## 📝 Configuration

Les variables d'environnement sont définies dans:
- `.env.docker` - Configuration Docker
- `backend/.env` - Créé automatiquement lors de l'initialisation

Pour modifier les ports ou les identifiants MySQL, éditez `.env.dev` (ports/identifiants) ou `docker-compose.dev.yml` (structure des services).

## 🛠️ Commandes utiles

### Afficher les logs
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev logs -f          # Tous les services
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev logs -f laravel  # Seulement Laravel
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev logs -f mysql    # Seulement MySQL
```

### Accéder au shell
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel bash        # Shell Laravel
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec mysql bash          # Shell MySQL
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan # Commandes Artisan
```

### Exécuter des commandes Artisan
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan migrate
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan db:seed
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan tinker
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan test
```

### Gestion des containers
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev up -d        # Démarrer les services
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev down         # Arrêter les services
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev restart      # Redémarrer les services
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev ps           # Afficher l'état des services
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev build        # Reconstruire les images
```

## 🗄️ Gestion de la base de données

### Effectuer une migration
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan migrate
```

### Revenir en arrière
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan migrate:rollback
```

### Rafraîchir entièrement la base de données
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan migrate:fresh --seed
```

### Accéder directement à MySQL
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec mysql mysql -u cesizen_user -p cesizen
# Entrez le mot de passe: password
```

## 🧪 Tests

```bash
# Exécuter les tests
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan test

# Avec coverage
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan test --coverage
```

## 🔄 Rebuild après changements

Si vous modifiez le Dockerfile ou les dépendances:
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev build --no-cache
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev up -d
```

## 📚 Frontend (Vite + React/Vue)

Le frontend s'exécute sur le port 5173:
```bash
# Accès via: http://localhost:5173
```

Pour développer en hot-reload:
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev logs -f frontend
```

## 🚨 Résolution de problèmes

### Port déjà en utilisation
```bash
# Trouver le processus qui utilise le port
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # macOS/Linux

# Ou modifier DB_PORT/NGINX_PORT/FRONTEND_PORT dans .env.dev
```

### Permissions d'accès à la base de données
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel chmod -R 775 storage bootstrap/cache
```

### Réinitialiser complètement
```bash
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev down -v              # -v supprime les volumes
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev up -d --build        # Reconstruire et relancer
docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev exec laravel php artisan migrate --seed
```

## 📖 Documentation

- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 🎯 Environnements TEST et PROD

Ce fichier ne couvre que l'environnement DEV local. Les environnements TEST et PROD tournent en
parallèle sur le même poste via des stacks isolées (ports, projet Compose, volumes distincts) et
sont gérés par la CD (`scripts/local-deploy.sh --env test|prod`). Voir le README, section
"Environnements Docker Compose", pour le tableau des ports et les commandes de démarrage manuel.
