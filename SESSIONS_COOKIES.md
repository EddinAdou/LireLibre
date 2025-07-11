# 🍪 Système de Sessions et Cookies - LireLibre

## 📋 Aperçu

Ce système complet de gestion des sessions et cookies améliore l'expérience utilisateur avec une authentification persistante, un refresh automatique des tokens et une gestion intelligente des sessions.

## ✨ Fonctionnalités

### 🔐 Authentification Améliorée
- **Se souvenir de moi** : Option de connexion persistante
- **Refresh automatique** : Renouvellement transparent des tokens
- **Sessions sécurisées** : Gestion intelligente des cookies et localStorage
- **Timeout d'inactivité** : Déconnexion automatique après inactivité
- **Session maximale** : Limite de 8h par session pour la sécurité

### 🍪 Gestion des Cookies
- **Cookies sécurisés** : HttpOnly, Secure, SameSite=Strict
- **Expiration intelligente** : 7 jours (Se souvenir) vs Session
- **Nettoyage automatique** : Suppression propre lors de la déconnexion
- **Fallback localStorage** : Compatibilité avec l'ancien système

### ⚡ Refresh Token Automatique
- **Refresh préventif** : 5 minutes avant expiration
- **Rotation des tokens** : Sécurité renforcée
- **Gestion des erreurs** : Déconnexion automatique si refresh échoue
- **Notifications** : Callbacks pour informer l'UI

## 🛠️ Architecture Technique

### Services Frontend

#### 1. **CookieService** (`/frontend/src/services/cookieService.ts`)
```typescript
// Gestion sécurisée des cookies d'authentification
cookieService.setAuthToken(token, rememberMe);
cookieService.setRefreshToken(refreshToken, rememberMe);
cookieService.setRememberMe(true);
cookieService.clearAuthCookies();
```

#### 2. **SessionService** (`/frontend/src/services/sessionService.ts`)
```typescript
// Gestion complète des sessions avec auto-refresh
sessionService.initialize({
  onSessionExpired: () => logout(),
  onTokenRefreshed: (token) => updateToken(token)
});
```

#### 3. **AuthService mis à jour** (`/frontend/src/services/authService.ts`)
```typescript
// Support des refresh tokens
const response = await authService.refreshToken();
```

### Backend

#### 1. **Endpoint Refresh Token** (`/backend/src/Controller/AuthController.php`)
```php
#[Route('/auth/refresh', methods: ['POST'])]
public function refreshToken(Request $request): JsonResponse
{
    // Validation et génération de nouveaux tokens
}
```

## 🎯 Configuration

### Paramètres Session (modifiables)
```typescript
const config = {
  refreshThreshold: 5,      // Refresh 5min avant expiration
  sessionTimeout: 30,       // Timeout 30min d'inactivité
  maxSessionDuration: 480   // Maximum 8h par session
};
```

### Cookies sécurisés
```typescript
const defaultOptions = {
  secure: true,           // HTTPS uniquement
  sameSite: 'strict',     // Protection CSRF
  path: '/'               // Accessible sur tout le site
};
```

## 🧪 Tests et Debug

### Composant de Debug (`/frontend/src/components/SessionDebug.tsx`)
Un composant de développement qui affiche :
- ✅ État de la session en temps réel
- 🎫 Informations sur les tokens (expiration, etc.)
- 🍪 État des cookies et localStorage
- 🛠️ Actions de debug (force logout, console log)

Pour l'activer, ajoutez dans votre composant principal :
```tsx
{process.env.NODE_ENV === 'development' && <SessionDebug />}
```

## 🔄 Flux d'Authentification

### 1. **Connexion**
```
1. Utilisateur saisit email/password + "Se souvenir de moi"
2. Backend valide et retourne token + refresh_token
3. Frontend stocke dans cookies (durée selon "Se souvenir")
4. Session démarre avec timers automatiques
```

### 2. **Navigation**
```
1. Chaque requête utilise le token des cookies
2. Service vérifie automatiquement l'expiration
3. Refresh automatique si nécessaire
4. Reset du timer d'inactivité à chaque activité
```

### 3. **Refresh Automatique**
```
1. Timer déclenché 5min avant expiration
2. Appel /auth/refresh avec refresh_token
3. Mise à jour des cookies avec nouveaux tokens
4. Programmation du prochain refresh
```

### 4. **Déconnexion**
```
1. Nettoyage de tous les cookies
2. Arrêt des timers
3. Suppression localStorage (fallback)
4. Redirection vers login
```

## 📱 Expérience Utilisateur

### Avec "Se souvenir de moi"
- ✅ Session persiste 7 jours
- ✅ Pas de timeout d'inactivité
- ✅ Reconnexion automatique au retour

### Sans "Se souvenir de moi"
- ⏱️ Session limitée à la fermeture du navigateur
- ⏱️ Timeout après 30min d'inactivité
- 🔄 Refresh automatique pendant la session

## 🚀 Utilisation

### Dans vos composants React
```tsx
const { sessionInfo, login, logout } = useAuth();

// Connexion avec options
await login({
  email: 'user@example.com',
  password: 'password',
  rememberMe: true  // ✨ Nouvelle option
});

// Informations de session
console.log(sessionInfo.duration);    // Durée en minutes
console.log(sessionInfo.rememberMe);  // État "se souvenir"
console.log(sessionInfo.isActive);    // Session active
```

### Gestion d'erreurs
```tsx
// Les erreurs de refresh sont gérées automatiquement
// Déconnexion automatique si refresh impossible
sessionService.initialize({
  onSessionExpired: () => {
    toast.error('Session expirée, reconnectez-vous');
    navigate('/login');
  }
});
```

## 🔒 Sécurité

### Mesures implémentées
- 🍪 **Cookies HttpOnly** : Protection contre XSS
- 🔐 **SameSite Strict** : Protection CSRF
- ⏰ **Rotation des tokens** : Sécurité renforcée
- 🚪 **Session timeout** : Limite d'inactivité
- 🕐 **Durée maximale** : Limite absolue de 8h
- 🧹 **Nettoyage automatique** : Suppression propre

### Bonnes pratiques
- Les tokens sont automatiquement rafraîchis
- Les sessions expirées sont nettoyées
- Fallback localStorage maintenu pour compatibilité
- Logs de debug uniquement en développement

## 🎉 Migration depuis l'ancien système

Le nouveau système est **100% rétrocompatible** :
- Les tokens localStorage existants continuent de fonctionner
- Migration automatique vers les cookies lors de la prochaine connexion
- Aucune interruption de service pour les utilisateurs connectés

---

**Développé pour LireLibre - Système de gestion de sessions avancé** 🚀
