# CESIZEN

Application web CESIZEN (backend Laravel + frontend Vite/React) avec un workflow Git propre et des controles qualite au commit.

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
