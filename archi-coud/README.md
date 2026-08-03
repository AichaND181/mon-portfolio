# ARCHI-COUD

Plateforme de numérisation et de gestion électronique des archives du Centre des Œuvres Universitaires de Dakar (COUD).

## 📋 Description

ARCHI-COUD est une application web de gestion d'archives permettant de:
- Numériser et cataloguer les documents
- Gérer les catégories documentaires
- Organiser les documents par départements
- Effectuer des recherches avancées
- Gérer les utilisateurs et leurs droits
- Consulter des statistiques et rapports

## 🚀 Installation

1. Cloner le repository
2. Ouvrir `index.html` dans un navigateur web
3. Se connecter avec les comptes de démonstration

## 🔐 Comptes de démonstration

| Identifiant | Mot de passe | Rôle |
|-------------|-------------|------|
| admin | admin | Cheffe du BAD |
| bad | bad | Agent Archives |
| budget | budget | Dépt. Budget |
| rh | rh | Capital Humain |
| direction | direction | Administrateur |

## 📁 Structure du projet

```
archi-coud/
├── index.html              # Page de connexion
├── dashboard.html          # Tableau de bord
├── assets/
│   ├── css/                # Feuilles de style
│   ├── js/                 # Scripts JavaScript
│   └── images/             # Images et logos
└── pages/                  # Pages de l'application
    ├── documents.html      # Gestion des documents
    ├── categories.html     # Gestion des catégories
    ├── utilisateurs.html   # Gestion des utilisateurs
    ├── parametres.html     # Paramètres système
    ├── recherche.html      # Recherche avancée
    └── ...
```

## 🛠️ Technologies

- **Frontend** : HTML5, CSS3, JavaScript (vanilla)
- **Stockage** : LocalStorage (données persistantes côté client)
- **Icons** : Font Awesome 6.5.0
- **Fonts** : Google Fonts (Inter)

## ⚠️ Note importante

Cette application est une démonstration/prototype. Les données sont stockées localement dans le navigateur via LocalStorage. Pour une utilisation en production, il est recommandé d'implémenter:
- Un backend sécurisé (Node.js, Python, etc.)
- Une base de données (PostgreSQL, MongoDB, etc.)
- Un système d'authentification robuste
- Des tests automatisés

## 📝 Fonctionnalités

### Gestion des documents
- Ajout, modification et suppression de documents
- Classification par catégories et départements
- Recherche et filtrage avancé

### Gestion des utilisateurs
- Création et modification de comptes utilisateurs
- Gestion des rôles et permissions
- Historique des actions

### Statistiques
- Tableaux de bord avec indicateurs clés
- Rapports exportables en PDF
- Visualisation des données par département

## 📄 Licence

© 2025 Centre des Œuvres Universitaires de Dakar. Tous droits réservés.
