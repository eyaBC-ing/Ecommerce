# Plateforme E-Commerce (Spring Boot & React)

Bienvenue dans ce projet E-Commerce intégrant un back-end robuste en Java **Spring Boot** et un front-end réactif moderne construit avec **React (Vite)**. L'application inclut une gestion complète de modèles métiers : Produits, Catégories, Fournisseurs, Lignes de Commandes, Paniers, et intègre un système d'Authentification basé sur des rôles (Spring Security).

## 🧰 Technologies Utilisées

### Back-End (`/projetreactback`)
* **Java 17** & **Spring Boot 3**
* **Spring Data JPA** & **Hibernate** (Mappage ORM)
* **Spring Security** (Authentification Basic)
* **MySQL** (Base de données relationnelle)
* **Lombok** (Génération du code boilerplate)

### Front-End (`/projetreactfront`)
* **React** & **Vite**
* **Axios** (Requêtes HTTP avec intercepteurs Basic Auth)
* **React Router DOM** (Navigation Single Page Application)
* **Lucide React** (Icônes pour les interfaces)

---

## 🏗️ Structure du Projet

\`\`\`text
📁 Racine du projet
 ├── 📁 projetreactback   => API REST sous Spring Boot (Port 8080)
 └── 📁 projetreactfront  => Application React sous Vite (Port 5173)
\`\`\`

### Tableaux des Modèles (Entités)

* **User / Role** : Un utilisateur a un rôle (client, admin, super admin).
* **Product** : Appartient à une Category, est fourni par un Supplier.
* **Category** : Regroupe des produits.
* **Supplier** : Fournit plusieurs produits (OneToMany).
* **Panier / LigneCommande** : (Modèles de base pour le côté client, liées à Product).

---

## 🔐 Sécurité & Comptes par défaut

Le projet utilise **Spring Security**. 
Lors de la première exécution, un composant (`DataInitializer`) insère dans la base de données :
* Les rôles : `client`, `admin` et `super admin`.
* Un compte administrateur complet que vous pouvez utiliser de suite.

**Identifiants par défaut :**
* **Utilisateur :** `superadmin`
* **Mot de passe :** `admin`

*(Les droits d'accès des endpoints bloquent `POST`, `PUT`, `DELETE` aux non-administrateurs).*

---

## 🚀 Comment Lancer l'Application

### 1. Prérequis
* Un **JDK v17** installé et accessible dans la variable d'environnement `JAVA_HOME`.
* **Node.js** et **npm** (pour le lancement de React).
* Un serveur **MySQL** local sur le port 3306.

#### Configuration MySQL :
Vérifiez que vos accès à la base de données dans `/projetreactback/src/main/resources/application.properties` correspondent à votre serveur local :
* `spring.datasource.url=jdbc:mysql://localhost:3306/NOM_DE_BASE`
* `spring.datasource.username=root`
* `spring.datasource.password=...`

### 2. Démarrer le Back-End (Spring Boot)

Depuis l'IDE, lancez `ProjetreactbackApplication.java`, ou en terminal :
\`\`\`bash
cd projetreactback
.\mvnw spring-boot:run
\`\`\`
> L'API sera accessible sur : `http://localhost:8080/`

### 3. Démarrer le Front-End (React)

Ouvrez un tout nouveau terminal et lancez les commandes suivantes :
\`\`\`bash
cd projetreactfront
npm install
npm run dev
\`\`\`
> Le Front-End sera maintenant en ligne sur : `http://localhost:5173/`

---

## ✨ Prochaines étapes suggérées

- Permettre aux clients d'ajouter des produits dans leur **Panier** (`Panier`).
- Gérer la validation totale et la création d'ordre (`LigneCommande`).
- Remplacer l'authentification "Basic" par "JWT" pour une sécurité stateless à plus long terme.

👤 **Auteur :** [@eyaBC-ing](https://github.com/eyaBC-ing/Ecommerce)
