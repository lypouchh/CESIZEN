# PLAN Blue/Green

## Objectif
Mettre en place un deploiement blue/green local avec reverse proxy, sans coupure visible et avec retour arriere immediate.

## Architecture retenue
- `docker-compose.prod.yml`: base de deploiement cible (reseau interne, sans exposition MySQL).
- `docker-compose.bluegreen.yml`: equivalent blue/green, avec `app-blue`, `app-green` et le reverse proxy.
- `docker-compose.yml`: conserve la stack locale de developpement.

## Principe de fonctionnement
- Une seule couleur est exposee au reverse proxy a un instant donne.
- L'autre couleur sert de cible de deploiement.
- La bascule consiste a pointer le reverse proxy vers l'autre service, sans arreter le service actif avant la validation.
- Le rollback se fait en remettant l'ancien service derriere le proxy.

## Ordre de deploiement
1. Identifier la couleur actuellement active.
2. Deployer la nouvelle image sur la couleur inactive.
3. Appliquer les migrations compatibles avant la bascule applicative.
4. Verifier la nouvelle couleur.
5. Basculer le reverse proxy vers la nouvelle couleur.
6. Optionnellement, arreter l'ancienne couleur apres validation.

## Strategie base de donnees
La base est partagee par `app-blue` et `app-green`.

Pour eviter la perte de donnees et conserver le rollback:
- appliquer des migrations retro-compatibles de type expand/contract;
- ajouter d'abord les nouveaux champs/colonnes sans supprimer les anciens;
- deprecier ensuite les anciens usages dans l'application;
- supprimer les anciens elements seulement dans une phase ulterieure.

## Moment d'application des migrations
- Les migrations sont appliquees avant la bascule du reverse proxy.
- La version active reste en place pendant l'application des changements compatibles.
- La nouvelle version ne prend le trafic qu'apres migration et verification.

## Rollback
- Si la nouvelle version echoue, la bascule du proxy revient vers la couleur precedente.
- Comme le schéma reste compatible, l'ancienne version peut continuer a fonctionner.
- La base ne doit pas etre reconstruite ni videe.

## Pipeline CI/CD
- CI: build, tests, artefact de migration, image Docker, push registre.
- CD blue/green: deploiement de la couleur inactive, application des migrations, bascule du proxy.
- Le pipeline doit relancer la bascule sans intervention manuelle.

## Points a implementer
- Reverse proxy Nginx avec routage `app-blue` / `app-green`.
- Script de bascule blue/green appelable depuis le pipeline.
- Mise a jour du README avec le schéma et la strategie de migration.
