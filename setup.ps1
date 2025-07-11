# Script de vérification post-installation
Write-Host "🔍 Vérification de l'installation..." -ForegroundColor Yellow

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    
    # Continuer avec l'installation complète
    Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Yellow
    Set-Location "frontend"
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dépendances frontend installées" -ForegroundColor Green
    } else {
        Write-Host "❌ Échec de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ".."
    
    # Créer les fichiers d'environnement
    Write-Host "⚙️  Configuration des fichiers d'environnement..." -ForegroundColor Yellow
    
    if (!(Test-Path "frontend\.env")) {
        Copy-Item "frontend\.env.example" "frontend\.env"
        Write-Host "✅ Fichier frontend/.env créé" -ForegroundColor Green
    }
    
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
    
    # Démarrer Docker
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
    } else {
        Write-Host "❌ Échec du démarrage des services Docker" -ForegroundColor Red
        exit 1
    }
    
    Set-Location ".."
    
} catch {
    Write-Host "Node.js n'est pas encore disponible." -ForegroundColor Red
    Write-Host "Solution:" -ForegroundColor Yellow
    Write-Host "   1. Fermez cette fenetre PowerShell" -ForegroundColor White
    Write-Host "   2. Ouvrez une nouvelle fenetre PowerShell" -ForegroundColor White
    Write-Host "   3. Naviguez vers le projet: cd C:\Users\yadou\Desktop\LireLibre" -ForegroundColor White
    Write-Host "   4. Relancez: .\setup.ps1" -ForegroundColor White
}
