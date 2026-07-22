@echo off
REM Utilitaire Docker pour CESIZEN (Windows, environnement DEV)

setlocal enabledelayedexpansion

set COMPOSE=docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev

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
    %COMPOSE% up -d
    goto :eof
)

if "%1"=="down" (
    %COMPOSE% down
    goto :eof
)

if "%1"=="logs" (
    if "%2"=="" (
        %COMPOSE% logs -f
    ) else (
        %COMPOSE% logs -f %2
    )
    goto :eof
)

if "%1"=="shell" (
    %COMPOSE% exec laravel bash
    goto :eof
)

if "%1"=="artisan" (
    %COMPOSE% exec laravel php artisan %2 %3 %4 %5 %6 %7 %8 %9
    goto :eof
)

if "%1"=="migrate" (
    %COMPOSE% exec laravel php artisan migrate
    goto :eof
)

if "%1"=="seed" (
    %COMPOSE% exec laravel php artisan db:seed
    goto :eof
)

if "%1"=="fresh" (
    %COMPOSE% exec laravel php artisan migrate:fresh --seed
    goto :eof
)

if "%1"=="test" (
    %COMPOSE% exec laravel php artisan test
    goto :eof
)

if "%1"=="tinker" (
    %COMPOSE% exec laravel php artisan tinker
    goto :eof
)

if "%1"=="mysql" (
    %COMPOSE% exec mysql mysql -u cesizen_user -p cesizen_dev
    goto :eof
)

if "%1"=="rebuild" (
    if "%2"=="" (
        %COMPOSE% build --no-cache
    ) else (
        %COMPOSE% build --no-cache %2
    )
    %COMPOSE% up -d
    goto :eof
)

if "%1"=="clean" (
    %COMPOSE% down -v
    goto :eof
)

echo Commande non reconnue: %1
