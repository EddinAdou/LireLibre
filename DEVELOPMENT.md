# LireLibre - Guide de Développement

## 🔀 Stratégie de Branches

### Branches principales
- **`main`** : Code de production, toujours stable
- **`develop`** : Branche de développement, intégration des features

### Branches de travail
- **`feature/nom-feature`** : Nouvelles fonctionnalités
- **`bugfix/nom-bug`** : Corrections de bugs
- **`hotfix/nom-hotfix`** : Corrections urgentes en production
- **`release/vX.Y.Z`** : Préparation des releases

## 📝 Convention de Commits

Utilisez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types de commits
- **`feat`** : Nouvelle fonctionnalité
- **`fix`** : Correction de bug
- **`docs`** : Documentation
- **`style`** : Formatage, point-virgules manquants, etc.
- **`refactor`** : Refactoring du code
- **`test`** : Ajout ou modification de tests
- **`chore`** : Maintenance, outils, configuration

### Exemples
```bash
feat(auth): add JWT authentication system
fix(stories): resolve pagination bug on story list
docs: update API documentation
style(frontend): format React components with Prettier
refactor(backend): optimize database queries
test(auth): add unit tests for login functionality
chore(docker): update PostgreSQL to version 15
```

## 🚀 Workflow de Développement

### 1. Créer une nouvelle feature
```bash
# Créer et basculer sur une nouvelle branche feature
git checkout -b feature/story-collaboration

# Travailler sur la feature...
git add .
git commit -m "feat(stories): add real-time collaboration system"

# Pousser la branche
git push -u origin feature/story-collaboration
```

### 2. Créer une Pull Request
- Titre descriptif avec le type de changement
- Description détaillée des modifications
- Lier les issues/tickets concernés
- Demander une review

### 3. Merger et nettoyer
```bash
# Après merge de la PR
git checkout main
git pull origin main
git branch -d feature/story-collaboration
```

## 📊 Versioning Sémantique

### Format: `MAJOR.MINOR.PATCH`

- **MAJOR** : Changements incompatibles (breaking changes)
- **MINOR** : Nouvelles fonctionnalités compatibles
- **PATCH** : Corrections de bugs compatibles

### Commandes de release
```bash
# Release patch (0.1.0 → 0.1.1)
npm run version:patch
npm run release patch

# Release minor (0.1.1 → 0.2.0)
npm run version:minor
npm run release minor

# Release major (0.2.0 → 1.0.0)
npm run version:major
npm run release major
```

## 🏷️ Tags et Releases

### Création automatique
```bash
# Créer une release patch
npm run release patch

# Publier
git push origin main
git push origin --tags
```

### Tags manuels
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

## 🔍 Code Review Guidelines

### Checklist du Reviewer
- [ ] Le code suit les conventions de style
- [ ] Les tests passent
- [ ] La documentation est à jour
- [ ] Pas de code dupliqué
- [ ] Performance acceptable
- [ ] Sécurité respectée
- [ ] Commits suivent la convention

### Checklist de l'Auteur
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Changelog mis à jour si nécessaire
- [ ] Pas de console.log/debug oubliés
- [ ] Variables et fonctions nommées clairement

## 🐛 Hotfix Process

```bash
# Créer hotfix depuis main
git checkout main
git checkout -b hotfix/critical-security-fix

# Appliquer le fix
git commit -m "fix(security): patch XSS vulnerability"

# Release hotfix
npm run release patch

# Merger dans main et develop
git checkout main
git merge hotfix/critical-security-fix
git checkout develop
git merge hotfix/critical-security-fix

# Nettoyer
git branch -d hotfix/critical-security-fix
```

## 📈 Métriques et Monitoring

### Branches actives
```bash
# Voir toutes les branches
git branch -a

# Nettoyer les branches mergées
git branch --merged | grep -v "\*\|main\|develop" | xargs -n 1 git branch -d
```

### Historique des releases
```bash
# Voir les tags
git tag -l

# Voir les changements entre versions
git log v0.1.0..v0.2.0 --oneline
```
