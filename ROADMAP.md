# Roadmap du Projet : Site Salles & Emploi du Temps

Ce document détaille les étapes de développement pour créer un agrégateur d'emploi du temps et de salles libres.

---

## Phase 1 : Analyse et Conception des Données (Ne code pas tout de suite !)
Avant d'écrire une ligne de code, il est crucial de comprendre exactement comment les API externes fonctionnent et comment stocker les choix des utilisateurs.

### 1. Auditer les API Externes
Utilise un outil comme **Postman** ou **Insomnia**.

* **Récupérer le JSON des salles :**
    * Quelle est la structure ? (Nom de la salle, état `is_free`, horaires ?).
* **Récupérer le(s) JSON des emplois du temps :**
    * Est-ce un gros fichier unique ?
    * Ou dois-tu appeler `url/groupeA` puis `url/optionB` ?
    * Note bien les champs qui permettent de filtrer (ex: `course_name`, `group_id`).

### 2. Définir le Modèle de Données (Schéma BDD)
Prévois une structure utilisateur flexible dans la base de données.

* **Exemple de structure utilisateur :**
    * `email` (String)
    * `password` (Hashé)
    * `preferences` (Objet JSON) :
        ```json
        {
          "group": "TD1",
          "options": ["Anglais", "Info"]
        }
        ```

---

## Phase 2 : Le Backend (Le Socle)
C'est la fondation. Mise en place du serveur et de la gestion des comptes.

### 1. Initialisation du Projet
* Installer **Node.js** + **Express** (ou Python/FastAPI).
* Connecter la **Base de Données** (MongoDB est recommandé pour stocker le JSON des préférences).

### 2. Système d'Authentification (Auth)
* **POST** `/register` : Pour créer un compte (Email + MDP).
* **POST** `/login` : Vérifie le MDP et renvoie un **JWT (Token)**.
    * *Note : À ce stade, ne t'occupe pas encore des options de cours, fais juste marcher l'inscription/connexion.*

### 3. Gestion du Profil (Préférences)
* **PUT** `/api/user/preferences` : Permet à l'utilisateur connecté d'enregistrer son groupe (ex: "Groupe A") et ses options.
* **GET** `/api/user/me` : Pour récupérer ses infos et pré-remplir le formulaire côté site.

---

## Phase 3 : La Logique Métier (Le Cœur du Backend)
C'est ici que l'on connecte le site aux données externes.

### 1. Service "Salles Libres" (Proxy & Cache)
* Route : **GET** `/api/rooms`
* Le serveur récupère le JSON via l'URL externe.
* **Important :** Ajouter un système de cache simple (ex: `node-cache`).
    * *Objectif :* Si 10 personnes chargent la page en même temps, le serveur ne doit appeler l'URL externe qu'une seule fois et servir le résultat mémorisé aux autres.

### 2. Service "Emploi du Temps" (L'Agrégateur)
* Route : **GET** `/api/schedule`
* **Logique :**
    1.  Récupérer les préférences de l'utilisateur connecté (via le Token).
    2.  Télécharger les données de l'API externe (Tronc commun + Options).
    3.  **Filtrer les données :** Ne garder que les cours du "Groupe de l'utilisateur" **ET** les cours correspondants à ses "Options".
    4.  **Fusionner** le tout dans une liste propre.
    5.  Renvoyer cette liste JSON au frontend.

---

## Phase 4 : Le Frontend (L'Interface)
Construction de l'interface visuelle avec **React**, **Vue** ou **Next.js**.

### 1. Les Pages de base
* **Page Login / Inscription**
* **Page Configuration (Onboarding)** :
    * Après l'inscription, rediriger l'utilisateur ici.
    * Afficher des menus déroulants pour choisir son Groupe Principal et des cases à cocher pour ses Options.

### 2. Page "Salles Libres"
* Appelle la route `/api/rooms`.
* Affiche la liste des salles.
* Ajouter une barre de recherche ou des filtres (ex: "Salles libres maintenant").

### 3. Page "Mon Planning"
* Appelle la route `/api/schedule`.
* Installer une librairie de calendrier (ex: **FullCalendar** ou **React-Big-Calendar**).
* Injecter les données reçues dedans.

---

## Phase 5 : Optimisation et Mise en Production

### 1. Gestion des erreurs
* Que se passe-t-il si l'API de l'école plante ?
* Le site doit afficher "Données indisponibles" proprement, sans crasher.

### 2. Cache Avancé (Optionnel mais recommandé)
* Au lieu de faire du cache à la demande, mettre en place une tâche planifiée (**Cron Job**) sur le serveur.
* Elle va chercher les données de l'école toutes les 15 minutes et met à jour la base de données/cache.
* *Résultat :* Réponse instantanée pour l'utilisateur.

### 3. Hébergement
* **Backend :** Render, Railway ou Heroku.
* **Frontend :** Vercel ou Netlify.
* **Base de données :** MongoDB Atlas (Gratuit).