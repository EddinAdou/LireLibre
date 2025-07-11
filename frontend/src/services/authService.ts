import { apiService } from './apiService';
import { User, LoginCredentials, RegisterCredentials } from '../types';

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<{ user: User; token: string; message: string }>('/auth/login', credentials);
    return { user: response.user, token: response.token };
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiService.post<{ user: User; token: string; message: string }>('/auth/register', credentials);
    return { user: response.user, token: response.token };
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<{ user: User }>('/auth/me');
    return response.user;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiService.post<{ token: string }>('/auth/refresh');
    return response;
  }

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
  }
}

export const authService = new AuthService();
