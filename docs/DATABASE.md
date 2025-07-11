# 🗄️ Gestion de la Base de Données avec pgAdmin

## 📋 Accès à pgAdmin

Après avoir démarré les services Docker, vous pouvez accéder à pgAdmin via :

**URL :** http://localhost:8081

**Identifiants de connexion :**
- Email : `admin@lirelibre.local`
- Mot de passe : `admin123`

## 🔗 Connexion à la Base de Données

La connexion à PostgreSQL est pré-configurée avec les paramètres suivants :

- **Nom du serveur :** LireLibre PostgreSQL
- **Host :** database
- **Port :** 5432
- **Base de données :** lirelibre
- **Utilisateur :** lirelibre
- **Mot de passe :** lirelibre_password

## 📊 Tables Disponibles

Dans la base de données `lirelibre`, vous trouverez les tables suivantes :

### `users` - Utilisateurs
- `id` : Identifiant unique
- `username` : Nom d'utilisateur
- `email` : Adresse email
- `password` : Mot de passe haché
- `first_name` : Prénom
- `last_name` : Nom de famille
- `bio` : Biographie
- `avatar` : URL de l'avatar
- `roles` : Rôles (JSON)
- `is_verified` : Email vérifié
- `created_at` : Date de création
- `updated_at` : Date de modification

### `stories` - Histoires
- `id` : Identifiant unique
- `title` : Titre de l'histoire
- `description` : Description
- `content` : Contenu de l'histoire
- `category` : Catégorie
- `is_private` : Histoire privée
- `allow_collaboration` : Collaboration autorisée
- `view_count` : Nombre de vues
- `author_id` : ID de l'auteur (FK vers users)
- `created_at` : Date de création
- `updated_at` : Date de modification

### `comments` - Commentaires
- `id` : Identifiant unique
- `content` : Contenu du commentaire
- `author_id` : ID de l'auteur (FK vers users)
- `story_id` : ID de l'histoire (FK vers stories)
- `parent_id` : ID du commentaire parent (pour les réponses)
- `created_at` : Date de création
- `updated_at` : Date de modification

### `favorites` - Favoris
- `id` : Identifiant unique
- `user_id` : ID de l'utilisateur (FK vers users)
- `story_id` : ID de l'histoire (FK vers stories)
- `created_at` : Date de création

## 🛠️ Opérations Courantes

### Visualiser les données
1. Connectez-vous à pgAdmin
2. Expandez "Servers" > "LireLibre PostgreSQL" > "Databases" > "lirelibre" > "Schemas" > "public" > "Tables"
3. Clic droit sur une table > "View/Edit Data" > "All Rows"

### Exécuter des requêtes SQL
1. Clic droit sur la base de données "lirelibre"
2. Sélectionnez "Query Tool"
3. Tapez votre requête SQL et cliquez sur "Execute"

Exemples de requêtes utiles :
```sql
-- Voir tous les utilisateurs
SELECT * FROM users;

-- Voir toutes les histoires avec leur auteur
SELECT s.title, s.description, u.username as author
FROM stories s
JOIN users u ON s.author_id = u.id;

-- Voir les commentaires d'une histoire
SELECT c.content, u.username as author, c.created_at
FROM comments c
JOIN users u ON c.author_id = u.id
WHERE c.story_id = 1;

-- Statistiques
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM stories) as total_stories,
    (SELECT COUNT(*) FROM comments) as total_comments;
```

## 🔧 Administration

### Sauvegarder la base de données
```bash
docker exec -t postgres pg_dump -U lirelibre lirelibre > backup.sql
```

### Restaurer la base de données
```bash
docker exec -i postgres psql -U lirelibre lirelibre < backup.sql
```

### Accès direct via terminal
```bash
docker exec -it lirelibre-database-1 psql -U lirelibre -d lirelibre
```

## 📱 Alternatives Légères

Si pgAdmin est trop lourd, vous pouvez utiliser :
- **Adminer** : Interface plus légère (ajoutez le service dans docker-compose.yml)
- **DBeaver** : Client desktop gratuit
- **psql** : Client en ligne de commande PostgreSQL
