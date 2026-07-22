#!/bin/bash

# Script d'initialisation Docker pour CESIZEN (environnement DEV)

set -e

COMPOSE="docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev"

echo "🚀 Initialisation de CESIZEN avec Docker..."

# Copier le .env
if [ ! -f backend/.env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.docker backend/.env
fi

# Construire et lancer les containers
echo "🐳 Lancement des services Docker..."
$COMPOSE up -d --build

# Attendre que MySQL soit prêt
echo "⏳ Attente du service MySQL..."
sleep 10

# Générer la clé Laravel si nécessaire
echo "🔑 Génération de la clé Laravel..."
$COMPOSE exec -T laravel php artisan key:generate --force || true

# Exécuter les migrations
echo "🗄️ Exécution des migrations..."
$COMPOSE exec -T laravel php artisan migrate --force

# Exécuter les seeders (optionnel)
echo "🌱 Exécution des seeders..."
$COMPOSE exec -T laravel php artisan db:seed

# Créer les liens de stockage
echo "🔗 Création des liens de stockage..."
$COMPOSE exec -T laravel php artisan storage:link || true

echo ""
echo "✅ CESIZEN est prêt!"
echo ""
echo "📋 Services disponibles:"
echo "  - Backend API: http://localhost:8000"
echo "  - Frontend: http://localhost:5173"
echo "  - MySQL: localhost:3306"
echo ""
echo "📚 Commandes utiles:"
echo "  - Afficher les logs: $COMPOSE logs -f"
echo "  - Accéder au shell Laravel: $COMPOSE exec laravel bash"
echo "  - Arrêter les services: $COMPOSE down"
echo "  - Redémarrer les services: $COMPOSE restart"
