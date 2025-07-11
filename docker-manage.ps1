# Script de gestion Docker pour LireLibre
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("up", "down", "build", "logs", "status", "clean", "restart", "install")]
    [string]$Action,
    
    [string]$Service = ""
)

# Configuration des couleurs
function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor Cyan
}

# Vérification de Docker
function Test-Docker {
    try {
        $dockerVersion = docker --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Info "Docker détecté: $dockerVersion"
            return $true
        }
    } catch {
        Write-Error "Docker n'est pas installé ou pas accessible"
        Write-Error "Installez Docker Desktop depuis: https://www.docker.com/products/docker-desktop"
        return $false
    }
    return $false
}

# Vérification de Docker Compose
function Test-DockerCompose {
    try {
        $composeVersion = docker compose version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Info "Docker Compose détecté: $composeVersion"
            return $true
        }
    } catch {
        Write-Error "Docker Compose n'est pas disponible"
        return $false
    }
    return $false
}

# Installation et première configuration
function Install-Environment {
    Write-Info "🚀 Configuration initiale de l'environnement Docker..."
    
    # Vérifier les prérequis
    if (!(Test-Docker) -or !(Test-DockerCompose)) {
        exit 1
    }
    
    # Construire les images
    Write-Info "📦 Construction des images Docker..."
    docker compose build --no-cache
    
    # Démarrer les services
    Write-Info "🚀 Démarrage des services..."
    docker compose up -d
    
    # Attendre que les services soient prêts
    Write-Info "⏳ Attente du démarrage des services..."
    Start-Sleep -Seconds 10
    
    # Installer les dépendances backend
    Write-Info "📚 Installation des dépendances backend..."
    docker compose exec backend composer install
    
    # Générer les clés JWT
    Write-Info "🔐 Génération des clés JWT..."
    docker compose exec backend php bin/console lexik:jwt:generate-keypair --skip-if-exists
    
    # Créer la base de données
    Write-Info "🗄️ Création de la base de données..."
    docker compose exec backend php bin/console doctrine:database:create --if-not-exists
    
    # Exécuter les migrations
    Write-Info "🔄 Exécution des migrations..."
    docker compose exec backend php bin/console doctrine:migrations:migrate --no-interaction
    
    Write-Success "✅ Environnement installé avec succès !"
    Show-URLs
}

# Démarrer les services
function Start-Services {
    Write-Info "🚀 Démarrage des services Docker..."
    
    if (!(Test-Docker) -or !(Test-DockerCompose)) {
        exit 1
    }
    
    docker compose up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Services démarrés avec succès !"
        Show-URLs
    } else {
        Write-Error "❌ Erreur lors du démarrage des services"
    }
}

# Arrêter les services
function Stop-Services {
    Write-Info "🛑 Arrêt des services Docker..."
    
    docker compose down
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Services arrêtés avec succès !"
    } else {
        Write-Error "❌ Erreur lors de l'arrêt des services"
    }
}

# Construire les images
function Build-Images {
    Write-Info "📦 Construction des images Docker..."
    
    if ($Service) {
        docker compose build $Service
    } else {
        docker compose build
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Images construites avec succès !"
    } else {
        Write-Error "❌ Erreur lors de la construction"
    }
}

# Afficher les logs
function Show-Logs {
    if ($Service) {
        docker compose logs -f $Service
    } else {
        docker compose logs -f
    }
}

# Afficher le statut
function Show-Status {
    Write-Info "📊 Statut des services Docker..."
    docker compose ps
    
    Write-Host ""
    Write-Info "📈 Utilisation des ressources..."
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
}

# Nettoyer l'environnement
function Clean-Environment {
    Write-Warning "🧹 Nettoyage de l'environnement Docker..."
    Write-Warning "Cela va supprimer les volumes et toutes les données !"
    
    $confirmation = Read-Host "Êtes-vous sûr ? (y/N)"
    if ($confirmation -eq "y" -or $confirmation -eq "Y") {
        docker compose down -v
        docker system prune -f
        Write-Success "✅ Environnement nettoyé !"
    } else {
        Write-Info "Opération annulée."
    }
}

# Redémarrer les services
function Restart-Services {
    Write-Info "🔄 Redémarrage des services..."
    
    if ($Service) {
        docker compose restart $Service
    } else {
        docker compose restart
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Services redémarrés avec succès !"
        Show-URLs
    } else {
        Write-Error "❌ Erreur lors du redémarrage"
    }
}

# Afficher les URLs d'accès
function Show-URLs {
    Write-Host ""
    Write-Success "🌐 URLs d'accès à l'application:"
    Write-Host "  Frontend (React):     http://localhost:3000" -ForegroundColor Cyan
    Write-Host "  Backend API:          http://localhost:8080" -ForegroundColor Cyan
    Write-Host "  pgAdmin:              http://localhost:5050" -ForegroundColor Cyan
    Write-Host "  PostgreSQL:           localhost:5432" -ForegroundColor Cyan
    Write-Host "  Redis:                localhost:6379" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Info "🔐 Identifiants pgAdmin:"
    Write-Host "  Email:     admin@lirelibre.fr" -ForegroundColor Yellow
    Write-Host "  Password:  admin123" -ForegroundColor Yellow
    
    Write-Host ""
    Write-Info "🗄️ Base de données PostgreSQL:"
    Write-Host "  Host:      database (dans Docker) / localhost (externe)" -ForegroundColor Yellow
    Write-Host "  Port:      5432" -ForegroundColor Yellow
    Write-Host "  Database:  lirelibre" -ForegroundColor Yellow
    Write-Host "  User:      lirelibre" -ForegroundColor Yellow
    Write-Host "  Password:  lirelibre_password" -ForegroundColor Yellow
}

# Exécution selon l'action demandée
switch ($Action) {
    "install" {
        Install-Environment
    }
    "up" {
        Start-Services
    }
    "down" {
        Stop-Services
    }
    "build" {
        Build-Images
    }
    "logs" {
        Show-Logs
    }
    "status" {
        Show-Status
    }
    "clean" {
        Clean-Environment
    }
    "restart" {
        Restart-Services
    }
}

Write-Host ""
Write-Host "Usage: .\docker-manage.ps1 -Action <install|up|down|build|logs|status|clean|restart> [-Service <nom_service>]" -ForegroundColor Cyan
Write-Host ""
Write-Host "Exemples:" -ForegroundColor Cyan
Write-Host "  .\docker-manage.ps1 -Action install           # Installation complète" -ForegroundColor Gray
Write-Host "  .\docker-manage.ps1 -Action up                # Démarrer tous les services" -ForegroundColor Gray
Write-Host "  .\docker-manage.ps1 -Action logs -Service backend  # Logs du backend" -ForegroundColor Gray
Write-Host "  .\docker-manage.ps1 -Action status            # Statut des services" -ForegroundColor Gray
