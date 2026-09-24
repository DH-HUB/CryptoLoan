# Notifications e-mail

## Tester les notifications en local

En développement, CryptoLoan utilise Mailpit pour intercepter les e-mails envoyés par le backend. Cela permet de vérifier les notifications sans envoyer de messages à l'extérieur.

Pour effectuer un test, créez un compte depuis l'application ou utilisez l'un des comptes de démonstration, s'ils sont activés : `admin@example.com` avec le mot de passe `admin123`, ou `user@example.com` avec `user123`.

Une fois connecté, ouvrez le centre de notifications et cliquez sur **Envoyer un e-mail test**. Le message est consultable dans Mailpit sur http://localhost:8025.

Les comptes de démonstration sont réservés au développement et doivent être désactivés en production.

## Configurer un envoi réel avec Gmail

Pour envoyer de véritables e-mails, le backend peut utiliser le serveur SMTP de Gmail à la place de Mailpit. Activez la validation en deux étapes sur le compte Google concerné, puis générez un mot de passe d'application.

## Envoi des e-mails en local

Lorsque CryptoLoan est lancé avec Docker Compose, le backend utilise Mailpit comme serveur SMTP. Les e-mails générés par l'application sont interceptés automatiquement et restent dans l'environnement local.

Après avoir démarré l'application :

```bash
docker compose up -d --build

```bash
docker compose up --build -d backend
docker compose logs -f backend
```

L'historique des notifications indique *SENT` lorsque le serveur SMTP a accepté le message et FAILED lorsqu'une erreur est survenue pendant l'envoi. Le statut `SENT` ne garantit pas la réception du message dans la boîte du destinataire. En cas d'échec, consultez les journaux du backend pour identifier la cause.
