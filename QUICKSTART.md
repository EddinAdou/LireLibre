# 🚀 DÉMARRAGE RAPIDE - LireLibre

## Option 1 : Installation automatique (Recommandée)

**Étape 1 : Aller dans le dossier du projet**
```powershell
cd C:\Users\yadou\Desktop\LireLibre
```

**Étape 2 : Lancer l'installation**
```powershell
.\install.ps1
```

Le script va :
- ✅ Vérifier Docker et Git
- 📦 Installer Node.js automatiquement si manquant
- ⚙️ Configurer tous les fichiers nécessaires
- 🚀 Démarrer l'application

## Option 2 : Installation manuelle

### 1. Installer Node.js
```powershell
winget install OpenJS.NodeJS
```

### 2. Installer les dépendances
```powershell
cd frontend
npm install
cd ..
```

### 3. Créer les fichiers de configuration
```powershell
copy frontend\.env.example frontend\.env
```

### 4. Démarrer avec Docker
```powershell
cd docker
docker-compose up -d
```

## 🌐 Accès à l'application

- **Application** : http://localhost:3000
- **API** : http://localhost:8080/api

## 🛑 Pour arrêter

```powershell
cd docker
docker-compose down
```

## ❗ En cas de problème

1. **Vérifier que Docker Desktop est démarré**
2. **Redémarrer PowerShell après installation Node.js**
3. **Changer les ports si occupés** (dans docker-compose.yml)

## 📞 Support

- Voir `DEMARRAGE.md` pour plus de détails
- Consulter le `README.md` pour la documentation complète
