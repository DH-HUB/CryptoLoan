
# CryptoLoan

## Description
CryptoLoan est une application de simulation de prêts garantis par des cryptomonnaies. Ce projet est développé en utilisant Spring Boot, H2 Database, et offre une interface REST pour interagir avec les entités principales comme les utilisateurs, les garanties cryptographiques et les prêts. L'objectif principal est de fournir une plateforme pour gérer des prêts garantis par des cryptomonnaies, avec des fonctionnalités comme la création, la visualisation et la liquidation de prêts.

---

## Fonctionnalités Actuelles
- **Gestion des utilisateurs :**
  - Création et consultation des utilisateurs associés aux prêts.

- **Gestion des garanties cryptographiques :**
  - Stockage des informations sur les cryptomonnaies utilisées comme garantie.

- **Gestion des prêts :**
  - Création de prêts garantis par des cryptomonnaies.
  - Visualisation des prêts existants avec leurs statuts (PENDING, APPROVED, LIQUIDATED).

- **Base de données en mémoire (H2) :**
  - Configuration automatique des tables via Hibernate.
  - Accès à la console H2 pour inspection des données.

---

## Fonctionnalités à Venir
- **Mise à jour et liquidation automatique des prêts :**
  - Ajout d'une tâche planifiée pour vérifier et liquider les prêts automatiquement lorsque la garantie devient insuffisante.

- **Intégration d'une API en temps réel :**
  - Récupération en direct des prix des cryptomonnaies via l'API CoinGecko.

- **Système d'alertes :**
  - Notifications par email ou en temps réel lorsque les prêts approchent de la liquidation.

- **Interface utilisateur front-end :**
  - Développement d'une interface utilisateur interactive en Angular.

---

## Configuration et Installation

### Prérequis
- Java 17
- Maven
- IntelliJ IDEA (ou tout autre IDE compatible)
- Navigateur web pour accéder à la console H2

### Étapes
1. Clonez le projet :
   ```bash
   git clone <url-du-repository>
   cd CryptoLoan
   ```

2. Lancez le projet :
   ```bash
   mvn clean spring-boot:run
   ```

3. Accédez à la console H2 :
   - URL : `http://localhost:8080/h2-console`
   - **JDBC URL** : `jdbc:h2:mem:cryptoloan`
   - **User Name** : `sa`
   - **Password** : (laissez vide)

4. Testez les endpoints REST avec un outil comme Postman ou l'outil HTTP intégré d'IntelliJ.

---

## Technologies Utilisées
- **Backend** : Java, Spring Boot
- **Base de Données** : H2 
- **Build Tool** : Maven
- **Gestion des dépendances** : Spring Boot Starter, Lombok, Hibernate

---

## Auteurs
- Hakima Djermouni - Développeur principal

---

## Licence
Ce projet est sous licence [MIT](LICENSE).
