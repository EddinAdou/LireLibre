#!/bin/bash

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "${BLUE}🔧 Installation des Git Hooks pour LireLibre...${NC}"

# Vérifier qu'on est dans un repo git
if [ ! -d ".git" ]; then
    echo "${RED}❌ Erreur: Pas dans un repository Git${NC}"
    exit 1
fi

# Créer le dossier hooks s'il n'existe pas
mkdir -p .git/hooks

# Copier les hooks
hooks_dir=".githooks"
if [ -d "$hooks_dir" ]; then
    echo "${YELLOW}📋 Copie des hooks...${NC}"
    
    for hook in "$hooks_dir"/*; do
        if [ -f "$hook" ]; then
            hook_name=$(basename "$hook")
            echo "  → $hook_name"
            cp "$hook" ".git/hooks/$hook_name"
            chmod +x ".git/hooks/$hook_name"
        fi
    done
    
    echo "${GREEN}✅ Git Hooks installés avec succès!${NC}"
    echo ""
    echo "${BLUE}Hooks actifs:${NC}"
    echo "  • pre-commit: Vérifications avant commit"
    echo "  • commit-msg: Validation du format des messages"
    echo ""
    echo "${YELLOW}📖 Guide de développement: DEVELOPMENT.md${NC}"
else
    echo "${RED}❌ Dossier .githooks introuvable${NC}"
    exit 1
fi

# Installer les dépendances de dev si npm est disponible
if command -v npm &> /dev/null; then
    echo "${YELLOW}📦 Installation des dépendances de développement...${NC}"
    npm install
    echo "${GREEN}✅ Dépendances installées${NC}"
fi

echo ""
echo "${GREEN}🚀 Configuration terminée! Bon développement!${NC}"
