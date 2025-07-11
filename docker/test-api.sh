#!/bin/bash

# Script de test pour l'API LireLibre
API_BASE="http://localhost:8080/api"

echo "=== Test de l'API LireLibre ==="
echo ""

# Test 1: Santé de l'API
echo "1. Test de santé de l'API..."
curl -s "$API_BASE/health" | jq . || echo "Erreur: l'API n'est pas accessible"
echo ""

# Test 2: Inscription d'un utilisateur
echo "2. Inscription d'un nouvel utilisateur..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }')

echo "$REGISTER_RESPONSE" | jq .
echo ""

# Extraire le token
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token // empty')

if [ -n "$TOKEN" ]; then
    echo "Token reçu: ${TOKEN:0:50}..."
    echo ""
    
    # Test 3: Connexion
    echo "3. Test de connexion..."
    LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "password123"
      }')
    
    echo "$LOGIN_RESPONSE" | jq .
    echo ""
    
    # Test 4: Profil utilisateur
    echo "4. Récupération du profil..."
    curl -s -X GET "$API_BASE/users/profile" \
      -H "Authorization: Bearer $TOKEN" | jq .
    echo ""
    
    # Test 5: Création d'une histoire
    echo "5. Création d'une histoire..."
    STORY_RESPONSE=$(curl -s -X POST "$API_BASE/stories" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{
        "title": "Mon Histoire de Test",
        "description": "Une histoire créée pour tester l'\''API",
        "content": "Il était une fois...",
        "category": "fantasy",
        "isPrivate": false,
        "allowCollaboration": true
      }')
    
    echo "$STORY_RESPONSE" | jq .
    STORY_ID=$(echo "$STORY_RESPONSE" | jq -r '.id // empty')
    echo ""
    
    # Test 6: Liste des histoires
    echo "6. Liste des histoires..."
    curl -s -X GET "$API_BASE/stories" | jq .
    echo ""
    
    if [ -n "$STORY_ID" ]; then
        # Test 7: Ajout d'un commentaire
        echo "7. Ajout d'un commentaire..."
        curl -s -X POST "$API_BASE/comments" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -d "{
            \"storyId\": $STORY_ID,
            \"content\": \"Excellent début d'histoire !\"
          }" | jq .
        echo ""
        
        # Test 8: Commentaires de l'histoire
        echo "8. Commentaires de l'histoire..."
        curl -s -X GET "$API_BASE/stories/$STORY_ID/comments" | jq .
        echo ""
    fi
    
else
    echo "Erreur: Impossible d'obtenir un token d'authentification"
fi

echo "=== Fin des tests ==="
