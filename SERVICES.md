# Services Docker LireLibre

## 🚀 Services déployés

Tous les services sont maintenant opérationnels avec les ports suivants :

### 🗄️ Base de données
- **PostgreSQL** : `localhost:5433`
  - Database: `lirelibre`
  - Username: `lirelibre`
  - Password: `lirelibre_password`

### 🛠️ Administration
- **pgAdmin** : http://localhost:5051
  - Email: `admin@lirelibre.fr`
  - Password: `admin123`
  - Serveur pré-configuré automatiquement

### 💾 Cache
- **Redis** : `localhost:6380`

### 🔧 Backend
- **API Symfony** : http://localhost:8080
  - PHP 8.3 + Symfony 7.1
  - Nginx reverse proxy

### 🎨 Frontend
- **React App** : http://localhost:3001
  - React + TypeScript + Vite
  - Mode développement avec hot reload

## 📋 Commandes utiles

```bash
# Voir les logs d'un service
docker compose logs [service-name]

# Arrêter tous les services
docker compose down

# Redémarrer un service
docker compose restart [service-name]

# Reconstruire et relancer
docker compose up -d --build

# Accéder au shell d'un conteneur
docker compose exec [service-name] sh
```

## 🔍 Vérification

1. **Base de données** : Connectez-vous à pgAdmin (http://localhost:5051)
2. **API Backend** : Testez http://localhost:8080/api/health
3. **Frontend** : Ouvrez http://localhost:3001
4. **Redis** : Utilisez `docker compose exec redis redis-cli`

## 🎯 Prochaines étapes

1. Configurer les variables d'environnement Symfony
2. Exécuter les migrations de base de données
3. Tester le système d'inscription
4. Valider l'intégration complète

Votre environnement Docker est maintenant parfaitement configuré ! 🎉
