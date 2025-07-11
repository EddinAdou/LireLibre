# 🐳 LireLibre - Configuration Docker

## 🚀 Démarrage Rapide

### Installation complète (première fois)
```powershell
.\docker-manage.ps1 -Action install
```

### Démarrage des services
```powershell
.\docker-manage.ps1 -Action up
```

## 🌐 URLs d'accès

Une fois les services démarrés :

- **🌟 Frontend (React)** : http://localhost:3000
- **🔧 Backend API (Symfony)** : http://localhost:8080
- **🐘 pgAdmin (PostgreSQL Admin)** : http://localhost:5050
- **🗄️ PostgreSQL** : localhost:5432
- **🔴 Redis** : localhost:6379

## 🔐 Identifiants

### pgAdmin
- **Email** : `admin@lirelibre.fr`
- **Mot de passe** : `admin123`

### PostgreSQL
- **Host** : `localhost` (externe) ou `database` (dans Docker)
- **Port** : `5432`
- **Base de données** : `lirelibre`
- **Utilisateur** : `lirelibre`
- **Mot de passe** : `lirelibre_password`

## 📋 Commandes Utiles

### Gestion des services
```powershell
# Démarrer tous les services
.\docker-manage.ps1 -Action up

# Arrêter tous les services
.\docker-manage.ps1 -Action down

# Redémarrer tous les services
.\docker-manage.ps1 -Action restart

# Redémarrer un service spécifique
.\docker-manage.ps1 -Action restart -Service backend
```

### Surveillance et logs
```powershell
# Voir le statut des services
.\docker-manage.ps1 -Action status

# Voir les logs de tous les services
.\docker-manage.ps1 -Action logs

# Voir les logs d'un service spécifique
.\docker-manage.ps1 -Action logs -Service backend
.\docker-manage.ps1 -Action logs -Service frontend
.\docker-manage.ps1 -Action logs -Service database
```

### Construction et maintenance
```powershell
# Reconstruire toutes les images
.\docker-manage.ps1 -Action build

# Reconstruire une image spécifique
.\docker-manage.ps1 -Action build -Service backend

# Nettoyage complet (⚠️ supprime toutes les données)
.\docker-manage.ps1 -Action clean
```

## 🛠️ Commandes Docker directes

### Exécuter des commandes dans les conteneurs
```powershell
# Backend Symfony
docker compose exec backend bash
docker compose exec backend php bin/console cache:clear
docker compose exec backend php bin/console doctrine:migrations:migrate
docker compose exec backend composer install

# Frontend React
docker compose exec frontend sh
docker compose exec frontend npm install
docker compose exec frontend npm run build

# Base de données PostgreSQL
docker compose exec database psql -U lirelibre -d lirelibre
```

### Gestion des volumes
```powershell
# Lister les volumes
docker volume ls

# Voir l'utilisation d'espace
docker system df

# Nettoyer les volumes non utilisés
docker volume prune
```

## 🗄️ Gestion de la Base de Données

### Via pgAdmin (Interface Web)
1. Ouvrir http://localhost:5050
2. Se connecter avec `admin@lirelibre.fr` / `admin123`
3. Le serveur "LireLibre Database" est pré-configuré

### Via ligne de commande
```powershell
# Se connecter à PostgreSQL
docker compose exec database psql -U lirelibre -d lirelibre

# Exporter la base
docker compose exec database pg_dump -U lirelibre lirelibre > backup.sql

# Importer une sauvegarde
docker compose exec -T database psql -U lirelibre -d lirelibre < backup.sql
```

## 🔧 Développement

### Hot Reload
- **Frontend** : Les modifications sont automatiquement rechargées
- **Backend** : Redémarrage automatique avec les volumes montés

### Débug
```powershell
# Voir les logs en temps réel
docker compose logs -f backend frontend

# Inspecter un conteneur
docker compose exec backend bash
```

### Tests
```powershell
# Tests backend
docker compose exec backend php bin/phpunit

# Tests frontend
docker compose exec frontend npm run test
```

## 🏗️ Architecture Docker

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Nginx         │    │   Backend       │
│   (React/Vite)  │────│   (Reverse      │────│   (Symfony/PHP) │
│   Port: 3000    │    │   Proxy)        │    │   Port: 9000    │
└─────────────────┘    │   Port: 8080    │    └─────────────────┘
                       └─────────────────┘              │
                                                        │
┌─────────────────┐    ┌─────────────────┐              │
│   pgAdmin       │    │   PostgreSQL    │──────────────┘
│   (Admin DB)    │────│   (Database)    │
│   Port: 5050    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘
                                 │
                       ┌─────────────────┐
                       │   Redis         │
                       │   (Cache)       │
                       │   Port: 6379    │
                       └─────────────────┘
```

## 🚨 Dépannage

### Service ne démarre pas
```powershell
# Vérifier les logs
.\docker-manage.ps1 -Action logs -Service nom_du_service

# Reconstruire l'image
.\docker-manage.ps1 -Action build -Service nom_du_service
```

### Problème de permissions
```powershell
# Sur Windows, exécuter PowerShell en tant qu'administrateur
# Vérifier que Docker Desktop est démarré
```

### Base de données corrompue
```powershell
# Sauvegarder d'abord (si possible)
docker compose exec database pg_dump -U lirelibre lirelibre > backup.sql

# Recréer la base
docker compose down
docker volume rm lirelibre_postgres_data
docker compose up -d database
```

### Erreur de port déjà utilisé
```powershell
# Trouver le processus utilisant le port
netstat -ano | findstr :3000

# Modifier les ports dans docker-compose.yml si nécessaire
```

## 📚 Ressources

- **Documentation Docker** : https://docs.docker.com/
- **Docker Compose** : https://docs.docker.com/compose/
- **PostgreSQL** : https://www.postgresql.org/docs/
- **pgAdmin** : https://www.pgadmin.org/docs/

## ✅ Checklist Post-Installation

- [ ] Docker et Docker Compose installés
- [ ] Services démarrés (`docker compose ps`)
- [ ] Frontend accessible : http://localhost:3000
- [ ] Backend API accessible : http://localhost:8080
- [ ] pgAdmin accessible : http://localhost:5050
- [ ] Base de données connectée
- [ ] Tests passent

🎉 **Votre environnement Docker LireLibre est maintenant opérationnel !**
