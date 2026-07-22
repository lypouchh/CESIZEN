@echo off
REM Script d'initialisation Docker pour CESIZEN (Windows, environnement DEV)

setlocal enabledelayedexpansion

set COMPOSE=docker compose --env-file .env.dev -f docker-compose.dev.yml -p cesizen-dev

echo 🚀 Initialisation de CESIZEN avec Docker...

REM Copier le .env
if not exist "backend\.env" (
    echo 📝 Creation du fichier .env...
    copy .env.docker backend\.env
)

REM Construire et lancer les containers
echo 🐳 Lancement des services Docker...
%COMPOSE% up -d --build

REM Attendre que MySQL soit prêt
echo ⏳ Attente du service MySQL...
timeout /t 10 /nobreak

REM Générer la clé Laravel
echo 🔑 Generation de la cle Laravel...
%COMPOSE% exec -T laravel php artisan key:generate --force >nul 2>&1 || true

REM Exécuter les migrations
echo 🗄️ Execution des migrations...
%COMPOSE% exec -T laravel php artisan migrate --force

REM Exécuter les seeders
echo 🌱 Execution des seeders...
%COMPOSE% exec -T laravel php artisan db:seed

REM Créer les liens de stockage
echo 🔗 Creation des liens de stockage...
%COMPOSE% exec -T laravel php artisan storage:link >nul 2>&1 || true

echo.
echo ✅ CESIZEN est pret!
echo.
echo 📋 Services disponibles:
echo   - Backend API: http://localhost:8000
echo   - Frontend: http://localhost:5173
echo   - MySQL: localhost:3306
echo.
echo 📚 Commandes utiles:
echo   - Afficher les logs: %COMPOSE% logs -f
echo   - Acceder au shell Laravel: %COMPOSE% exec laravel bash
echo   - Arreter les services: %COMPOSE% down
echo   - Redemarrer les services: %COMPOSE% restart
echo.
pause
