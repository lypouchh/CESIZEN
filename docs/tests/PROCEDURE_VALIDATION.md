# Procedure de validation - CESIZEN

## 1. But
Definir la methode de validation de la livraison avant soutenance.

## 2. Pre-requis
- Docker Desktop demarre
- Services CESIZEN operationnels
- Base de donnees migree
- Dependances frontend/backend installees

## 3. Etapes de validation

### Etape 1 - Validation technique automatisee
1. Executer les tests backend:
```bash
cd backend
php artisan test
```
2. Executer les tests frontend:
```bash
cd frontend
npm test -- --run
```
3. Critere de passage:
- 100% des tests passent

### Etape 2 - Validation fonctionnelle manuelle (recette)
1. Executer les scenarios R01 a R14 du cahier de recette
2. Renseigner le PV de recette (OK/KO + commentaires)
3. Critere de passage:
- Tous les scenarios critiques (priorite haute) valides
- Aucun bug bloquant ouvert

### Etape 3 - Validation non-regression
1. Rejouer les scenarios sensibles apres chaque correctif:
- Authentification
- Autorisations admin/super admin
- Sessions respiration
2. Critere de passage:
- Aucun comportement previously valide ne regresse

## 4. Gestion des anomalies
- Bloquant: corriger avant validation finale
- Majeur: corriger si impact fonctionnalite critique
- Mineur: documenter + planifier correction

## 5. Decision de validation
La version est "Validee" si:
- Tests automatiques: OK
- Recette manuelle: OK sur scenarios critiques
- Non-regression: OK
