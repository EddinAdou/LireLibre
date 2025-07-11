/**
 * SessionDebug - Composant de debug pour afficher les informations de session
 * Utile pour tester et visualiser l'état des sessions et cookies
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sessionService } from '../services/sessionService';
import { cookieService } from '../services/cookieService';

const SessionDebug: React.FC = () => {
  const { sessionInfo, user, isAuthenticated } = useAuth();
  const [refreshCount, setRefreshCount] = useState(0);

  // Force re-render every 5 seconds to see live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!user || !isAuthenticated) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-sm">
        <h3 className="font-bold text-sm">Debug Session (Non connecté)</h3>
        <div className="text-xs mt-2 space-y-1">
          <div>Token localStorage: {localStorage.getItem('token') ? '✅' : '❌'}</div>
          <div>Cookie token: {cookieService.getAuthToken() ? '✅' : '❌'}</div>
          <div>Cookie refresh: {cookieService.getRefreshToken() ? '✅' : '❌'}</div>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const formatTime = (timestamp: number | null): string => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString('fr-FR');
  };

  const tokenInfo = (() => {
    try {
      const token = sessionService.getStoredToken();
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = new Date(payload.exp * 1000);
      const timeUntilExpiry = expiresAt.getTime() - Date.now();
      
      return {
        expires: expiresAt.toLocaleTimeString('fr-FR'),
        minutesUntilExpiry: Math.round(timeUntilExpiry / (1000 * 60)),
        isExpired: timeUntilExpiry <= 0
      };
    } catch {
      return null;
    }
  })();

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 shadow-lg rounded-lg p-4 max-w-sm text-xs font-mono">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-gray-800">🔍 Debug Session</h3>
        <span className="text-gray-500">#{refreshCount}</span>
      </div>
      
      <div className="space-y-2">
        {/* User Info */}
        <div className="border-b border-gray-200 pb-2">
          <div className="font-semibold text-gray-700">👤 Utilisateur</div>
          <div>Email: {user.email}</div>
          <div>Username: {user.username}</div>
        </div>

        {/* Session Info */}
        <div className="border-b border-gray-200 pb-2">
          <div className="font-semibold text-gray-700">⏰ Session</div>
          <div>Actif: {sessionInfo.isActive ? '✅' : '❌'}</div>
          <div>Durée: {formatDuration(sessionInfo.duration)}</div>
          <div>Début: {formatTime(sessionInfo.startTime)}</div>
          <div>Se souvenir: {sessionInfo.rememberMe ? '✅' : '❌'}</div>
        </div>

        {/* Token Info */}
        <div className="border-b border-gray-200 pb-2">
          <div className="font-semibold text-gray-700">🎫 Token</div>
          <div>localStorage: {localStorage.getItem('token') ? '✅' : '❌'}</div>
          <div>Cookie: {cookieService.getAuthToken() ? '✅' : '❌'}</div>
          {tokenInfo && (
            <>
              <div className={`${tokenInfo.isExpired ? 'text-red-600' : 'text-green-600'}`}>
                Expire: {tokenInfo.expires}
              </div>
              <div className={`${tokenInfo.minutesUntilExpiry < 5 ? 'text-orange-600' : 'text-gray-600'}`}>
                Dans: {tokenInfo.minutesUntilExpiry}m
              </div>
            </>
          )}
        </div>

        {/* Refresh Token */}
        <div className="border-b border-gray-200 pb-2">
          <div className="font-semibold text-gray-700">🔄 Refresh Token</div>
          <div>localStorage: {localStorage.getItem('refresh_token') ? '✅' : '❌'}</div>
          <div>Cookie: {cookieService.getRefreshToken() ? '✅' : '❌'}</div>
        </div>

        {/* Actions */}
        <div className="pt-2">
          <div className="font-semibold text-gray-700 mb-2">🛠️ Actions</div>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                sessionService.endSession();
                window.location.reload();
              }}
              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Forcer logout
            </button>
            <button
              onClick={() => {
                console.log('Session Info:', sessionService.getSessionInfo());
                console.log('Cookies:', {
                  authToken: cookieService.getAuthToken(),
                  refreshToken: cookieService.getRefreshToken(),
                  rememberMe: cookieService.isRememberMeEnabled()
                });
              }}
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Console log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDebug;
