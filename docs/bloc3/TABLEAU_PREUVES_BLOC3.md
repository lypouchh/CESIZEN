# Tableau de preuves - Bloc 3 (CESIZEN)

Date de mise a jour: 27/05/2026

## 1) Synthese executif

- Suite de tests backend executee: **56/56 OK**
- Suite de tests frontend executee: **36/36 OK**
- CI/CD configuree (tests, lint, build, audit)
- Ticketing configure (anomalies + evolutions)
- HTTPS production configure (80->443 + TLS)

## 2) Preuves par competence

| Domaine | Exigence evaluee | Mise en oeuvre CESIZEN | Preuve technique | Statut |
|---|---|---|---|---|
| Deploiement | Mise en place environnement de deploiement | Docker Compose dev/prod + separation des services | `docker-compose.yml`, `docker-compose.prod.yml` | OK |
| Deploiement | Plan de deploiement | Architecture backend/frontend/mysql et chainage de livraison | `DOCKER_SETUP.md`, `QUICK_START.md` | OK |
| Deploiement | Versioning | Depot GitHub sur branches `dev` et `main` | Historique Git + PR | OK |
| Deploiement | Automatisation CI | Workflow GitHub Actions (backend/frontend/securite) | `.github/workflows/ci.yml` | OK |
| Maintenance | Gestion anomalies | Template bug avec criticite, repro, attendu/observe | `.github/ISSUE_TEMPLATE/bug_report.yml` | OK |
| Maintenance | Gestion evolutions | Template feature avec besoin + criteres d'acceptation | `.github/ISSUE_TEMPLATE/feature_request.yml` | OK |
| Maintenance | Methodologie de traitement | Triage, priorisation P1/P2/P3, recette, cloture | Dossier Bloc 3 (section maintenance) | A presenter |
| Perennite | Veille technologique | Revue dependances + audits NPM/Composer en CI | `.github/workflows/ci.yml` (job `security-audit`) | OK |
| Securisation | Plan de securisation | Durcissement API + CORS + headers + no-new-privileges | Fichiers ci-dessous | OK |
| Securisation | Vulnerabilites et risques | Rate limiting sur endpoints sensibles | `backend/app/Providers/AppServiceProvider.php`, `backend/routes/api.php` | OK |
| Securisation | Donnees personnelles / RGPD | Controle acces, suppression compte, minimisation logs | `backend/app/Http/Controllers/AuthController.php` | Partiel |
| Securisation | Bonnes pratiques dev | Tests auto + revue CI + separation config env | CI + `.env.example` | OK |

## 3) Preuves de tests executes

### Backend

Commande executee:

```bash
cd backend && php artisan test
```

Resultat:

- Tests: **56 passed**
- Assertions: **125**
- Duree: **1.12s**

### Frontend

Commande executee:

```bash
cd frontend && npm run test:run
```

Resultat:

- Test files: **9 passed**
- Tests: **36 passed**
- Duree: **4.75s**

## 4) Preuves de securisation implementees

1. Rate limiting auth
- `backend/app/Providers/AppServiceProvider.php`
- `backend/routes/api.php`

2. Headers de securite middleware
- `backend/app/Http/Middleware/SecurityHeaders.php`
- `backend/bootstrap/app.php`

3. CORS durci
- `backend/app/Http/Middleware/Cors.php`
- `backend/.env.example`

4. Durcissement compose production
- `docker-compose.prod.yml` (`security_opt: no-new-privileges:true`)

5. HTTPS production
- `docker-compose.prod.yml` (ports 80/443)
- `backend/docker/nginx/prod/app.conf`
- `backend/docker/nginx/ssl/README.md`

## 5) Preuves de maintenance et organisation

1. Ticketing
- `.github/ISSUE_TEMPLATE/bug_report.yml`
- `.github/ISSUE_TEMPLATE/feature_request.yml`
- `.github/ISSUE_TEMPLATE/config.yml`

2. Automatisation qualite
- `.github/workflows/ci.yml`

## 6) Points a montrer en soutenance (checklist demo)

1. Lancer les tests backend et montrer `56 passed`.
2. Lancer les tests frontend et montrer `36 passed`.
3. Ouvrir le workflow CI et expliquer chaque job.
4. Creer un ticket bug de demonstration avec le template.
5. Montrer la conf HTTPS (redirect 80->443 + certificats).
6. Conclure avec les risques residuels et plan d'amelioration.

## 7) Risques residuels / actions suivantes

- Mettre en place un certificat Let’s Encrypt en environnement reel.
- Ajouter scan SAST/secret scanning bloqueur dans la CI.
- Formaliser le registre RGPD (finalites, base legale, retention, droits).
- Prevoir runbook incident securite avec matrice d'escalade nominative.
