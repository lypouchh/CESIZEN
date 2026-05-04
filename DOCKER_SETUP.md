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
docker-compose up -d
docker-compose exec laravel php artisan migrate
docker-compose exec laravel php artisan db:seed
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

Pour modifier les ports ou les identifiants MySQL, éditez le fichier `docker-compose.yml`.

## 🛠️ Commandes utiles

### Afficher les logs
```bash
docker-compose logs -f          # Tous les services
docker-compose logs -f laravel  # Seulement Laravel
docker-compose logs -f mysql    # Seulement MySQL
```

### Accéder au shell
```bash
docker-compose exec laravel bash        # Shell Laravel
docker-compose exec mysql bash          # Shell MySQL
docker-compose exec laravel php artisan # Commandes Artisan
```

### Exécuter des commandes Artisan
```bash
docker-compose exec laravel php artisan migrate
docker-compose exec laravel php artisan db:seed
docker-compose exec laravel php artisan tinker
docker-compose exec laravel php artisan test
```

### Gestion des containers
```bash
docker-compose up -d        # Démarrer les services
docker-compose down         # Arrêter les services
docker-compose restart      # Redémarrer les services
docker-compose ps           # Afficher l'état des services
docker-compose build        # Reconstruire les images
```

## 🗄️ Gestion de la base de données

### Effectuer une migration
```bash
docker-compose exec laravel php artisan migrate
```

### Revenir en arrière
```bash
docker-compose exec laravel php artisan migrate:rollback
```

### Rafraîchir entièrement la base de données
```bash
docker-compose exec laravel php artisan migrate:fresh --seed
```

### Accéder directement à MySQL
```bash
docker-compose exec mysql mysql -u cesizen_user -p cesizen
# Entrez le mot de passe: password
```

## 🧪 Tests

```bash
# Exécuter les tests
docker-compose exec laravel php artisan test

# Avec coverage
docker-compose exec laravel php artisan test --coverage
```

## 🔄 Rebuild après changements

Si vous modifiez le Dockerfile ou les dépendances:
```bash
docker-compose build --no-cache
docker-compose up -d
```

## 📚 Frontend (Vite + React/Vue)

Le frontend s'exécute sur le port 5173:
```bash
# Accès via: http://localhost:5173
```

Pour développer en hot-reload:
```bash
docker-compose logs -f frontend
```

## 🚨 Résolution de problèmes

### Port déjà en utilisation
```bash
# Trouver le processus qui utilise le port
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # macOS/Linux

# Ou modifier le port dans docker-compose.yml
```

### Permissions d'accès à la base de données
```bash
docker-compose exec laravel chmod -R 775 storage bootstrap/cache
```

### Réinitialiser complètement
```bash
docker-compose down -v              # -v supprime les volumes
docker-compose up -d --build        # Reconstruire et relancer
docker-compose exec laravel php artisan migrate --seed
```

## 📖 Documentation

- [Laravel Documentation](https://laravel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## 🎯 Production

Pour déployer en production:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Note**: Assurez-vous de configurer les variables d'environnement appropriées avant le déploiement.
