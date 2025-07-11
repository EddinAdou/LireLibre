/**
 * Session Service - Gestion des sessions avec auto-refresh
 * Handles token refresh, session timeout, and automatic logout
 */

import { cookieService } from './cookieService';
import { authService } from './authService';

interface SessionConfig {
  refreshThreshold: number; // minutes before expiry to refresh
  sessionTimeout: number; // minutes of inactivity before logout
  maxSessionDuration: number; // maximum session duration in minutes
}

class SessionService {
  private refreshTimer: NodeJS.Timeout | null = null;
  private activityTimer: NodeJS.Timeout | null = null;
  private sessionStartTime: number | null = null;
  private isRefreshing = false;
  private onSessionExpired?: () => void;
  private onTokenRefreshed?: (token: string) => void;

  private config: SessionConfig = {
    refreshThreshold: 5, // Refresh 5 minutes before expiry
    sessionTimeout: 30, // Logout after 30 minutes of inactivity
    maxSessionDuration: 480 // Maximum 8 hours session
  };

  /**
   * Initialize session management
   */
  initialize(callbacks: {
    onSessionExpired?: () => void;
    onTokenRefreshed?: (token: string) => void;
  } = {}): void {
    this.onSessionExpired = callbacks.onSessionExpired;
    this.onTokenRefreshed = callbacks.onTokenRefreshed;
    
    // Start session if token exists
    const token = this.getStoredToken();
    if (token) {
      this.startSession();
    }

    // Listen for user activity
    this.setupActivityListeners();
  }

  /**
   * Start a new session
   */
  startSession(): void {
    this.sessionStartTime = Date.now();
    this.resetActivityTimer();
    this.scheduleTokenRefresh();
  }

  /**
   * End current session
   */
  endSession(): void {
    this.clearTimers();
    this.sessionStartTime = null;
    cookieService.clearAuthCookies();
    
    // Also clear localStorage as fallback
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Get current token (cookies first, localStorage as fallback)
   */
  getStoredToken(): string | null {
    return cookieService.getAuthToken() || localStorage.getItem('token');
  }

  /**
   * Store token with session options
   */
  storeToken(token: string, refreshToken?: string, rememberMe: boolean = false): void {
    // Store in cookies (primary method)
    cookieService.setAuthToken(token, rememberMe);
    
    if (refreshToken) {
      cookieService.setRefreshToken(refreshToken, rememberMe);
    }

    cookieService.setRememberMe(rememberMe);

    // Keep localStorage as fallback for compatibility
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    if (!this.sessionStartTime) return false;

    const now = Date.now();
    const sessionDuration = (now - this.sessionStartTime) / (1000 * 60); // minutes

    // Check maximum session duration
    if (sessionDuration > this.config.maxSessionDuration) {
      console.log('Session expired: Maximum duration reached');
      return false;
    }

    // Check if token exists
    const token = this.getStoredToken();
    if (!token) {
      console.log('Session expired: No token found');
      return false;
    }

    return true;
  }

  /**
   * Refresh token automatically
   */
  private async refreshToken(): Promise<boolean> {
    if (this.isRefreshing) return false;

    const refreshToken = cookieService.getRefreshToken() || localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.log('No refresh token available');
      this.handleSessionExpired();
      return false;
    }

    try {
      this.isRefreshing = true;
      console.log('Refreshing authentication token...');

      const response = await authService.refreshToken();
      const newToken = response.token;

      // Update stored token
      const rememberMe = cookieService.isRememberMeEnabled();
      this.storeToken(newToken, refreshToken, rememberMe);

      // Notify callback
      if (this.onTokenRefreshed) {
        this.onTokenRefreshed(newToken);
      }

      // Schedule next refresh
      this.scheduleTokenRefresh();

      console.log('Token refreshed successfully');
      return true;

    } catch (error) {
      console.error('Token refresh failed:', error);
      this.handleSessionExpired();
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(): void {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Parse JWT to get expiry (simplified - in production use a proper JWT library)
    const token = this.getStoredToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      const refreshTime = timeUntilExpiry - (this.config.refreshThreshold * 60 * 1000);

      if (refreshTime > 0) {
        console.log(`Token refresh scheduled in ${Math.round(refreshTime / 60000)} minutes`);
        this.refreshTimer = setTimeout(() => {
          this.refreshToken();
        }, refreshTime);
      } else {
        // Token is already close to expiry, refresh immediately
        this.refreshToken();
      }
    } catch (error) {
      console.error('Error parsing token for refresh scheduling:', error);
    }
  }

  /**
   * Setup activity listeners for session timeout
   */
  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimer = () => {
      this.resetActivityTimer();
    };

    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });
  }

  /**
   * Reset activity timer
   */
  private resetActivityTimer(): void {
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
    }

    // Don't set activity timer if "remember me" is enabled
    if (cookieService.isRememberMeEnabled()) {
      return;
    }

    this.activityTimer = setTimeout(() => {
      console.log('Session expired due to inactivity');
      this.handleSessionExpired();
    }, this.config.sessionTimeout * 60 * 1000);
  }

  /**
   * Handle session expiration
   */
  private handleSessionExpired(): void {
    this.endSession();
    
    if (this.onSessionExpired) {
      this.onSessionExpired();
    }
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SessionConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get session info
   */
  getSessionInfo(): {
    isActive: boolean;
    startTime: number | null;
    duration: number; // minutes
    rememberMe: boolean;
  } {
    const duration = this.sessionStartTime 
      ? (Date.now() - this.sessionStartTime) / (1000 * 60)
      : 0;

    return {
      isActive: this.isSessionValid(),
      startTime: this.sessionStartTime,
      duration: Math.round(duration),
      rememberMe: cookieService.isRememberMeEnabled()
    };
  }
}

export const sessionService = new SessionService();
export default sessionService;
