#!/bin/bash

# Utilitaire Docker pour CESIZEN (environnement DEV)

COMPOSE="docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev"

case "$1" in
    up)
        $COMPOSE up -d
        ;;
    down)
        $COMPOSE down
        ;;
    logs)
        $COMPOSE logs -f ${2:-}
        ;;
    shell)
        $COMPOSE exec laravel bash
        ;;
    artisan)
        $COMPOSE exec laravel php artisan "${@:2}"
        ;;
    migrate)
        $COMPOSE exec laravel php artisan migrate ${@:2}
        ;;
    seed)
        $COMPOSE exec laravel php artisan db:seed ${@:2}
        ;;
    fresh)
        $COMPOSE exec laravel php artisan migrate:fresh --seed
        ;;
    test)
        $COMPOSE exec laravel php artisan test ${@:2}
        ;;
    tinker)
        $COMPOSE exec laravel php artisan tinker
        ;;
    mysql)
        $COMPOSE exec mysql mysql -u cesizen_user -p"$(grep -m1 '^DB_PASSWORD=' .env.dev | cut -d= -f2)" cesizen_dev
        ;;
    rebuild)
        $COMPOSE build --no-cache ${2:-}
        $COMPOSE up -d
        ;;
    clean)
        $COMPOSE down -v
        ;;
    *)
        echo "Commandes disponibles:"
        echo "  docker-util.sh up           - Démarrer les services"
        echo "  docker-util.sh down         - Arrêter les services"
        echo "  docker-util.sh logs [service] - Afficher les logs"
        echo "  docker-util.sh shell        - Shell Laravel"
        echo "  docker-util.sh artisan [cmd] - Exécuter une commande Artisan"
        echo "  docker-util.sh migrate      - Exécuter les migrations"
        echo "  docker-util.sh seed         - Exécuter les seeders"
        echo "  docker-util.sh fresh        - Rafraîchir la base de données"
        echo "  docker-util.sh test         - Exécuter les tests"
        echo "  docker-util.sh tinker       - Lancer Tinker"
        echo "  docker-util.sh mysql        - Accéder à MySQL"
        echo "  docker-util.sh rebuild      - Reconstruire les images"
        echo "  docker-util.sh clean        - Supprimer les volumes"
        ;;
esac
