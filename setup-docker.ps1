# Script de configuration LireLibre avec Docker
Write-Host "=== Configuration LireLibre avec Docker ===" -ForegroundColor Cyan
Write-Host "Utilisation de Node.js via Docker..." -ForegroundColor Yellow

# Verification Docker
Write-Host "Verification de Docker..." -ForegroundColor Yellow
try {
    docker --version
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR: Docker n'est pas disponible" -ForegroundColor Red
        Write-Host "Veuillez demarrer Docker Desktop" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "Docker detecte et fonctionnel" -ForegroundColor Green
} catch {
    Write-Host "ERREUR: Docker n'est pas disponible" -ForegroundColor Red
    exit 1
}

# Installation des dependances frontend avec Docker
Write-Host "Installation des dependances frontend avec Docker..." -ForegroundColor Yellow

# Creer le fichier package.json s'il n'existe pas
if (!(Test-Path "frontend\package.json")) {
    Write-Host "ERREUR: frontend/package.json manquant" -ForegroundColor Red
    exit 1
}

# Installer les dependances avec Docker
docker run --rm -v "${PWD}/frontend:/app" -w /app node:22-alpine npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependances frontend installees avec succes" -ForegroundColor Green
} else {
    Write-Host "Echec de l'installation des dependances" -ForegroundColor Red
    exit 1
}

# Creation des fichiers d'environnement
Write-Host "Creation des fichiers d'environnement..." -ForegroundColor Yellow

# Frontend .env
if (!(Test-Path "frontend\.env")) {
    $frontendEnv = @"
VITE_API_BASE_URL=http://localhost:8080/api
VITE_NODE_ENV=development
"@
    $frontendEnv | Out-File -FilePath "frontend\.env" -Encoding UTF8
    Write-Host "Fichier frontend/.env cree" -ForegroundColor Green
}

# Backend .env
if (!(Test-Path "backend\.env")) {
    $backendEnv = @"
APP_ENV=dev
APP_SECRET=your-secret-key-change-this-in-production
DATABASE_URL=postgresql://lirelibre:lirelibre_password@database:5432/lirelibre
REDIS_URL=redis://redis:6379
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=your-jwt-passphrase-change-this
CORS_ALLOW_ORIGIN=http://localhost:3000
"@
    $backendEnv | Out-File -FilePath "backend\.env" -Encoding UTF8
    Write-Host "Fichier backend/.env cree" -ForegroundColor Green
}

# Demarrage des services Docker
Write-Host "Demarrage des services Docker..." -ForegroundColor Yellow
Set-Location "docker"
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "Services demarres avec succes!" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== Installation terminee! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Accedez a votre application:" -ForegroundColor Cyan
    Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   - Backend API: http://localhost:8080/api" -ForegroundColor White
    Write-Host ""
    Write-Host "Commandes utiles:" -ForegroundColor Yellow
    Write-Host "   - Arreter: docker-compose down" -ForegroundColor White
    Write-Host "   - Logs: docker-compose logs -f" -ForegroundColor White
    Write-Host "   - Developper frontend: docker run --rm -v `${PWD}/../frontend:/app -w /app -p 3000:3000 node:22-alpine npm run dev" -ForegroundColor White
} else {
    Write-Host "Echec du demarrage des services Docker" -ForegroundColor Red
    exit 1
}

Set-Location ".."
