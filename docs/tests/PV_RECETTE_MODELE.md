# Modele de PV de recette - CESIZEN

## Informations generales
- Version testee:
- Date de recette:
- Environnement:
- Testeur(s):

## Resultat global
- Statut global: VALIDE / NON VALIDE
- Nombre de scenarios OK:
- Nombre de scenarios KO:
- Nombre d'anomalies:

## Tableau de suivi des scenarios
| ID | Scenario | Priorite | Resultat attendu | Resultat observe | Statut (OK/KO) | Commentaire |
|---|---|---|---|---|---|---|
| R01 | Inscription utilisateur valide | Haute | Compte cree + redirection profil |  |  |  |
| R02 | Inscription email deja utilise | Haute | Erreur de validation |  |  |  |
| R03 | Connexion valide | Haute | Connexion + redirection |  |  |  |
| R04 | Connexion invalide | Haute | Message d'erreur |  |  |  |
| R05 | Mise a jour profil | Haute | Donnees mises a jour |  |  |  |
| R06 | Suppression compte | Moyenne | Compte supprime |  |  |  |
| R07 | Creation admin subordonne | Haute | Admin cree |  |  |  |
| R08 | Interdiction creation admin (admin standard) | Haute | 403 |  |  |  |
| R09 | Interdiction gestion autre admin (admin standard) | Haute | 403 |  |  |  |
| R10 | Gestion admin par super admin | Haute | Operation autorisee |  |  |  |
| R11 | Sauvegarde session respiration | Haute | Session creee |  |  |  |
| R12 | Interdiction session autre utilisateur | Haute | 403 |  |  |  |
| R13 | Dashboard profil sans session | Moyenne | Message d'etat vide |  |  |  |
| R14 | Page de deconnexion | Basse | Confirmation deconnexion |  |  |  |

Scenarios complementaires obligatoires pour couverture complete des fonctionnalites:
- R15 a R30 (mot de passe, articles publics, favoris, CRUD admin articles, CRUD admin exercices, filtrage sessions)
- Se referer au cahier complet: docs/tests/CAHIER_RECETTE.md
- Dupliquer les lignes du tableau ci-dessus pour chaque scenario restant

## Anomalies detectees
| ID Bug | Gravite | Description | Module | Action corrective | Statut |
|---|---|---|---|---|---|

## Conclusion
- Decision finale:
- Conditions de mise en production:
- Signatures:
  - Responsable recette:
  - Responsable projet:
