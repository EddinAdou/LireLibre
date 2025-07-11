import { apiService } from './apiService';
import { User, LoginCredentials, RegisterCredentials, ApiResponse } from '../types';

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiService.post<ApiResponse<AuthResponse>>('/auth/register', credentials);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<ApiResponse<User>>('/auth/me');
    return response.data;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiService.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data;
  }

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
  }
}

export const authService = new AuthService();
