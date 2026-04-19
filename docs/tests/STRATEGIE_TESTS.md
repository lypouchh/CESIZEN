# Strategie de tests CESIZEN

## 1. Objectif
Cette strategie couvre les tests unitaires, fonctionnels et de non-regression pour garantir la stabilite du prototype CESIZEN et repondre aux exigences du cahier des charges.

## 2. Perimetre
Modules couverts:
- Authentification: inscription, connexion, profil, changement de mot de passe, suppression de compte
- Administration: gestion des utilisateurs, gestion des admins subordonnes, activation/desactivation, suppression
- Respiration: enregistrement des sessions, filtrage par utilisateur, validation des donnees
- Frontend utilisateur: login, register, profile, user management, exercise, confirmation de deconnexion

Hors perimetre actuel:
- Performance charge (test de montee en charge)
- Tests e2e navigateur complet (Cypress/Playwright)

## 3. Typologie des tests
### 3.1 Tests unitaires
But: valider les comportements elementaires et les regles de validation.

Exemples:
- validation d'un payload invalide
- verification des restrictions super admin
- verification des regles de securite sur les sessions

### 3.2 Tests fonctionnels
But: valider les parcours utilisateurs et administrateurs de bout en bout au niveau API/UI.

Exemples:
- inscription -> token retourne -> acces profil
- admin liste utilisateurs -> change statut -> verification du resultat
- utilisateur lance une seance -> sauvegarde seance -> affichage tableau de bord

### 3.3 Tests de non-regression
But: garantir qu'une fonctionnalite deja validee reste conforme apres modification.

Principe applique:
- les tests critiques existants sont conserves
- ajout de tests a chaque nouvelle fonctionnalite (super admin, repetitions, page deconnexion)
- execution complete backend + frontend avant livraison

## 4. Implementation actuelle
### Backend
Fichiers principaux:
- backend/tests/Feature/AuthAndAdminUsersTest.php
- backend/tests/Feature/AuthValidationAndFlowsTest.php
- backend/tests/Feature/SuperAdminManagementTest.php
- backend/tests/Feature/RespirationSessionsApiTest.php

### Frontend
Fichiers principaux:
- frontend/src/pages/Login.test.jsx
- frontend/src/pages/Register.test.jsx
- frontend/src/pages/Profile.test.jsx
- frontend/src/pages/UserManagement.test.jsx
- frontend/src/pages/Exercise.test.jsx
- frontend/src/pages/LoggedOut.test.jsx

## 5. Commandes d'execution
Backend:
```bash
cd backend
php artisan test
```

Frontend:
```bash
cd frontend
npm test -- --run
```

## 6. Resultat de reference (etat actuel)
- Backend: 37 tests passes
- Frontend: 22 tests passes
- Total: 59 tests passes

## 7. Criteres d'acceptation
- 0 test en echec sur backend et frontend
- scenarios critiques couverts: auth, admin, sessions, profil
- non-regression validee avant soutenance

## 8. Traçabilite avec la grille
- Tests unitaires/fonctionnels/non-regression abordes et implementes: OUI
- Scenarii complets (voir cahier): OUI, documentes dans docs/tests/CAHIER_RECETTE.md
- Procedure de validation: OUI, documentee dans docs/tests/PROCEDURE_VALIDATION.md
- Modele de PV de recette: OUI, documente dans docs/tests/PV_RECETTE_MODELE.md
