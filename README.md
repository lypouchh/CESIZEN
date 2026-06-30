# CESIZEN

Application web CESIZEN (backend Laravel + frontend Vite/React) avec un workflow GitFlow, une CI auto-hebergee et une separation explicite entre CI et CD.

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

## Integration Continue (CI)

Fichier pipeline CI: `.github/workflows/ci.yml`

Le pipeline CI tourne sur un runner local self-hosted (`[self-hosted, linux]`) et couvre:
- installation des dependances backend/frontend
- tests backend (`php artisan test`)
- lint, tests et build frontend
- analyse SonarCloud + Quality Gate
- generation d'un script SQL de migration publie en artefact

Declencheurs:
- `push` et `pull_request` sur `develop` et `main`
- `workflow_dispatch`

### Secrets SonarCloud requis
- `SONAR_TOKEN`
- `SONAR_ORG`
- `SONAR_PROJECT_KEY`

### Runner local (self-hosted)
1. Ouvrir GitHub: Settings > Actions > Runners > New self-hosted runner.
2. Choisir Linux x64 et executer les commandes fournies.
3. Verifier que le runner est `Online` avant de lancer la CI.

## Migration SQL en CI (artefact)

Le pipeline CI genere un script SQL de migration sans l'appliquer sur une base reelle.

Script utilise:
- `scripts/generate-migration-sql.sh`

Ce script:
1. cree une base SQLite de travail en CI,
2. genere le SQL de migration en mode `--pretend`,
3. ecrit le resultat dans `backend/artifacts/migration.sql`.

Publication artefact:
- nom artefact: `migration-sql-script`
- fichier: `backend/artifacts/migration.sql`

Recuperation:
1. Ouvrir un run CI GitHub Actions.
2. Aller dans la section Artifacts.
3. Telecharger `migration-sql-script`.

## Separation CI / CD

### CI (dans ce projet)
- build, lint, tests, analyse SonarCloud
- generation et publication de l'artefact SQL de migration
- aucune application automatique de migration sur un environnement reel

### CD (dans ce projet)
Fichier pipeline CD: `.github/workflows/cd.yml`

- workflow de deploiement separe du pipeline CI
- declenchement manuel (`workflow_dispatch`) ou sur tag `v*`
- rappel explicite: le SQL de migration est produit par la CI mais son application est une operation de deploiement controlee, jamais automatique sur une PR

## Protection des branches (GitHub)

Configuration recommandee sur `main` et `develop`:
- interdire les push directs
- exiger une PR approuvee
- exiger les checks CI
- exiger une Quality Gate verte

## Authentification API (JWT)

Le backend Laravel utilise des JWT courts avec refresh token rotatif:
- `access_token` JWT (duree courte)
- `refresh_token` stocke cote serveur sous forme hachee et envoye en cookie `HttpOnly`

Variables principales:
- `JWT_SECRET`
- `JWT_TTL`
- `JWT_REFRESH_TOKEN_TTL`
- `JWT_REFRESH_COOKIE_NAME`

## Lancement avec Docker

Prerequis:
- Docker Desktop (ou Docker Engine + Compose)
- Git

Demarrage rapide:
```bash
chmod +x docker-init.sh
./docker-init.sh
```

Commandes utiles:
```bash
docker-compose ps
docker-compose logs -f
docker-compose down
docker-compose exec laravel php artisan test
```

Pour la documentation Docker detaillee, voir `DOCKER_SETUP.md`.
