# Cahier de recette - CESIZEN

## 1. Objectif
Valider les scenarios fonctionnels critiques du projet CESIZEN avec des cas complets (preconditions, etapes, resultat attendu).

## 2. Environnement
- Frontend: http://localhost:5173
- API: http://localhost:8000
- Base de donnees: MySQL Docker

## 3. Scenarios de recette complets

### Scenario R01 - Inscription utilisateur valide
- Type: Fonctionnel
- Priorite: Haute
- Preconditions:
  - API accessible
  - Email non utilise
- Etapes:
  1. Ouvrir la page d'inscription
  2. Saisir prenom, nom, email, mot de passe et confirmation
  3. Accepter les conditions
  4. Soumettre le formulaire
- Resultat attendu:
  - Compte cree
  - Token recu et session active
  - Redirection vers le profil

### Scenario R02 - Inscription avec email deja utilise
- Type: Non-regression
- Priorite: Haute
- Preconditions:
  - Un compte existe deja avec cet email
- Etapes:
  1. Refaire une inscription avec le meme email
- Resultat attendu:
  - Message d'erreur de validation email
  - Aucun nouveau compte cree

### Scenario R03 - Connexion valide
- Type: Fonctionnel
- Priorite: Haute
- Preconditions:
  - Utilisateur existant actif
- Etapes:
  1. Ouvrir la page login
  2. Saisir email/mot de passe corrects
  3. Soumettre
- Resultat attendu:
  - Authentification reussie
  - Redirection profil

### Scenario R04 - Connexion invalide
- Type: Non-regression
- Priorite: Haute
- Preconditions:
  - Utilisateur existant
- Etapes:
  1. Saisir mot de passe incorrect
  2. Soumettre
- Resultat attendu:
  - Message "identifiants incorrects"
  - Pas de connexion

### Scenario R05 - Mise a jour profil
- Type: Fonctionnel
- Priorite: Haute
- Preconditions:
  - Utilisateur connecte
- Etapes:
  1. Modifier prenom/nom/email
  2. Enregistrer
- Resultat attendu:
  - Donnees mises a jour
  - Message de succes

### Scenario R06 - Suppression de compte utilisateur
- Type: Fonctionnel
- Priorite: Moyenne
- Preconditions:
  - Utilisateur connecte
- Etapes:
  1. Cliquer sur suppression compte
  2. Confirmer
- Resultat attendu:
  - Compte supprime
  - Redirection accueil

### Scenario R07 - Super admin cree un admin subordonne
- Type: Fonctionnel
- Priorite: Haute
- Preconditions:
  - Connecte en super admin
- Etapes:
  1. Ouvrir gestion utilisateurs
  2. Remplir formulaire admin subordonne
  3. Soumettre
- Resultat attendu:
  - Admin cree
  - Message succes

### Scenario R08 - Admin standard ne peut pas creer admin
- Type: Non-regression
- Priorite: Haute
- Preconditions:
  - Connecte en admin non super-admin
- Etapes:
  1. Appeler endpoint creation admin
- Resultat attendu:
  - Reponse 403

### Scenario R09 - Admin standard ne gere pas les autres admins
- Type: Non-regression
- Priorite: Haute
- Preconditions:
  - Admin A connecte
  - Admin B existant
- Etapes:
  1. Tenter de desactiver/supprimer Admin B
- Resultat attendu:
  - Refus (403)

### Scenario R10 - Super admin gere un admin subordonne
- Type: Fonctionnel
- Priorite: Haute
- Preconditions:
  - Super admin connecte
  - Admin subordonne existant
- Etapes:
  1. Changer statut admin subordonne
  2. Supprimer admin subordonne
- Resultat attendu:
  - Operation autorisee
  - Etat mis a jour

### Scenario R11 - Sauvegarde session respiration utilisateur authentifie
- Type: Fonctionnel
- Priorite: Haute
- Preconditions:
  - Utilisateur connecte
  - Exercice existant
- Etapes:
  1. Lancer une seance
  2. Poster la session
- Resultat attendu:
  - Session creee (201)
  - Liaison correcte user/exercice

### Scenario R12 - Interdiction d'ecrire une session pour un autre utilisateur
- Type: Non-regression
- Priorite: Haute
- Preconditions:
  - Utilisateur connecte
  - ID utilisateur different
- Etapes:
  1. Tenter un POST /sessions avec un autre id_user
- Resultat attendu:
  - Refus 403

### Scenario R13 - Tableau de bord profil sans session
- Type: Fonctionnel
- Priorite: Moyenne
- Preconditions:
  - Utilisateur connecte sans session
- Etapes:
  1. Ouvrir profil
- Resultat attendu:
  - Message "Aucune seance"
  - Aucun crash

### Scenario R14 - Page de deconnexion
- Type: Non-regression
- Priorite: Basse
- Preconditions:
  - Utilisateur connecte
- Etapes:
  1. Se deconnecter
- Resultat attendu:
  - Redirection vers /logged-out
  - Message de confirmation visible

### Scenario R15 - Demande de reinitialisation mot de passe
- Type: Fonctionnel
- Priorite: Moyenne
- Preconditions:
  - Compte existant
- Etapes:
  1. Ouvrir "mot de passe oublie"
  2. Saisir un email valide
  3. Soumettre
- Resultat attendu:
  - Reponse de prise en compte
  - Aucun crash UI/API

### Scenario R16 - Reinitialisation mot de passe avec token valide
- Type: Fonctionnel
- Priorite: Moyenne
- Preconditions:
  - Token de reinitialisation valide
- Etapes:
  1. Ouvrir la page reset avec token
  2. Saisir nouveau mot de passe + confirmation
  3. Soumettre
- Resultat attendu:
  - Mot de passe mis a jour
  - Connexion possible avec le nouveau mot de passe

### Scenario R17 - Changement mot de passe utilisateur connecte
- Type: Non-regression
- Priorite: Haute
- Preconditions:
  - Utilisateur connecte
- Etapes:
  1. Ouvrir "changer mot de passe"
  2. Saisir mot de passe actuel + nouveau + confirmation
  3. Soumettre
- Resultat attendu:
  - Mise a jour effective
  - Ancien mot de passe invalide ensuite

### Scenario R18 - Consultation de la liste d'articles publics
- Type: Fonctionnel
- Priorite: Moyenne
- Preconditions:
  - Articles publies en base
- Etapes:
  1. Ouvrir la page informations/articles
- Resultat attendu:
  - Liste chargee
  - Navigation possible vers le detail

### Scenario R19 - Consultation detail d'un article public
- Type: Fonctionnel
- Priorite: Moyenne
- Preconditions:
  - Article existant
- Etapes:
  1. Ouvrir /article/:id
- Resultat attendu:
  - Contenu article affiche
  - Erreur geree proprement si id invalide

### Scenario R20 - Ajout d'un article en favoris
- Type: Fonctionnel
- Priorite: Moyenne
- Preconditions:
  - Utilisateur connecte
  - Article existant
- Etapes:
  1. Ajouter l'article aux favoris
  2. Ouvrir la liste des favoris
- Resultat attendu:
  - Article present dans les favoris

### Scenario R21 - Retrait d'un article des favoris
- Type: Non-regression
- Priorite: Moyenne
- Preconditions:
  - Utilisateur connecte
  - Article deja en favori
- Etapes:
  1. Retirer l'article des favoris
  2. Verifier la liste des favoris
- Resultat attendu:
  - Article absent de la liste

### Scenario R22 - Creation article par admin
- Type: Fonctionnel
- Priorite: Haute
- Preconditions:
  - Admin connecte
- Etapes:
  1. Ouvrir ajout article
  2. Saisir les champs requis
  3. Soumettre
- Resultat attendu:
  - Article cree
  - Visible dans la liste admin/public

### Scenario R23 - Edition article par admin
- Type: Fonctionnel
- Priorite: Haute
- Preconditions:
  - Admin connecte
  - Article existant
- Etapes:
  1. Ouvrir edition article
  2. Modifier les donnees
  3. Sauvegarder
- Resultat attendu:
  - Modifications persistantes

### Scenario R24 - Suppression article par admin
- Type: Fonctionnel
- Priorite: Haute
- Preconditions:
  - Admin connecte
  - Article existant
- Etapes:
  1. Supprimer l'article
- Resultat attendu:
  - Article supprime de la base et des listes

### Scenario R25 - Interdiction CRUD article pour non admin
- Type: Non-regression
- Priorite: Haute
- Preconditions:
  - Utilisateur non admin connecte
- Etapes:
  1. Appeler endpoints de creation/modification/suppression article
- Resultat attendu:
  - Refus 403 sur operations admin

### Scenario R26 - Consultation liste exercices publics
- Type: Fonctionnel
- Priorite: Moyenne
- Preconditions:
  - Exercices existants
- Etapes:
  1. Appeler/consulter la liste des exercices
- Resultat attendu:
  - Donnees visibles sans role admin

### Scenario R27 - CRUD exercices par admin
- Type: Fonctionnel
- Priorite: Haute
- Preconditions:
  - Admin connecte
- Etapes:
  1. Creer un exercice
  2. Modifier l'exercice
  3. Supprimer l'exercice
- Resultat attendu:
  - CRUD operationnel avec persistance

### Scenario R28 - Interdiction CRUD exercices pour non admin
- Type: Non-regression
- Priorite: Haute
- Preconditions:
  - Utilisateur non admin connecte
- Etapes:
  1. Appeler endpoints admin d'exercices
- Resultat attendu:
  - Refus 403

### Scenario R29 - Filtrage sessions par utilisateur (invite)
- Type: Fonctionnel
- Priorite: Moyenne
- Preconditions:
  - Sessions existantes pour plusieurs utilisateurs
- Etapes:
  1. Appeler GET /sessions?id_user=X sans authentification
- Resultat attendu:
  - Sessions du user X uniquement

### Scenario R30 - Filtrage sessions force a l'utilisateur courant (authentifie)
- Type: Non-regression
- Priorite: Haute
- Preconditions:
  - Utilisateur connecte
  - Sessions existantes pour d'autres utilisateurs
- Etapes:
  1. Appeler GET /sessions?id_user=AUTRE_ID
- Resultat attendu:
  - Retour limite aux sessions de l'utilisateur connecte

## 4. Regles de validation
- Un scenario est "OK" si le resultat attendu est constate sans anomalie bloquante
- Un scenario est "KO" sinon
- Les anomalies sont documentees avec severite et correctif associe
- La couverture est consideree complete si chaque fonctionnalite exposee par les routes frontend/api dispose d'au moins un scenario nominal et un scenario de non-regression quand applicable
