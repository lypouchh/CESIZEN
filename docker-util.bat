@echo off
REM Utilitaire Docker pour CESIZEN (Windows)

setlocal enabledelayedexpansion

if "%1"=="" (
    echo Commandes disponibles:
    echo   docker-util.bat up           - Demarrer les services
    echo   docker-util.bat down         - Arreter les services
    echo   docker-util.bat logs [service] - Afficher les logs
    echo   docker-util.bat shell        - Shell Laravel
    echo   docker-util.bat artisan [cmd] - Executer une commande Artisan
    echo   docker-util.bat migrate      - Executer les migrations
    echo   docker-util.bat seed         - Executer les seeders
    echo   docker-util.bat fresh        - Rafraichir la base de donnees
    echo   docker-util.bat test         - Executer les tests
    echo   docker-util.bat tinker       - Lancer Tinker
    echo   docker-util.bat mysql        - Acceder a MySQL
    echo   docker-util.bat rebuild      - Reconstruire les images
    echo   docker-util.bat clean        - Supprimer les volumes
    goto :eof
)

if "%1"=="up" (
    docker-compose up -d
    goto :eof
)

if "%1"=="down" (
    docker-compose down
    goto :eof
)

if "%1"=="logs" (
    if "%2"=="" (
        docker-compose logs -f
    ) else (
        docker-compose logs -f %2
    )
    goto :eof
)

if "%1"=="shell" (
    docker-compose exec laravel bash
    goto :eof
)

if "%1"=="artisan" (
    docker-compose exec laravel php artisan %2 %3 %4 %5 %6 %7 %8 %9
    goto :eof
)

if "%1"=="migrate" (
    docker-compose exec laravel php artisan migrate
    goto :eof
)

if "%1"=="seed" (
    docker-compose exec laravel php artisan db:seed
    goto :eof
)

if "%1"=="fresh" (
    docker-compose exec laravel php artisan migrate:fresh --seed
    goto :eof
)

if "%1"=="test" (
    docker-compose exec laravel php artisan test
    goto :eof
)

if "%1"=="tinker" (
    docker-compose exec laravel php artisan tinker
    goto :eof
)

if "%1"=="mysql" (
    docker-compose exec mysql mysql -u cesizen_user -ppassword cesizen
    goto :eof
)

if "%1"=="rebuild" (
    if "%2"=="" (
        docker-compose build --no-cache
    ) else (
        docker-compose build --no-cache %2
    )
    docker-compose up -d
    goto :eof
)

if "%1"=="clean" (
    docker-compose down -v
    goto :eof
)

echo Commande non reconnue: %1
