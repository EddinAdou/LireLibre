# 🤖 Guide d'Automatisation LireLibre

## 🚀 Système d'Automatisation Complet

Ce guide explique comment utiliser le système d'automatisation avancé de LireLibre pour gérer les Pull Requests, pipelines, et releases automatiquement.

## 📋 Table des Matières

1. [🔄 Workflow Automatisé](#workflow-automatisé)
2. [🛡️ Vérifications Automatiques](#vérifications-automatiques)
3. [📦 Gestion des Releases](#gestion-des-releases)
4. [🔧 Configuration](#configuration)
5. [📊 Monitoring](#monitoring)

## 🔄 Workflow Automatisé

### 1. Création Automatique de Pull Requests

```bash
# Créer automatiquement une PR depuis votre branche
npm run pr:create

# Le script va :
# ✅ Vérifier que le répertoire est propre
# ✅ Valider les messages de commit
# ✅ Exécuter les tests
# ✅ Générer titre et description automatiquement
# ✅ Créer la PR sur GitHub
```

**Exemple d'utilisation :**

```bash
# 1. Créer une branche feature
git checkout -b feature/user-notifications

# 2. Développer et commiter
git add .
git commit -m "feat(notifications): add real-time user notifications"

# 3. Créer automatiquement la PR
npm run pr:create
```

### 2. Validation Pre-Push

```bash
# Vérifier si votre code est prêt à être poussé
npm run pr:check

# Le script vérifie :
# 🔍 Statut des pipelines GitHub Actions
# 🎨 Qualité du code (linting, build)
# 📝 Messages de commit conventionnels
# 🔒 Vulnérabilités de sécurité
```

## 🛡️ Vérifications Automatiques

### Pipeline CI/CD Complet

Le pipeline s'exécute automatiquement sur :
- **Push** vers `main` ou `develop`
- **Pull Requests** vers `main` ou `develop`
- **Releases** publiées

#### Étapes du Pipeline

1. **🔍 Code Quality & Standards**
   - Validation des messages de commit
   - Linting frontend (ESLint)
   - Standards backend (PHP CodeSniffer)

2. **🧪 Tests Frontend**
   - Installation des dépendances
   - Tests unitaires
   - Build de production

3. **🧪 Tests Backend**
   - Setup PostgreSQL et Redis
   - Installation Composer
   - Tests PHPUnit avec couverture

4. **🔒 Security Analysis**
   - Audit des dépendances npm
   - Audit Composer
   - Scan des vulnérabilités

5. **🚀 Build & Deploy** (main uniquement)
   - Build des images Docker
   - Push vers GitHub Container Registry

6. **📦 Automatic Release** (main uniquement)
   - Génération automatique de version
   - Création de release GitHub
   - Mise à jour du CHANGELOG

7. **📢 Notifications**
   - Notifications de succès/échec

### Protection des Branches

- **`main`** : Push direct interdit, PR obligatoire
- **`develop`** : Tests requis avant merge
- **Hooks Git** : Validation locale avant push

## 📦 Gestion des Releases

### Release Automatique

Les releases sont générées automatiquement basées sur les commits :

```bash
# Types de commits et impact sur la version
feat: nouvelle fonctionnalité    → version minor (0.1.0 → 0.2.0)
fix: correction de bug           → version patch (0.1.0 → 0.1.1)
BREAKING CHANGE:                 → version major (0.1.0 → 1.0.0)
docs: documentation              → pas de release
chore: maintenance               → pas de release
```

### Release Manuelle

```bash
# Release patch (0.1.0 → 0.1.1)
npm run release patch

# Release minor (0.1.0 → 0.2.0)
npm run release minor

# Release major (0.1.0 → 1.0.0)
npm run release major
```

## 🔧 Configuration

### 1. Setup Initial

```bash
# Installer les hooks Git
npm run setup:hooks

# Vérifier la configuration
npm run pr:check
```

### 2. GitHub CLI (Optionnel mais Recommandé)

```bash
# Installer GitHub CLI
# https://cli.github.com/

# Configurer l'authentification
gh auth login

# Vérifier que ça fonctionne
gh repo view
```

### 3. Variables d'Environnement GitHub

Configurez ces secrets dans votre repo GitHub :

- `GITHUB_TOKEN` : Token pour les releases (auto-fourni)
- `SLACK_WEBHOOK_URL` : URL webhook Slack (optionnel)

## 📊 Monitoring

### Commandes de Monitoring

```bash
# Voir le statut des pipelines
npm run pipeline:status

# Suivre un pipeline en cours
npm run pipeline:watch

# Vérifier la qualité du code
npm run quality:check

# Audit de sécurité
npm run security:audit
```

### Dashboard GitHub Actions

Accédez à votre dashboard : `https://github.com/EddinAdou/LireLibre/actions`

## 🎯 Exemples Pratiques

### Workflow Complet Feature

```bash
# 1. Créer une branche
git checkout develop
git pull origin develop
git checkout -b feature/advanced-search

# 2. Développer
# ... code ...
git add .
git commit -m "feat(search): add advanced search with filters"

# 3. Tester localement
npm run quality:check

# 4. Créer automatiquement la PR
npm run pr:create

# 5. Le pipeline s'exécute automatiquement
# 6. Après review et merge → release automatique
```

### Workflow Hotfix

```bash
# 1. Créer hotfix depuis main
git checkout main
git checkout -b hotfix/critical-security-fix

# 2. Appliquer le fix
git commit -m "fix(security): patch XSS vulnerability"

# 3. Vérifier
npm run pr:check

# 4. Créer PR d'urgence
npm run pr:create

# 5. Merge rapide → release patch automatique
```

## 🔍 Dépannage

### Problèmes Courants

**Pipeline qui échoue :**
```bash
# Vérifier les logs
gh run list
gh run view [RUN_ID]

# Reproduire localement
npm run quality:check
```

**Messages de commit invalides :**
```bash
# Format correct
git commit -m "feat(scope): description"
git commit -m "fix(auth): resolve login issue"
git commit -m "docs: update API documentation"
```

**Tests qui échouent :**
```bash
# Frontend
cd frontend && npm run test

# Backend
cd backend && vendor/bin/phpunit
```

## 📈 Métriques et KPIs

Le système track automatiquement :

- ✅ **Taux de succès** des pipelines
- 🚀 **Temps de déploiement** moyen
- 🐛 **Nombre de bugs** détectés
- 📊 **Couverture** de code
- 🔒 **Vulnérabilités** de sécurité

## 🎉 Avantages

- 🤖 **Automatisation complète** du workflow
- 🛡️ **Qualité garantie** par les validations
- 🚀 **Déploiement rapide** et sûr
- 📝 **Documentation** automatique des changements
- 👥 **Collaboration** facilitée avec les PR templates
- 🔍 **Traçabilité** complète des modifications

---

🚀 **Votre workflow est maintenant entièrement automatisé ! Développez sereinement, le système s'occupe du reste.**
