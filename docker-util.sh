#!/bin/bash

# Utilitaire Docker pour CESIZEN

case "$1" in
    up)
        docker-compose up -d
        ;;
    down)
        docker-compose down
        ;;
    logs)
        docker-compose logs -f ${2:-}
        ;;
    shell)
        docker-compose exec laravel bash
        ;;
    artisan)
        docker-compose exec laravel php artisan "${@:2}"
        ;;
    migrate)
        docker-compose exec laravel php artisan migrate ${@:2}
        ;;
    seed)
        docker-compose exec laravel php artisan db:seed ${@:2}
        ;;
    fresh)
        docker-compose exec laravel php artisan migrate:fresh --seed
        ;;
    test)
        docker-compose exec laravel php artisan test ${@:2}
        ;;
    tinker)
        docker-compose exec laravel php artisan tinker
        ;;
    mysql)
        docker-compose exec mysql mysql -u cesizen_user -ppassword cesizen
        ;;
    rebuild)
        docker-compose build --no-cache ${2:-}
        docker-compose up -d
        ;;
    clean)
        docker-compose down -v
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
