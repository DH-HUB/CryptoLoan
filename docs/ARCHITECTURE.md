# Architecture CryptoLoan

L'application utilise un **monolithe modulaire** (Spring Boot) où chaque métier (Auth, Prêts, Garanties, Contrats, Notifications) est isolé et communique via des interfaces.

Chaque module applique l'**architecture hexagonale** :
* **Domaine :** Logique et règles métier pures (sans Spring/JPA).
* **Ports :** Interfaces d'entrée (use cases) et de sortie (gateways).

## Organisation du backend

L'application est découpée en modules métier autonomes situés sous com.cryptoloan :

identity : Comptes, rôles et authentification JWT.
loan : Cycle de vie des prêts, garanties, évaluation du risque et liquidation.
pricing : Récupération et mise en cache des prix externes.
contract : Gestion des documents, empreintes cryptographiques et signatures.
notification : Historique des alertes, protocoles SMTP et SSE.
audit : Conservation de la piste d'audit.
shared : Sécurité HTTP et gestion globale des erreurs.

Le module loan orchestre les opérations principales. Il communique avec les autres composants via des ports, tandis que les adaptateurs gèrent les détails techniques de ces échanges.

- Le domaine contient les modèles et les règles métier. Il n'importe ni Spring ni JPA.
- La couche application exécute les cas d'utilisation et coordonne les opérations.
- Les ports décrivent les interactions nécessaires sans imposer de technologie.
- Les adaptateurs relient les ports aux contrôleurs HTTP, à la persistance et aux autres composants.

## Cycle de vie d'un prêt

1. Un utilisateur authentifié crée une demande de prêt. Une clé d'idempotence permet de gérer les requêtes répétées.
2. Un administrateur approuve la demande.
3. Le module `contract` génère le document, calcule son empreinte SHA-256 et le stocke.
4. L'utilisateur et l'administrateur signent séparément le contrat.
5. Un traitement planifié réévalue régulièrement la garantie à partir des prix disponibles.
6. Lorsque le ratio passe sous le seuil d'avertissement, une alerte est envoyée. Elle n'est pas répétée tant que le ratio n'est pas revenu à la normale.
7. Si le ratio passe sous le seuil minimal, le prêt est liquidé et l'utilisateur est informé.

Ce flux répartit les responsabilités : `loan` pilote le prêt, `pricing` fournit les prix, `contract` gère les preuves contractuelles et `notification` prend en charge les messages.

## Persistance

CryptoLoan utilise PostgreSQL. Les migrations Flyway créent notamment les tables et leurs rôle suivants :


- users: Comptes utilisateurs 
- user_roles: Rôles associés aux utilisateurs 
- loans : Prêts et garanties 
- contract_proofs : Preuves et empreintes contractuelles 
- notifications : Historique des notifications 
- audit_events : Événements d'audit 

Les entités JPA restent dans les adaptateurs de persistance. Le domaine manipule ses propres modèles : il ne dépend pas directement de la structure des tables.

## Tests et déploiement

La séparation entre domaine, application et adaptateurs facilite les tests des règles métier avec des dépendances simulées. Les tests Maven vérifient le backend ; les tests Angular couvrent le frontend. Ils sont exécutés avant la reconstruction des images Docker.

Les tests ne suffisent toutefois pas à valider le déploiement. Après la construction, il faut également contrôler le démarrage des conteneurs et les échanges entre le frontend, le backend et PostgreSQL.

## Évolutions possibles

Le monolithe modulaire garde le déploiement simple tant que les modules évoluent ensemble. Si un besoin d'exploitation indépendant apparaît, les ports et les frontières métier fourniront une base pour envisager l'extraction d'un module. Ce sera une décision à prendre en fonction des besoins réels, et non une obligation liée à l'architecture actuelle.
