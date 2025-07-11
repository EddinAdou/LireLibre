import { apiService } from './apiService';
import { Story, ApiResponse, PaginatedResponse } from '../types';

interface CreateStoryData {
  title: string;
  content: string;
  description?: string;
  summary?: string;
  genre: string;
  tags?: string[];
  isPublished?: boolean;
}

interface UpdateStoryData extends Partial<CreateStoryData> {
  id: number;
  status?: string;
}

interface StoryFilters {
  genre?: string;
  author?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at' | 'updated_at' | 'view_count' | 'like_count';
  sortOrder?: 'asc' | 'desc';
}

class StoryService {
  async getStories(filters?: StoryFilters): Promise<PaginatedResponse<Story>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiService.get<ApiResponse<PaginatedResponse<Story>>>(`/stories?${params}`);
    return response.data;
  }

  async getStory(id: number): Promise<Story> {
    const response = await apiService.get<{ story: Story }>(`/stories/${id}`);
    return response.story;
  }

  async createStory(data: CreateStoryData): Promise<Story> {
    const response = await apiService.post<{ story: Story }>('/stories', data);
    return response.story;
  }

  async updateStory(data: UpdateStoryData): Promise<Story> {
    const { id, ...updateData } = data;
    const response = await apiService.put<{ story: Story }>(`/stories/${id}`, updateData);
    return response.story;
  }

  async deleteStory(id: number): Promise<void> {
    await apiService.delete(`/stories/${id}`);
  }

  async likeStory(id: number): Promise<void> {
    await apiService.post(`/stories/${id}/like`);
  }

  async unlikeStory(id: number): Promise<void> {
    await apiService.delete(`/stories/${id}/like`);
  }

  async addToFavorites(id: number): Promise<void> {
    await apiService.post(`/stories/${id}/favorite`);
  }

  async removeFromFavorites(id: number): Promise<void> {
    await apiService.delete(`/stories/${id}/favorite`);
  }

  async getUserStories(userId?: number): Promise<Story[]> {
    const endpoint = userId ? `/users/${userId}/stories` : '/users/me/stories';
    const response = await apiService.get<ApiResponse<Story[]>>(endpoint);
    return response.data;
  }

  async getUserFavorites(): Promise<Story[]> {
    const response = await apiService.get<ApiResponse<Story[]>>('/users/me/favorites');
    return response.data;
  }
}

export const storyService = new StoryService();
