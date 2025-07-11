# Guide de démarrage rapide - LireLibre

## 🚀 Étapes pour démarrer le projet

### Étape 1 : Pré-requis (Installation des outils)

#### ✅ Déjà installé sur votre système :
- Docker Desktop
- Git

#### ❌ À installer :

**1. Node.js (v18 ou plus récent)**
```powershell
# Via winget (recommandé)
winget install OpenJS.NodeJS

# Ou télécharger depuis https://nodejs.org/
```

**2. PHP 8.3 + Composer (pour développement local backend - optionnel)**
```powershell
# Via Chocolatey
choco install php composer

# Ou télécharger depuis :
# PHP : https://windows.php.net/
# Composer : https://getcomposer.org/
```

### Étape 2 : Navigation vers le projet

**IMPORTANT : Naviguer vers le dossier du projet**
```powershell
# Aller dans le dossier du projet LireLibre
cd C:\Users\yadou\Desktop\LireLibre

# Ou utiliser le chemin relatif si vous êtes déjà sur le Bureau
cd LireLibre
```

### Étape 3 : Initialisation du projet

**1. Vérifier que Docker est démarré**
```powershell
docker --version
docker-compose --version
```

**2. Installer les dépendances du frontend**
```powershell
cd frontend
npm install
```

**3. Créer les fichiers d'environnement**
```powershell
# Frontend
copy frontend\.env.example frontend\.env

# Backend (créer le fichier)
New-Item -Path "backend\.env" -ItemType File
```

### Étape 3 : Configuration des variables d'environnement

**Frontend (.env) :**
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_NODE_ENV=development
```

**Backend (.env) :**
```env
APP_ENV=dev
APP_SECRET=your-secret-key-change-this-in-production
DATABASE_URL=postgresql://lirelibre:lirelibre_password@database:5432/lirelibre
REDIS_URL=redis://redis:6379
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your-jwt-passphrase-change-this
CORS_ALLOW_ORIGIN=http://localhost:3000
```

### Étape 4 : Démarrage avec Docker

**1. Démarrer les services**
```powershell
cd docker
docker-compose up -d
```

**2. Vérifier que tout fonctionne**
```powershell
docker-compose ps
```

### Étape 5 : Accès à l'application

- **Frontend React** : http://localhost:3000
- **API Backend** : http://localhost:8080/api
- **Base de données PostgreSQL** : localhost:5432

## 🛠️ Commandes utiles

**Arrêter les services :**
```powershell
docker-compose down
```

**Voir les logs :**
```powershell
docker-compose logs -f
```

**Redémarrer un service :**
```powershell
docker-compose restart frontend
```

**Développement frontend local (sans Docker) :**
```powershell
cd frontend
npm run dev
```

## 🔧 Configuration du repository Git

Si vous voulez créer un repository GitHub :

```powershell
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Premier commit
git commit -m "Initial commit: LireLibre project setup"

# Créer un repository sur GitHub et l'ajouter
git remote add origin https://github.com/votre-username/lirelibre.git
git branch -M main
git push -u origin main
```

## ❗ Problèmes courants

**1. Port déjà utilisé :**
```powershell
# Changer les ports dans docker-compose.yml
# Frontend: 3000 -> 3001
# Backend: 8080 -> 8081
```

**2. Docker ne démarre pas :**
- Vérifier que Docker Desktop est lancé
- Redémarrer Docker Desktop

**3. Erreurs npm :**
```powershell
# Supprimer node_modules et reinstaller
rm -rf frontend/node_modules
cd frontend
npm install
```

## 🎯 Prochaines étapes après installation

1. **Configurer JWT** (pour l'authentification)
2. **Créer la base de données** (migrations Symfony)
3. **Implémenter les premiers endpoints API**
4. **Compléter les formulaires React**
