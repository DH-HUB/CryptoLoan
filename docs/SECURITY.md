# Sécurité

## Contrôles présents

- mots de passe BCrypt avec facteur 12 ;
- JWT signé, court et validé à chaque requête ;
- autorisations par rôle sur approbation, contresignature et audit ;
- politiques d'en-têtes HTTP et limitation du débit de connexion ;
-  validation des entrées et réponses d'erreur sans stack trace ;
- requêtes de création idempotentes ;
- verrouillage optimiste des prêts ;
- migrations versionnées et schéma validé au démarrage ;
- chemins de documents normalisés ;
- secrets injectés par environnement.

## Avant des fonds réels

Le simulateur de signature doit être remplacé par un HSM/MPC ou un dépositaire qualifié. Ajouter MFA, KYC/AML, ledger en partie double, réconciliation on-chain, oracle redondant, outbox fiable, chiffrement des données, rotation des clés, tests d'intrusion et procédures de continuité. Faire auditer l'architecture et les smart contracts par des spécialistes indépendants.

