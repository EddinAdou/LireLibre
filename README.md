# LireLibre

Une plateforme collaborative d'écriture et de lecture d'histoires.

## 🚀 Technologies utilisées

### Frontend
- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **Vite** comme bundler
- **React Router** pour la navigation
- **React Query** pour la gestion d'état serveur
- **React Hook Form** + **Zod** pour la validation des formulaires

### Backend
- **Symfony 7.1** avec PHP 8.3
- **PostgreSQL** comme base de données
- **Redis** pour le cache
- **Doctrine ORM** pour la base de données
- **JWT Authentication** avec LexikJWTAuthenticationBundle
- **API REST** avec sérialisation JSON

### DevOps
- **Docker** + **Docker Compose** pour le développement
- **GitHub Actions** pour CI/CD
- **Nginx** comme reverse proxy

## 📋 Fonctionnalités

- [ ] Système d'authentification JWT
- [ ] CRUD des histoires
- [ ] Système de commentaires
- [ ] Gestion des favoris
- [ ] Recherche et filtres
- [ ] Interface d'écriture
- [ ] Profil utilisateur
- [ ] Notifications
- [ ] Internationalisation

## 🛠️ Installation et démarrage

### Prérequis
- **Docker Desktop**
- **Git**
- **Node.js 18+** (optionnel pour développement local)
- **PHP 8.3 + Composer** (optionnel pour développement local)

### Démarrage rapide avec Docker

1. **Cloner le repository :**
   ```bash
   git clone https://github.com/EddinAdou/LireLibre.git
   cd LireLibre
   ```

2. **Lancer l'installation automatique :**
   ```powershell
   .\setup-docker.ps1
   ```

3. **Accéder à l'application :**
   - Frontend : http://localhost:3000
   - Backend API : http://localhost:8080/api

### Commandes Docker utiles

```bash
# Démarrer les services
cd docker
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart frontend
```

## 📁 Structure du projet

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

## 🔧 Développement

### Frontend local (sans Docker)
```bash
cd frontend
npm install
npm run dev
```

### Backend local (sans Docker)
```bash
cd backend
composer install
symfony server:start
```

## 🧪 Tests

```bash
# Tests frontend
cd frontend
npm run test

# Tests backend
cd backend
php bin/phpunit
```

## 📝 API Documentation

L'API REST est disponible à l'adresse : http://localhost:8080/api

### Endpoints principaux :
- `GET /api/stories` - Liste des histoires
- `POST /api/stories` - Créer une histoire
- `GET /api/stories/{id}` - Détails d'une histoire
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **EddinAdou** - *Développeur principal* - [EddinAdou](https://github.com/EddinAdou)

## 🔗 Liens utiles

- [Documentation React](https://react.dev/)
- [Documentation Symfony](https://symfony.com/doc/current/index.html)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs) - Plateforme d'écriture et de lecture d'histoires collaboratives

## 📖 Description

LireLibre est une plateforme web moderne et collaborative qui permet aux utilisateurs d'écrire, publier et découvrir des histoires. Conçue pour créer une communauté dynamique autour de la littérature accessible et moderne.

## 🚀 Fonctionnalités

### ✅ Implémentées (squelette)
- Architecture frontend React + TypeScript + Tailwind CSS
- API backend Symfony 8.3 avec entités de base
- Authentification JWT
- Configuration Docker complète
- Pipeline CI/CD GitHub Actions

### 🔄 En développement
- [ ] Interface d'écriture d'histoires
- [ ] Catalogue avec recherche et filtres
- [ ] Système de commentaires
- [ ] Gestion des favoris et avis
- [ ] Profils utilisateurs
- [ ] Notifications en temps réel

### 🎯 Prévues
- [ ] Internationalisation (i18n)
- [ ] Accessibilité WCAG
- [ ] Fonctionnalités IA d'aide à l'écriture
- [ ] Application mobile

## 🛠️ Technologies

### Frontend
- **React 18** - Interface utilisateur moderne
- **TypeScript** - Typage statique pour une meilleure maintenabilité
- **Tailwind CSS** - Framework CSS utilitaire pour un design responsive
- **Vite** - Outil de build rapide et moderne
- **React Router** - Navigation côté client
- **React Query** - Gestion d'état serveur
- **React Hook Form** - Gestion des formulaires

### Backend
- **Symfony 8.3** - Framework PHP moderne pour l'API REST
- **PHP 8.3** - Dernière version de PHP avec les nouvelles fonctionnalités
- **Doctrine ORM** - Mapping objet-relationnel
- **LexikJWTAuthenticationBundle** - Authentification JWT
- **NelmioCorsBundle** - Gestion CORS

### Infrastructure
- **PostgreSQL** - Base de données relationnelle robuste
- **Redis** - Cache et gestion des sessions
- **Docker** - Containerisation pour le développement et déploiement
- **Nginx** - Serveur web haute performance
- **GitHub Actions** - CI/CD automatisé

## 🚀 Installation et démarrage

### Prérequis
- Docker et Docker Compose
- Git

### Installation rapide avec Docker

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/lirelibre.git
cd lirelibre
```

2. **Configurer les variables d'environnement**
```bash
# Frontend
cp frontend/.env.example frontend/.env

# Backend (créer le fichier .env dans backend/)
# Voir la section Configuration ci-dessous
```

3. **Démarrer l'application**
```bash
cd docker
docker-compose up -d
```

4. **Accéder à l'application**
- Frontend : http://localhost:3000
- Backend API : http://localhost:8080/api
- Base de données : localhost:5432

### Installation manuelle (développement)

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
composer install
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
symfony server:start
```

## ⚙️ Configuration

### Variables d'environnement Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_NODE_ENV=development
```

### Variables d'environnement Backend (.env)
```env
APP_ENV=dev
APP_SECRET=your-secret-key-here
DATABASE_URL=postgresql://lirelibre:password@127.0.0.1:5432/lirelibre
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your-jwt-passphrase
CORS_ALLOW_ORIGIN=http://localhost:3000
```

## 🏗️ Architecture

```
LireLibre/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   ├── pages/          # Pages de l'application
│   │   ├── contexts/       # Contextes React (Auth, etc.)
│   │   ├── services/       # Services API
│   │   ├── hooks/          # Hooks personnalisés
│   │   ├── types/          # Types TypeScript
│   │   └── utils/          # Fonctions utilitaires
│   ├── public/             # Assets statiques
│   └── package.json
├── backend/                 # API Symfony
│   ├── src/
│   │   ├── Entity/         # Entités Doctrine
│   │   ├── Controller/     # Contrôleurs API REST
│   │   ├── Repository/     # Repositories Doctrine
│   │   └── Service/        # Logique métier
│   ├── config/             # Configuration Symfony
│   └── composer.json
├── docker/                 # Configuration Docker
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── nginx.conf
└── .github/               # CI/CD et documentation
    ├── workflows/
    └── copilot-instructions.md
```

## 🗄️ Modèle de données

### Entités principales

- **User** : Utilisateurs de la plateforme
  - Informations personnelles, authentification
  - Relations : auteur d'histoires, commentaires, favoris

- **Story** : Histoires publiées
  - Contenu, métadonnées, statistiques
  - Relations : auteur, commentaires, favoris

- **Comment** : Commentaires sur les histoires
  - Support des réponses (threading)
  - Relations : auteur, histoire, commentaire parent

- **Favorite** : Favoris des utilisateurs
  - Relations : utilisateur, histoire

## 🧪 Tests

### Frontend
```bash
cd frontend
npm run test       # Tests unitaires
npm run lint       # Linting
npm run build      # Vérification de build
```

### Backend
```bash
cd backend
php bin/phpunit    # Tests unitaires
composer audit     # Audit de sécurité
```

## 🚀 Déploiement

Le projet inclut une configuration complète pour le déploiement :

1. **GitHub Actions** pour CI/CD automatisé
2. **Docker** pour la containerisation
3. **Configuration nginx** optimisée pour la production

### Pipeline CI/CD
- Tests automatisés (frontend et backend)
- Audit de sécurité
- Build et push des images Docker
- Déploiement automatique sur la branche main

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Équipe

- **Développement** : [Votre nom]
- **Design** : [Nom du designer]
- **DevOps** : [Nom DevOps]

## 📞 Support

Pour toute question ou problème :
- Ouvrir une [issue GitHub](https://github.com/votre-username/lirelibre/issues)
- Consulter la [documentation](docs/)
- Contacter l'équipe : contact@lirelibre.com

---

**LireLibre** - Donnez vie à vos histoires ✨
