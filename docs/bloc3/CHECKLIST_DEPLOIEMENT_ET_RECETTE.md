# Checklist deploiement et recette - Bloc 3

Date de mise a jour: 27/05/2026

## 1. Avant deploiement

- [ ] Branche `main` a jour sur le serveur.
- [ ] Fichier `.env.prod` present et complet.
- [ ] Valeurs sensibles differents de la dev (DB, APP_KEY, mots de passe).
- [ ] Certificats TLS poses dans `backend/docker/nginx/ssl/`.
- [ ] Sauvegarde de la base existante (si mise a jour d'une prod deja en ligne).

## 2. Deploiement

- [ ] Lancement stack prod: `docker compose --env-file .env.prod -f docker-compose.prod.yml up -d --build`.
- [ ] Etat conteneurs OK: `docker compose --env-file .env.prod -f docker-compose.prod.yml ps`.
- [ ] Migrations executees avec `--force`.
- [ ] Caches Laravel regeneres (config/route/view).

## 3. Controle securite

- [ ] HTTP redirige vers HTTPS.
- [ ] Certificat valide cote navigateur.
- [ ] API inaccessible sans authentification sur routes protegees.
- [ ] Role admin correctement enforce.
- [ ] Rate limiting operationnel sur endpoints sensibles.

## 4. Recette fonctionnelle minimale

- [ ] Creation de compte (si autorisee) et connexion utilisateur.
- [ ] Deconnexion.
- [ ] Parcours principal frontend valide.
- [ ] Action admin validee avec compte admin.
- [ ] Action admin refusee avec compte non admin.

## 5. Preuves soutenance

- [ ] Capture CI (backend-tests, frontend-quality, security-audit au vert).
- [ ] Capture URL publique en HTTPS.
- [ ] Capture commande `curl -I http://...` montrant redirection.
- [ ] Capture commande `curl -I https://...` montrant reponse valide.
- [ ] Capture logs deploy/migration sans erreur bloquante.

## 6. Cloture

- [ ] Ticket de deploiement cree puis cloture.
- [ ] Version deployee taggee (optionnel mais recommande).
- [ ] Risques residuels notes dans le dossier.
