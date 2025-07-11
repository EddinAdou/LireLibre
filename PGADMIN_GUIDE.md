# Guide pgAdmin - Interface de gestion PostgreSQL

## 🚀 Accès à pgAdmin

Une fois les services Docker démarrés, pgAdmin est accessible à l'adresse :
**http://localhost:5050**

## 🔐 Connexion à pgAdmin

### Identifiants de connexion pgAdmin :
- **Email** : `admin@lirelibre.fr`
- **Mot de passe** : `admin123`

## 🗄️ Configuration du serveur PostgreSQL

La connexion à la base de données LireLibre est pré-configurée avec les paramètres suivants :

### Informations de connexion :
- **Nom du serveur** : `LireLibre Database`
- **Host** : `database` (nom du service Docker)
- **Port** : `5432`
- **Base de données** : `lirelibre`
- **Utilisateur** : `lirelibre`
- **Mot de passe** : `lirelibre_password`

## 📊 Utilisation de pgAdmin

### 1. **Se connecter**
1. Ouvrez http://localhost:5050 dans votre navigateur
2. Connectez-vous avec `admin@lirelibre.fr` / `admin123`
3. Le serveur "LireLibre Database" devrait apparaître dans le panneau de gauche

### 2. **Explorer la base de données**
- Développez `Servers` > `LireLibre Database` > `Databases` > `lirelibre`
- Naviguez dans `Schemas` > `public` > `Tables`

### 3. **Exécuter des requêtes SQL**
- Clic droit sur la base de données `lirelibre`
- Sélectionnez `Query Tool`
- Vous pouvez maintenant exécuter des requêtes SQL

### 4. **Visualiser les données**
- Clic droit sur une table (ex: `users`, `stories`)
- Sélectionnez `View/Edit Data` > `All Rows`

## 🔍 Requêtes SQL utiles

### Voir toutes les tables :
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Compter les utilisateurs :
```sql
SELECT COUNT(*) FROM users;
```

### Voir les dernières histoires :
```sql
SELECT id, title, created_at 
FROM stories 
ORDER BY created_at DESC 
LIMIT 10;
```

### Voir les utilisateurs avec leurs histoires :
```sql
SELECT u.email, s.title, s.created_at
FROM users u
JOIN stories s ON u.id = s.author_id
ORDER BY s.created_at DESC;
```

## 🛠️ Fonctionnalités avancées

### Import/Export de données
- **Import** : Tools > Import/Export Data
- **Export** : Clic droit sur table > Export
- **Backup** : Clic droit sur database > Backup

### Gestion des utilisateurs
- `Login/Group Roles` pour gérer les permissions
- Créer de nouveaux utilisateurs PostgreSQL

### Monitoring
- `Dashboard` pour voir les statistiques en temps réel
- `Server Activity` pour monitoring des connexions

## 🚨 Notes importantes

1. **Persistance des données** : Les données PostgreSQL sont persistées dans un volume Docker `postgres_data`
2. **Accès réseau** : pgAdmin peut uniquement accéder à PostgreSQL via le réseau Docker
3. **Sécurité** : En production, changez les mots de passe par défaut !

## 🔧 Dépannage

### pgAdmin ne se connecte pas à PostgreSQL :
1. Vérifiez que les services sont démarrés : `docker-compose ps`
2. Vérifiez les logs : `docker-compose logs database`
3. Redémarrez les services : `docker-compose restart`

### Mot de passe oublié :
```bash
# Réinitialiser pgAdmin
docker-compose down
docker volume rm docker_pgadmin_data
docker-compose up -d pgadmin
```

## 📱 Alternative : Connexion directe

Vous pouvez aussi vous connecter directement à PostgreSQL depuis votre machine :

```bash
# Via Docker
docker exec -it docker-database-1 psql -U lirelibre -d lirelibre

# Via client local (si installé)
psql -h localhost -p 5432 -U lirelibre -d lirelibre
```
