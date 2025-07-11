# Script de configuration LireLibre
Write-Host "=== Configuration de LireLibre ===" -ForegroundColor Cyan

# Verification Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js detecte: $nodeVersion" -ForegroundColor Green
    
    # Installation des dependances frontend
    Write-Host "Installation des dependances frontend..." -ForegroundColor Yellow
    Set-Location "frontend"
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Dependances frontend installees avec succes" -ForegroundColor Green
    } else {
        Write-Host "Echec de l'installation des dependances" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ".."
    
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
    
    # Verification Docker
    Write-Host "Verification de Docker..." -ForegroundColor Yellow
    docker --version
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR: Docker n'est pas disponible" -ForegroundColor Red
        Write-Host "Veuillez demarrer Docker Desktop" -ForegroundColor Yellow
        exit 1
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
    } else {
        Write-Host "Echec du demarrage des services Docker" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ".."
    
} catch {
    Write-Host "ERREUR: Node.js n'est pas encore disponible" -ForegroundColor Red
    Write-Host ""
    Write-Host "SOLUTION:" -ForegroundColor Yellow
    Write-Host "1. Fermez cette fenetre PowerShell" -ForegroundColor White
    Write-Host "2. Ouvrez une nouvelle fenetre PowerShell" -ForegroundColor White
    Write-Host "3. Tapez: cd C:\Users\yadou\Desktop\LireLibre" -ForegroundColor White
    Write-Host "4. Tapez: .\setup-clean.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "Node.js doit etre redémarre pour etre reconnu dans PATH" -ForegroundColor Cyan
}
