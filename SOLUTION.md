# ⚡ SOLUTION RAPIDE

## Problème rencontré
```
❌ Node.js n'est pas installé.
⚠️  Redémarrez PowerShell et relancez ce script
```

## 🔧 Solution (3 étapes simples)

### 1. Fermer cette fenêtre PowerShell
Fermez complètement la fenêtre PowerShell actuelle.

### 2. Ouvrir une nouvelle fenêtre PowerShell
- Clic droit sur le menu Démarrer → "Terminal" ou "PowerShell"
- Ou appuyez sur `Win + X` puis `A`

### 3. Relancer l'installation
```powershell
# Aller dans le dossier du projet
cd C:\Users\yadou\Desktop\LireLibre

# Lancer l'installation complète
.\setup.ps1
```

## 🎯 Résultat attendu
Après ces étapes, vous devriez voir :
```
✅ Node.js: v18.x.x (ou plus récent)
✅ Dépendances frontend installées
✅ Services démarrés avec succès!
🎉 Installation terminée!
```

## 🌐 Accès à l'application
- **Frontend** : http://localhost:3000
- **API** : http://localhost:8080/api

---

**Note** : Le redémarrage de PowerShell est nécessaire pour que Node.js soit détecté dans le PATH système.
