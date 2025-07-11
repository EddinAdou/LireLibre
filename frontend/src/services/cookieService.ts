/**
 * Cookie Service - Gestion sécurisée des cookies
 * Provides secure cookie management for authentication tokens
 */

interface CookieOptions {
  expires?: number; // days
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  path?: string;
}

class CookieService {
  /**
   * Set a cookie with secure defaults
   */
  setCookie(name: string, value: string, options: CookieOptions = {}): void {
    const defaults: CookieOptions = {
      path: '/',
      secure: window.location.protocol === 'https:',
      sameSite: 'lax',
      expires: 7 // 7 days by default
    };

    const opts = { ...defaults, ...options };
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (opts.expires) {
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + opts.expires * 24 * 60 * 60 * 1000);
      cookieString += `; expires=${expiryDate.toUTCString()}`;
    }

    if (opts.path) {
      cookieString += `; path=${opts.path}`;
    }

    if (opts.secure) {
      cookieString += '; secure';
    }

    if (opts.sameSite) {
      cookieString += `; samesite=${opts.sameSite}`;
    }

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value by name
   */
  getCookie(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  }

  /**
   * Delete a cookie
   */
  deleteCookie(name: string, path: string = '/'): void {
    this.setCookie(name, '', { expires: -1, path });
  }

  /**
   * Check if a cookie exists
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }

  /**
   * Set authentication token with remember me option
   */
  setAuthToken(token: string, rememberMe: boolean = false): void {
    const expires = rememberMe ? 30 : 1; // 30 days if remember me, 1 day otherwise
    this.setCookie('auth_token', token, {
      expires,
      secure: true,
      sameSite: 'lax'
    });
  }

  /**
   * Set refresh token (longer expiry)
   */
  setRefreshToken(token: string, rememberMe: boolean = false): void {
    const expires = rememberMe ? 90 : 7; // 90 days if remember me, 7 days otherwise
    this.setCookie('refresh_token', token, {
      expires,
      secure: true,
      sameSite: 'lax'
    });
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.getCookie('auth_token');
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.getCookie('refresh_token');
  }

  /**
   * Clear all authentication cookies
   */
  clearAuthCookies(): void {
    this.deleteCookie('auth_token');
    this.deleteCookie('refresh_token');
    this.deleteCookie('remember_me');
  }

  /**
   * Set remember me preference
   */
  setRememberMe(remember: boolean): void {
    if (remember) {
      this.setCookie('remember_me', 'true', { expires: 90 });
    } else {
      this.deleteCookie('remember_me');
    }
  }

  /**
   * Check if remember me is enabled
   */
  isRememberMeEnabled(): boolean {
    return this.getCookie('remember_me') === 'true';
  }
}

export const cookieService = new CookieService();
export default cookieService;
