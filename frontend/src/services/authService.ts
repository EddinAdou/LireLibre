import { apiService } from './apiService';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import { cookieService } from './cookieService';

interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
}

interface RefreshResponse {
  token: string;
  refresh_token: string;
  user: User;
  message: string;
}

class AuthService {
  async login(credentials: LoginCredentials & { rememberMe?: boolean }): Promise<AuthResponse> {
    const response = await apiService.post<{ user: User; token: string; refresh_token?: string; message: string }>('/auth/login', {
      email: credentials.email,
      password: credentials.password
    });
    
    return { 
      user: response.user, 
      token: response.token,
      refresh_token: response.refresh_token
    };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiService.post<{ user: User; token: string; refresh_token?: string; message: string }>('/auth/register', credentials);
    return { 
      user: response.user, 
      token: response.token,
      refresh_token: response.refresh_token
    };
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<{ user: User }>('/auth/me');
    return response.user;
  }

  async refreshToken(): Promise<RefreshResponse> {
    const refreshToken = cookieService.getRefreshToken() || localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('Aucun refresh token disponible');
    }

    const response = await apiService.post<RefreshResponse>('/auth/refresh', {
      refresh_token: refreshToken
    });
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Même si l'API échoue, on nettoie localement
      console.error('Erreur lors du logout API:', error);
    } finally {
      // Nettoyer les tokens locaux
      cookieService.clearAuthCookies();
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }
  }
}

export const authService = new AuthService();
