# 🚀 Guide Rapide - Workflow LireLibre

## ⚡ Commandes Essentielles

### Développement quotidien

```bash
# Démarrer l'environnement de développement
npm run dev

# Voir les logs en temps réel
npm run logs

# Arrêter tous les services
npm run stop
```

### Workflow Git

```bash
# 1. Créer une nouvelle feature
git checkout develop
git pull origin develop
git checkout -b feature/ma-nouvelle-feature

# 2. Travailler et commiter (suivre les conventions)
git add .
git commit -m "feat(stories): add collaborative editing feature"

# 3. Vérifier la qualité avant push
npm run pr:check

# 4. Créer automatiquement une PR
npm run pr:create

# 5. Après merge, nettoyer
git checkout develop
git pull origin develop
git branch -d feature/ma-nouvelle-feature
```

### Versioning et Releases

```bash
# Release patch (0.1.0 → 0.1.1)
npm run release patch

# Release minor (0.1.1 → 0.2.0) 
npm run release minor

# Release major (0.2.0 → 1.0.0)
npm run release major

# Publier la release
git push origin develop
git push origin --tags
```

## 📝 Convention de Commits

### Format
```
<type>[scope]: <description>

[optional body]
[optional footer]
```

### Types courants
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage, CSS
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

### Exemples
```bash
feat(auth): add OAuth2 Google authentication
fix(stories): resolve story saving issue
docs: update API documentation
style(frontend): improve responsive design
refactor(backend): optimize database queries
test(auth): add login integration tests
chore(docker): update PostgreSQL to v15
```

## 🌟 Branches

- **`main`** : Production (toujours stable)
- **`develop`** : Développement (intégration)
- **`feature/nom`** : Nouvelles fonctionnalités
- **`bugfix/nom`** : Corrections de bugs
- **`hotfix/nom`** : Corrections urgentes

## 📋 Checklist PR

Avant de créer une PR, vérifiez :

- [ ] ✅ Tests passent
- [ ] 📝 Documentation mise à jour
- [ ] 🎨 Code formaté
- [ ] 🐛 Pas de console.log/debug
- [ ] 📖 Message de commit suit la convention
- [ ] 🔍 Self-review effectuée

## 🤖 Automatisation

### Commandes d'automatisation

```bash
# Créer automatiquement une Pull Request
npm run pr:create

# Vérifier la qualité avant push
npm run pr:check

# Voir le statut des pipelines
npm run pipeline:status

# Vérifier la qualité du code
npm run quality:check

# Audit de sécurité
npm run security:audit
```

## 🎯 URLs Importantes

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080/api
- **pgAdmin**: http://localhost:5050
- **Démo Police**: http://localhost:3000/font-demo

## 🆘 Commandes Utiles

```bash
# Voir l'état du projet
git status
docker ps

# Voir les logs d'un service spécifique
docker-compose -f docker/docker-compose.yml logs frontend
docker-compose -f docker/docker-compose.yml logs backend

# Rebuilder un service
docker-compose -f docker/docker-compose.yml up -d --build frontend

# Accéder au container backend
docker-compose -f docker/docker-compose.yml exec backend bash

# Voir les branches
git branch -a

# Nettoyer les branches mergées
git branch --merged | grep -v "\*\|main\|develop" | xargs git branch -d
```

## 🔧 Setup Initial

```bash
# 1. Cloner le projet
git clone https://github.com/EddinAdou/LireLibre.git
cd LireLibre

# 2. Configurer les hooks Git (optionnel mais recommandé)
chmod +x scripts/setup-hooks.sh
./scripts/setup-hooks.sh

# 3. Démarrer l'environnement
npm run dev
```

## 📚 Documentation Complète

- 📖 [Guide de Développement Complet](DEVELOPMENT.md)
- 🤖 [Guide d'Automatisation](docs/AUTOMATION.md)
- 🗄️ [Documentation Database](docs/DATABASE.md)
- 🐘 [Guide pgAdmin](PGADMIN_GUIDE.md)
- 📋 [Changelog](CHANGELOG.md)
