# CESIZEN - Workflow Git propre (TP1)

Ce document formalise les regles Git et les controles qualite mis en place sur le depot.

## 1) Strategie Git (GitFlow simplifie)

Branches principales:
- `main`: branche de production (stable)
- `develop`: branche d'integration

Branches temporaires:
- `feature/*`: developpement de fonctionnalites (base sur `develop`)
- `hotfix/*`: correction urgente (base sur `main`)

Workflow recommande:
1. Creer une branche feature depuis `develop`.
2. Commiter avec une convention Conventional Commits.
3. Ouvrir une Pull Request vers `develop`.
4. Faire valider la PR, puis merger.
5. Merger `develop` vers `main` uniquement via PR de release.

Commandes utilisees pour ce TP:
```bash
git checkout -b develop origin/main
git push -u origin develop
git checkout -b feature/init-husky develop
```

## 2) Convention de commit

Le projet applique Conventional Commits via `commitlint`.

Formats acceptes (exemples):
- `feat: add login form validation`
- `fix: handle null profile picture`
- `chore: update dependencies`
- `docs: add deployment checklist`
- `refactor: simplify auth service`
- `test: add profile page tests`

Un message non conforme (ex: `update code`) est refuse au commit.

## 3) Hooks Husky actifs

Husky est configure a la racine du depot.

Hooks:
- `.husky/pre-commit`: execute `npm run lint:staged`
- `.husky/commit-msg`: execute `npx commitlint --edit "$1"`

Scripts NPM racine:
- `prepare`: `husky install`
- `lint`: `npm --prefix frontend run lint`
- `lint:staged`: lint uniquement les fichiers JS/JSX stages dans `frontend/`

## 4) Protection de branches (GitHub)

A configurer dans `Settings > Branches` sur `main` et `develop`:
- Require a pull request before merging
- Require status checks to pass before merging
- Require approvals (au moins 1 reviewer)
- Restrict who can push to matching branches (ou bloquer push direct)
- (Optionnel) Require linear history

## 5) Livrables TP1

- [x] Branches `main`, `develop`, `feature/init-husky`
- [x] Husky installe et hooks actifs
- [x] Verification de message de commit avec commitlint
- [x] Fichier `commitlint.config.js`
- [ ] Screenshots des protections de branches (a faire dans GitHub)
- [ ] Pull Request `feature/init-husky` -> `develop` (a ouvrir)
