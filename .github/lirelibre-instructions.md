# Instructions pour LireLibre

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Contexte du projet

LireLibre est une plateforme collaborative d'écriture et de lecture d'histoires. Le projet utilise :

- **Frontend** : React 18 + TypeScript + Tailwind CSS + Vite
- **Backend** : Symfony 8.3 + PHP 8.3 + API REST
- **Base de données** : PostgreSQL avec Doctrine ORM
- **Authentification** : JWT avec LexikJWTAuthenticationBundle
- **Cache** : Redis
- **Containerisation** : Docker + Docker Compose
- **CI/CD** : GitHub Actions

## Conventions de code

### Frontend (React/TypeScript)
- Utiliser les hooks React modernes (useState, useEffect, useContext, etc.)
- Préférer les functional components aux class components
- Utiliser TypeScript strict avec des types explicites
- Suivre la convention de nommage PascalCase pour les composants
- Utiliser Tailwind CSS pour le styling avec les classes utilitaires
- Organiser les imports par ordre : React, libraries, local imports
- Utiliser React Query pour la gestion d'état serveur
- Implémenter la gestion d'erreurs avec try/catch et toast notifications

### Backend (Symfony/PHP)
- Respecter les standards PSR-12 pour le formatage du code
- Utiliser les attributs PHP 8+ plutôt que les annotations
- Nommer les entités au singulier (User, Story, Comment)
- Utiliser les Repository patterns pour les requêtes complexes
- Implémenter les groupes de sérialisation pour les API
- Utiliser les ValidateAnnotation pour la validation des données
- Séparer la logique métier dans des Services
- Gérer les erreurs avec des exceptions personnalisées

### API REST
- Suivre les conventions REST (GET, POST, PUT, DELETE)
- Préfixer toutes les routes API par `/api`
- Utiliser les codes de statut HTTP appropriés
- Retourner des réponses JSON structurées avec data, message, success
- Implémenter la pagination pour les listes
- Gérer CORS pour l'accès depuis le frontend

## Structure du projet

```
LireLibre/
├── frontend/           # Application React
│   ├── src/
│   │   ├── components/ # Composants React réutilisables
│   │   ├── pages/      # Pages de l'application
│   │   ├── contexts/   # Contextes React (Auth, etc.)
│   │   ├── services/   # Services API
│   │   ├── hooks/      # Hooks personnalisés
│   │   ├── types/      # Types TypeScript
│   │   └── utils/      # Utilitaires
├── backend/            # API Symfony
│   ├── src/
│   │   ├── Entity/     # Entités Doctrine
│   │   ├── Controller/ # Contrôleurs API
│   │   ├── Repository/ # Repositories Doctrine
│   │   └── Service/    # Services métier
├── docker/             # Configuration Docker
└── .github/            # Workflows GitHub Actions
```

## Entités principales

1. **User** : Utilisateurs de la plateforme
2. **Story** : Histoires publiées
3. **Comment** : Commentaires sur les histoires
4. **Favorite** : Favoris des utilisateurs

## Fonctionnalités à implémenter

- [ ] Système d'authentification JWT
- [ ] CRUD des histoires
- [ ] Système de commentaires
- [ ] Gestion des favoris
- [ ] Recherche et filtres
- [ ] Interface d'écriture
- [ ] Profil utilisateur
- [ ] Notifications
- [ ] Internationalisation

## Conseils spécifiques

- Toujours valider les données côté frontend ET backend
- Utiliser les groupes de sérialisation Symfony pour contrôler les données exposées
- Implémenter la pagination dès le début pour les listes
- Gérer l'état de chargement dans l'interface utilisateur
- Utiliser les variables d'environnement pour la configuration
- Écrire des tests unitaires pour la logique critique
- Optimiser les requêtes SQL avec Doctrine
