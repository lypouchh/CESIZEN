# CESIZEN

Application web CESIZEN (backend Laravel + frontend Vite/React) avec un workflow GitFlow, une CI auto-hebergee et une separation explicite entre CI et CD.

![CI](https://github.com/lypouchh/CESIZEN/actions/workflows/ci.yml/badge.svg?branch=main)
![SonarCloud](https://sonarcloud.io/api/project_badges/measure?project=lypouchh_CESIZEN&metric=alert_status)

## Organisation Git

### Strategie de branches
- `main`: branche stable de production
- `develop`: branche d'integration
- `feature/ci-pipeline`: branche de travail principale pour la mise en place de la CI
- `feature/*`: autres fonctionnalites, creees depuis `develop`
- `hotfix/*`: corrections urgentes, creees depuis `main`

### Flux recommande
1. Partir de `main` pour creer ou mettre a jour `develop`.
2. Creer une branche `feature/...` pour une evolution ciblee.
3. Commiter en Conventional Commits.
4. Ouvrir une Pull Request vers la branche cible.
5. Fusionner uniquement via Pull Request apres revue et checks verts.

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
4. La CI de ce depot s'exécute sur la machine locale via ce runner auto-heberge.

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

Note importante: ce pipeline genere le script mais ne l'applique pas. L'application du script appartient au deploiement.

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
- exiger les checks CI suivants: `CI/backend-tests (pull_request)`, `CI/frontend-quality (pull_request)`, `CI/migration-sql (pull_request)`, `SonarCloud Code Analysis`
- exiger une Quality Gate verte via SonarCloud

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

### Image publiee
- Registre: `ghcr.io/lypouchh/cesizen-backend`
- Tags publies: `latest` sur `main`, tag de branche et tag SHA sur les pushes CI

Prerequis:
- Docker Desktop (ou Docker Engine + Compose)
- Git

Demarrage rapide:
```bash
chmod +x docker-init.sh
./docker-init.sh
```

Execution standardisee avec Docker Compose:
```bash
docker compose up -d --build
```

Execution de l'environnement de production avec l'image distante:
```bash
docker compose -f docker-compose.prod.yml up -d
```

Commandes utiles:
```bash
docker-compose ps
docker-compose logs -f
docker-compose down
docker-compose exec laravel php artisan test
```

Conditions d'execution du pipeline Docker:
- runner local self-hosted
- secret GitHub natif pour publier dans GHCR (`GITHUB_TOKEN` avec permission `packages: write`)
- execution sur `push` vers `main` / `develop` et via `workflow_dispatch`
- verification apres build par un smoke test sur l'image poussee

Badge pipeline Docker:
![Docker CI](https://github.com/lypouchh/CESIZEN/actions/workflows/ci.yml/badge.svg?branch=main)

Pour la documentation Docker detaillee, voir `DOCKER_SETUP.md`.
