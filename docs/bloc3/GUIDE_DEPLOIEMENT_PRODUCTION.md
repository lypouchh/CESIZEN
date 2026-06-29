# Guide de deploiement production - CESIZEN

Date de mise a jour: 27/05/2026

## 1. Objectif

Ce document decrit un deploiement reel de CESIZEN en production avec:

- URL publique
- HTTPS actif
- base de donnees persistante
- verification post-deploiement

## 2. Prerequis

1. Un serveur Linux accessible en SSH (VPS ou cloud).
2. Docker Engine + Docker Compose plugin installes.
3. Un nom de domaine pointe vers l'IP du serveur (enregistrement A/AAAA).
4. Acces GitHub au depot.
5. Certificats TLS disponibles:
- `fullchain.pem`
- `privkey.pem`

## 3. Arborescence cible sur le serveur

Exemple:

```bash
mkdir -p /opt/cesizen
cd /opt/cesizen
git clone https://github.com/lypouchh/CESIZEN.git .
git checkout main
git pull origin main
```

## 4. Variables d'environnement de production

Creer un fichier `.env.prod` a la racine du projet (ne pas versionner):

```env
DB_DATABASE=cesizen
DB_USERNAME=cesizen_user
DB_PASSWORD=CHANGE_ME_DB_PASSWORD
DB_ROOT_PASSWORD=CHANGE_ME_DB_ROOT_PASSWORD

APP_URL=https://ton-domaine.fr
CORS_ALLOWED_ORIGINS=https://ton-domaine.fr

# Cle Laravel de prod
APP_KEY=base64:CHANGE_ME_APP_KEY
```

Notes:

1. Utiliser des mots de passe forts et uniques.
2. `APP_KEY` peut etre generee localement via `php artisan key:generate --show`.
3. Ne jamais commiter ce fichier.

## 5. Certificats TLS

Placer les certificats dans:

- `backend/docker/nginx/ssl/fullchain.pem`
- `backend/docker/nginx/ssl/privkey.pem`

La configuration Nginx production utilise deja:

1. redirection HTTP vers HTTPS
2. ecoute en 443 avec TLS 1.2/1.3

Reference configuration: `backend/docker/nginx/prod/app.conf`.

## 6. Demarrage production

Depuis la racine du projet:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

Verifier l'etat:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml ps
```

## 7. Initialisation Laravel apres deploiement

Executer:

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T laravel php artisan migrate --force
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T laravel php artisan config:cache
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T laravel php artisan route:cache
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T laravel php artisan view:cache
```

Optionnel (si besoin):

```bash
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T laravel php artisan storage:link
```

## 8. Verification post-deploiement

### 8.1 Verification technique

```bash
curl -I http://ton-domaine.fr
curl -I https://ton-domaine.fr
docker compose --env-file .env.prod -f docker-compose.prod.yml logs --tail=200 nginx
docker compose --env-file .env.prod -f docker-compose.prod.yml logs --tail=200 laravel
```

Attendus:

1. HTTP renvoie une redirection vers HTTPS.
2. HTTPS repond sans erreur TLS.
3. Les conteneurs `nginx`, `laravel`, `mysql` sont `Up`.

### 8.2 Verification fonctionnelle

1. Ouvrir l'application sur l'URL HTTPS.
2. Tester login/logout.
3. Tester un endpoint protege (admin/non admin).
4. Verifier le parcours principal frontend.

## 9. Procedure de mise a jour (release suivante)

```bash
cd /opt/cesizen
git fetch origin
git checkout main
git pull origin main
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.prod -f docker-compose.prod.yml exec -T laravel php artisan migrate --force
```

## 10. Rollback simple

1. Revenir au commit precedent stable:

```bash
git log --oneline -n 5
git checkout <commit_stable>
docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build
```

2. Verifier a nouveau les endpoints HTTP/HTTPS et les logs.

## 11. Preuves a capturer pour le dossier

1. Screenshot URL HTTPS accessible.
2. Sortie `docker compose ... ps`.
3. Sortie `curl -I http://...` (301/308) et `curl -I https://...`.
4. Capture execution migration en prod.
5. Capture checks CI au vert.
