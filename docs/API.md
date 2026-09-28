# Documentation API

L'API de CryptoLoan est exposée sous `/api`.

À l'exception des routes d'inscription, de connexion et de consultation des prix, les requêtes doivent être authentifiées avec un token JWT :

```http
Authorization: Bearer <token>
```

Le token est obtenu lors de la connexion et doit ensuite être envoyé dans l'en-tête `Authorization` des requêtes protégées.

## Authentification

L'inscription se fait avec :

`POST /api/auth/register`

La connexion utilise :

`POST /api/auth/login`

Cette route renvoie le JWT ainsi que les informations du profil connecté.

Le profil de l'utilisateur courant peut ensuite être récupéré avec :

`GET /api/auth/me`

Cette dernière route nécessite d'être authentifié.

## Prix des crypto-actifs

Le prix actuel d'un crypto-actif en euros est disponible avec :

`GET /api/crypto/price`

Cette route est publique et ne nécessite pas de JWT.

## Prêts

Un utilisateur connecté peut récupérer ses prêts avec :

`GET /api/loans`

Une nouvelle demande de prêt est créée avec :

`POST /api/loans`

Lors de la création, il est possible d'envoyer une clé d'idempotence dans l'en-tête de la requête :

```http
Idempotency-Key: <uuid>
```

Cette clé permet d'éviter de créer plusieurs fois la même demande lorsqu'une requête est renvoyée, par exemple après un problème réseau.

Deux opérations sont réservées aux administrateurs.

Pour récupérer l'ensemble des prêts de la plateforme :

`GET /api/loans/all`

Pour approuver un prêt :

`PATCH /api/loans/{id}/approve`

`{id}` correspond à l'identifiant du prêt concerné.

## Contrats

Les informations d'un contrat sont accessibles avec :

`GET /api/contracts/{id}`

Le document associé peut être téléchargé avec :

`GET /api/contracts/{id}/document`

La signature utilisateur passe par :

`POST /api/contracts/{id}/sign/user`

La contresignature administrateur utilise :

`POST /api/contracts/{id}/sign/admin`

Cette dernière opération est réservée à un administrateur.

## Notifications

L'utilisateur peut consulter l'historique de ses notifications avec :

`GET /api/notifications`

Pour vérifier la configuration des e-mails en environnement de développement, une notification de test peut être envoyée avec :

`POST /api/notifications/test`

Avec la configuration locale, le message peut ensuite être consulté dans Mailpit.

## Audit

Les événements d'audit sont accessibles avec :

`GET /api/admin/audit`

Cette route est réservée aux administrateurs.

## Résumé du portefeuille

Le résumé du portefeuille de l'utilisateur authentifié est disponible avec :

`GET /api/portfolio/summary`

La requête ne prend **aucun email utilisateur** en paramètre. Le backend identifie le propriétaire du portefeuille à partir du JWT et de l'`AuthenticatedUser` courant.

La réponse contient :

- `totalLoans` : nombre total de prêts de l'utilisateur ;
- `pendingLoans` : prêts au statut `PENDING` ;
- `approvedLoans` : prêts au statut `APPROVED` ;
- `liquidatedLoans` : prêts au statut `LIQUIDATED` ;
- `totalBorrowedEur` : montant cumulé des prêts ayant été approuvés, y compris ceux ensuite liquidés ;
- `outstandingEur` : encours actuel des prêts au statut `APPROVED` ;
- `collateralByCrypto` : garanties des prêts `PENDING` et `APPROVED`, regroupées par symbole de crypto-actif.

Exemple de réponse :

```json
{
  "totalLoans": 3,
  "pendingLoans": 1,
  "approvedLoans": 1,
  "liquidatedLoans": 1,
  "totalBorrowedEur": 3200,
  "outstandingEur": 2000,
  "collateralByCrypto": [
    { "symbol": "BTC", "quantity": 0.35 },
    { "symbol": "ETH", "quantity": 1.5 }
  ]
}
```


## OpenAPI

La spécification OpenAPI est générée directement par le backend avec Springdoc.

Lorsque l'application est démarrée, le document JSON est exposé par le backend sur :

`GET /v3/api-docs`

Le fichier généré est également utilisé par la documentation du projet afin d'éviter de maintenir manuellement une seconde description de l'API.
