# Tests

## Automatisés

```bash
mvn -f backend/pom.xml test
cd frontend && npm ci && npm run build
```

ArchUnit protège l'indépendance du domaine et des cas d'utilisation. Les tests unitaires couvrent les transitions de prêt et l'empreinte des contrats.

## Parcours manuel

1. Se connecter avec noreply@example.com.
2. Envoyer un e-mail test et le vérifier dans Mailpit.
3. Créer un prêt.
4. Se connecter comme administrateur et approuver le prêt.
5. Revenir au compte Hak Test App, ouvrir le contrat, le télécharger et le signer.
6. Contresigner comme administrateur.
7. Modifier temporairement les seuils ou utiliser une faible garantie afin d'observer l'alerte puis la liquidation.

