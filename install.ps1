# Script d'installation automatique pour LireLibre
# Usage: .\install.ps1

Write-Host "🚀 Installation de LireLibre..." -ForegroundColor Green

# Vérification des prérequis
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas installé. Installez Docker Desktop depuis https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé." -ForegroundColor Red
    Write-Host "Installation automatique de Node.js..." -ForegroundColor Yellow
    
    try {
        winget install OpenJS.NodeJS
        Write-Host "✅ Node.js installé avec succès" -ForegroundColor Green
        Write-Host "⚠️  Redémarrez PowerShell et relancez ce script" -ForegroundColor Yellow
        exit 0
    } catch {
        Write-Host "❌ Échec de l'installation automatique. Installez manuellement depuis https://nodejs.org/" -ForegroundColor Red
        exit 1
    }
}

# Installation des dépendances frontend
Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Yellow
Set-Location "frontend"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Échec de l'installation des dépendances npm" -ForegroundColor Red
    exit 1
}
Set-Location ".."

# Création des fichiers d'environnement
Write-Host "⚙️  Configuration des fichiers d'environnement..." -ForegroundColor Yellow

# Frontend .env
if (!(Test-Path "frontend\.env")) {
    Copy-Item "frontend\.env.example" "frontend\.env"
    Write-Host "✅ Fichier frontend/.env créé" -ForegroundColor Green
}

# Backend .env
if (!(Test-Path "backend\.env")) {
    $backendEnv = @"
APP_ENV=dev
APP_SECRET=change-this-secret-key-in-production-$(Get-Random)
DATABASE_URL=postgresql://lirelibre:lirelibre_password@database:5432/lirelibre
REDIS_URL=redis://redis:6379
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=change-this-jwt-passphrase-$(Get-Random)
CORS_ALLOW_ORIGIN=http://localhost:3000
"@
    $backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8
    Write-Host "✅ Fichier backend/.env créé" -ForegroundColor Green
}

# Vérification que Docker est en cours d'exécution
Write-Host "🐳 Vérification de Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✅ Docker est en cours d'exécution" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas en cours d'exécution. Démarrez Docker Desktop" -ForegroundColor Red
    exit 1
}

# Démarrage des services Docker
Write-Host "🚀 Démarrage des services Docker..." -ForegroundColor Yellow
Set-Location "docker"
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Services démarrés avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Installation terminée!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Accédez à votre application:" -ForegroundColor Cyan
    Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   - Backend API: http://localhost:8080/api" -ForegroundColor White
    Write-Host ""
    Write-Host "🛠️  Commandes utiles:" -ForegroundColor Cyan
    Write-Host "   - Arrêter: docker-compose down" -ForegroundColor White
    Write-Host "   - Logs: docker-compose logs -f" -ForegroundColor White
    Write-Host "   - Statut: docker-compose ps" -ForegroundColor White
} else {
    Write-Host "❌ Échec du démarrage des services Docker" -ForegroundColor Red
    exit 1
}

Set-Location ".."
