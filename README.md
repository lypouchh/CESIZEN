# CESIZEN

Application web CESIZEN (backend Laravel + frontend Vite/React) avec un workflow Git propre et des controles qualite au commit.

![CI](https://github.com/lypouchh/CESIZEN/actions/workflows/ci.yml/badge.svg?branch=main)
![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=SONAR_PROJECT_KEY&metric=alert_status)

## Workflow Git

### Strategie de branches
- `main`: branche stable de production
- `develop`: branche d'integration
- `feature/*`: nouvelles fonctionnalites, creees depuis `develop`
- `hotfix/*`: corrections urgentes, creees depuis `main`

### Flux recommande
1. Mettre a jour `develop`.
2. Creer une branche `feature/...` depuis `develop`.
3. Commiter en Conventional Commits.
4. Ouvrir une Pull Request vers `develop`.
5. Merger `develop` vers `main` via PR de release.

Exemple:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/ma-fonctionnalite
```

## Qualite des commits (Husky + Commitlint)

Le depot utilise Husky a la racine.

Hooks actifs:
- `.husky/pre-commit`: execute `npm run lint:staged`
- `.husky/commit-msg`: execute `npx commitlint --edit "$1"`

Scripts racine:
- `prepare`: `husky install`
- `lint`: `npm --prefix frontend run lint`
- `lint:staged`: lint uniquement les fichiers JS/JSX stages dans `frontend/`

Exemples de messages acceptes:
- `feat: add breathing session history`
- `fix: handle expired auth token`
- `docs: update docker startup guide`

## Protection des branches (GitHub)

Recommande pour `main` et `develop`:
- Require a pull request before merging
- Require status checks to pass before merging
- Restrict direct push
- Require approvals (selon votre organisation)

## Integration Continue (CI)

Le pipeline GitHub Actions est defini pour tourner sur un runner local self-hosted:
- Declencheurs: push et pull_request sur develop et main
- Jobs: backend tests, frontend lint/build/tests, scan SonarCloud + Quality Gate

Fichier pipeline:
- .github/workflows/ci.yml

### Secrets GitHub requis (SonarCloud)
- SONAR_TOKEN
- SONAR_ORG
- SONAR_PROJECT_KEY

Si les secrets SonarCloud ne sont pas configures, le job Sonar est ignore, mais les jobs backend/frontend continuent de tourner.

### Installation rapide du runner local GitHub
1. Ouvrir Settings > Actions > Runners > New self-hosted runner.
2. Choisir Linux x64 et suivre les commandes proposees sur la machine locale.
3. Lancer le runner puis verifier qu il apparait en status Online.

Exemple commandes Linux (adapte depuis GitHub):
```bash
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64.tar.gz
tar xzf ./actions-runner-linux-x64.tar.gz
./config.sh --url https://github.com/lypouchh/CESIZEN --token <RUNNER_TOKEN>
./run.sh
```

## Authentification API (JWT)

Le backend Laravel utilise des JWT courts avec refresh token rotatif:
- `access_token` JWT (duree courte, `JWT_TTL=15` minutes)
- `refresh_token` opaque stocke cote serveur sous forme hachee et envoye en cookie `HttpOnly`

Endpoints auth:
- `POST /api/login`
- `POST /api/register`
- `POST /api/refresh`
- `POST /api/logout`
- `GET /api/user` (route protegee)

Configuration principale dans `backend/.env`:
- `JWT_SECRET`
- `JWT_TTL`
- `JWT_REFRESH_TOKEN_TTL`
- `JWT_REFRESH_COOKIE_NAME`

## Lancement du projet avec Docker

## Prerequis
- Docker Desktop (ou Docker Engine + Compose)
- Git

### Demarrage rapide

Windows:
```bash
docker-init.bat
```

macOS / Linux:
```bash
chmod +x docker-init.sh
./docker-init.sh
```

Manuel:
```bash
docker-compose up -d
docker-compose exec laravel php artisan migrate
docker-compose exec laravel php artisan db:seed
```

### Acces services
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- MySQL: localhost:3306

### Commandes utiles
```bash
docker-compose ps
docker-compose logs -f
docker-compose down
docker-compose exec laravel php artisan test
```

Pour la doc Docker detaillee, voir `DOCKER_SETUP.md`.
