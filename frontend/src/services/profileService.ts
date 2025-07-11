import { API_BASE_URL } from '../config.ts';

export interface ProfileData {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  birthDate?: string;
  avatar?: string;
}

export class ProfileService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token);
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
    console.log('Auth headers:', headers);
    return headers;
  }

  static async getProfile(): Promise<ProfileData> {
    console.log('ProfileService.getProfile - Making request...');
    const headers = this.getAuthHeaders();
    console.log('Headers:', headers);
    
    // Temporarily test with /auth/me endpoint
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers
    });

    console.log('Profile response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Profile error response:', errorText);
      throw new Error('Erreur lors de la récupération du profil');
    }

    const data = await response.json();
    console.log('Profile data received:', data);
    return data.user;
  }

  static async updateProfile(profileData: Partial<ProfileData>): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/api/auth/user/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la mise à jour du profil');
    }

    const data = await response.json();
    return data.user;
  }

  static async uploadAvatar(file: File): Promise<ProfileData> {
    const formData = new FormData();
    formData.append('avatar', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/auth/user/avatar`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'upload de l\'avatar');
    }

    const data = await response.json();
    return data.user; // Retourner les données complètes de l'utilisateur
  }

  static async removeAvatar(): Promise<ProfileData> {
    const response = await fetch(`${API_BASE_URL}/api/auth/user/avatar`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la suppression de l\'avatar');
    }

    const data = await response.json();
    return data.user; // Retourner les données complètes de l'utilisateur
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/user/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        currentPassword,
        newPassword
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors du changement de mot de passe');
    }
  }
}
