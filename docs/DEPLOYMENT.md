# Déploiement

## Développement local

CryptoLoan peut être démarré avec Docker Compose. Cette configuration permet d'exécuter le frontend Angular, le backend Spring Boot, PostgreSQL et Mailpit sans installer chaque service séparément.

Copier le fichier d'exemple et renseigner les variables d'environnement :

```bash
cp .env.example .env
```

Définir notamment un mot de passe PostgreSQL et un secret JWT aléatoire d'au moins 32 caractères. Le fichier `.env` doit rester local et ne pas être ajouté au dépôt Git.

Construire les images et démarrer les services :

```bash
docker compose up --build -d
```

Vérifier leur état :

```bash
docker compose ps
```

Une fois les conteneurs démarrés, l’application est accessible sur `http://localhost:8080`. Pour consulter les emails envoyés pendant les tests, Mailpit est disponible sur `http://localhost:8025`.

Swagger UI est également disponible si son accès est autorisé par la configuration du proxy et de Spring Security.

Les tests backend et frontend doivent être exécutés avant de valider les modifications. Les vérifications après le démarrage Docker permettent ensuite de contrôler le fonctionnement de l'application dans son environnement conteneurisé.

Si le script `scripts/smoke-test.sh` est présent et configuré, il peut être utilisé pour effectuer des vérifications complémentaires.

## Production

La configuration Docker fournie est destinée au développement et à la démonstration. Un déploiement en prod nécessiterait plusieurs adaptations :

- Stocker les secrets dans un gestionnaire dédié et désactiver les comptes de démonstration.
- Configurer HTTPS avec un reverse proxy ou un load balancer.
- Utiliser une instance PostgreSQL disposant de sauvegardes régulières et d'une procédure de restauration testée.
- Externaliser les documents contractuels vers un stockage chiffré et versionné.
- Centraliser les journaux et les métriques pour assurer la supervision.
- Analyser les dépendances et les images Docker, puis utiliser des images immuables et signées.
- Restreindre l'accès à Swagger et aux endpoints Actuator.

Les procédures de sauvegarde, de restauration et de supervision devront être validées avant toute mise en prod.

## Arrêt des services

Pour arrêter les conteneurs tout en conservant les volumes :

```bash
docker compose down
```

La commande suivante supprime également les volumes associés :

```bash
docker compose down -v
```

Elle entraîne la perte des data stockées dans ces volumes. Elle ne doit pas être utilisée sur un environnement dont les data doivent être conservées.
