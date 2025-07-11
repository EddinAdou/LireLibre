# Script de test pour l'API LireLibre (PowerShell)
$ApiBase = "http://localhost:8080/api"

Write-Host "=== Test de l'API LireLibre ===" -ForegroundColor Green
Write-Host ""

function Invoke-ApiTest {
    param(
        [string]$Method = "GET",
        [string]$Endpoint,
        [hashtable]$Body = @{},
        [string]$Token = ""
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }
    
    $uri = "$ApiBase$Endpoint"
    
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers
        } else {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $response = Invoke-RestMethod -Uri $uri -Method $Method -Headers $headers -Body $jsonBody
        }
        return $response
    }
    catch {
        Write-Host "Erreur API: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test 1: Inscription
Write-Host "1. Inscription d'un nouvel utilisateur..." -ForegroundColor Yellow
$registerData = @{
    username = "testuser"
    email = "test@example.com"
    password = "password123"
    firstName = "Test"
    lastName = "User"
}

$registerResponse = Invoke-ApiTest -Method "POST" -Endpoint "/auth/register" -Body $registerData
if ($registerResponse) {
    $registerResponse | ConvertTo-Json -Depth 10 | Write-Host
    $token = $registerResponse.token
    Write-Host ""
    
    if ($token) {
        Write-Host "Token reçu: $($token.Substring(0, [Math]::Min(50, $token.Length)))..." -ForegroundColor Green
        Write-Host ""
        
        # Test 2: Connexion
        Write-Host "2. Test de connexion..." -ForegroundColor Yellow
        $loginData = @{
            email = "test@example.com"
            password = "password123"
        }
        $loginResponse = Invoke-ApiTest -Method "POST" -Endpoint "/auth/login" -Body $loginData
        if ($loginResponse) {
            $loginResponse | ConvertTo-Json -Depth 10 | Write-Host
        }
        Write-Host ""
        
        # Test 3: Profil utilisateur
        Write-Host "3. Récupération du profil..." -ForegroundColor Yellow
        $profileResponse = Invoke-ApiTest -Method "GET" -Endpoint "/users/profile" -Token $token
        if ($profileResponse) {
            $profileResponse | ConvertTo-Json -Depth 10 | Write-Host
        }
        Write-Host ""
        
        # Test 4: Création d'une histoire
        Write-Host "4. Création d'une histoire..." -ForegroundColor Yellow
        $storyData = @{
            title = "Mon Histoire de Test"
            description = "Une histoire créée pour tester l'API"
            content = "Il était une fois..."
            category = "fantasy"
            isPrivate = $false
            allowCollaboration = $true
        }
        
        $storyResponse = Invoke-ApiTest -Method "POST" -Endpoint "/stories" -Body $storyData -Token $token
        if ($storyResponse) {
            $storyResponse | ConvertTo-Json -Depth 10 | Write-Host
            $storyId = $storyResponse.id
        }
        Write-Host ""
        
        # Test 5: Liste des histoires
        Write-Host "5. Liste des histoires..." -ForegroundColor Yellow
        $storiesResponse = Invoke-ApiTest -Method "GET" -Endpoint "/stories"
        if ($storiesResponse) {
            $storiesResponse | ConvertTo-Json -Depth 10 | Write-Host
        }
        Write-Host ""
        
        if ($storyId) {
            # Test 6: Ajout d'un commentaire
            Write-Host "6. Ajout d'un commentaire..." -ForegroundColor Yellow
            $commentData = @{
                storyId = $storyId
                content = "Excellent début d'histoire !"
            }
            
            $commentResponse = Invoke-ApiTest -Method "POST" -Endpoint "/comments" -Body $commentData -Token $token
            if ($commentResponse) {
                $commentResponse | ConvertTo-Json -Depth 10 | Write-Host
            }
            Write-Host ""
            
            # Test 7: Commentaires de l'histoire
            Write-Host "7. Commentaires de l'histoire..." -ForegroundColor Yellow
            $commentsResponse = Invoke-ApiTest -Method "GET" -Endpoint "/stories/$storyId/comments"
            if ($commentsResponse) {
                $commentsResponse | ConvertTo-Json -Depth 10 | Write-Host
            }
            Write-Host ""
        }
    }
}

Write-Host "=== Fin des tests ===" -ForegroundColor Green
