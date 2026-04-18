# 🚀 CESIZEN - Docker Quick Start

## Installation rapide (Windows)

1. **Assure-toi que Docker Desktop est lancé**
2. **Double-clique sur** `docker-init.bat`
3. **C'est tout!** 🎉

Le script va:
- ✅ Copier la configuration
- ✅ Lancer les services
- ✅ Initialiser la base de données
- ✅ Exécuter les migrations

## Installation rapide (macOS/Linux)

```bash
chmod +x docker-init.sh
./docker-init.sh
```

## URLs d'accès

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:5173 |
| 🔌 Backend API | http://localhost:8000 |
| 💾 MySQL | localhost:3306 |

## Identifiants MySQL

```
Utilisateur: cesizen_user
Mot de passe: password
Base de données: cesizen
```

## Commandes rapides (Windows)

```bash
# Afficher les logs
docker-compose logs -f

# Lancer une commande Artisan
docker-compose exec laravel php artisan migrate

# Accéder au shell Laravel
docker-compose exec laravel bash

# Utiliser le script utilitaire
docker-util.bat shell      # Shell
docker-util.bat migrate    # Migrations
docker-util.bat test       # Tests
docker-util.bat logs       # Logs
```

## Démarrer après arrêt

```bash
docker-compose up -d
```

## Arrêter les services

```bash
docker-compose down
```

## 🆘 Besoin d'aide?

Voir le fichier `DOCKER_SETUP.md` pour la documentation complète.
