# Projet Recettes

Application web permettant de rechercher un plat et d'obtenir rapidement
ses ingrédients, les quantités nécessaires et des informations nutritionnelles.

🌐 Application : https://projet-recettes.vercel.app

## Fonctionnalités

- Recherche de recettes en français
- Affichage de plusieurs résultats avec image
- Page détaillée pour chaque recette
- Liste des ingrédients et quantités
- Informations nutritionnelles
- Traduction automatique des recherches et des données
- Interface responsive pour ordinateur et mobile
- Progressive Web App (PWA)
- Installation de l'application sur un appareil compatible
- Gestion des états de chargement et des erreurs
- Tests automatisés de composants React

## Technologies utilisées

### Frontend

- React
- Vite
- React Router
- CSS
- Vite PWA
- Vitest
- React Testing Library

### Backend

- Node.js
- Express
- CORS
- express-rate-limit
- dotenv

### APIs externes

- Spoonacular API
- Google Cloud Translation API

### Déploiement

- Vercel pour le frontend
- Railway pour le backend

## Architecture

L'application est séparée en deux parties principales :

```text
Utilisateur
    │
    ▼
React / Vite / PWA
    │
    ▼
Backend Express
    │
    ├──────────────► Google Translation API
    │
    └──────────────► Spoonacular API
