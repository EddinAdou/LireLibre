/**
 * StoriesService - Gestion des histoires locales
 * CRUD, recherche, catégories, statistiques
 */

import { apiService } from './apiService';
import { Story, CreateStoryRequest, UpdateStoryRequest, StoryFilters, StoryCategory, Chapter } from '../types/story';

class StoriesService {
  private readonly baseUrl = '/stories';

  /**
   * Obtenir toutes les histoires avec filtres
   */
  async getStories(filters: StoryFilters = {}): Promise<{ stories: Story[]; total: number; page: number; totalPages: number }> {
    const params = new URLSearchParams();
    
    // Ajouter les paramètres de filtrage
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.category && filters.category !== 'Tout') {
      params.append('category', filters.category);
    }
    if (filters.language) {
      params.append('language', filters.language);
    }
    if (filters.status) {
      params.append('status', filters.status);
    }
    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.limit) {
      params.append('limit', filters.limit.toString());
    }

    const response = await apiService.get<{
      stories: Story[];
      pagination: { total: number; page: number; pages: number };
    }>(`${this.baseUrl}?${params}`);

    return {
      stories: response.stories,
      total: response.pagination.total,
      page: response.pagination.page,
      totalPages: response.pagination.pages,
    };
  }

  /**
   * Obtenir une histoire par ID
   */
  async getStory(id: string): Promise<Story> {
    const response = await apiService.get<{ story: Story }>(`${this.baseUrl}/${id}`);
    return response.story;
  }

  /**
   * Créer une nouvelle histoire
   */
  async createStory(storyData: CreateStoryRequest): Promise<Story> {
    const formData = new FormData();
    
    formData.append('title', storyData.title);
    formData.append('description', storyData.description);
    formData.append('content', storyData.content);
    formData.append('category', storyData.category);
    formData.append('tags', JSON.stringify(storyData.tags));
    formData.append('isPublished', storyData.isPublished.toString());
    
    if (storyData.coverImage) {
      formData.append('coverImage', storyData.coverImage);
    }

    const response = await apiService.post<{ story: Story; message: string }>(
      this.baseUrl,
      formData
    );

    return response.story;
  }

  /**
   * Mettre à jour une histoire
   */
  async updateStory(storyData: UpdateStoryRequest): Promise<Story> {
    const { id, ...updateData } = storyData;
    
    const formData = new FormData();
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'tags') {
          formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await apiService.put<{ story: Story; message: string }>(
      `${this.baseUrl}/${id}`,
      formData
    );

    return response.story;
  }

  /**
   * Supprimer une histoire
   */
  async deleteStory(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Liker/Unliker une histoire
   */
  async toggleLike(id: string): Promise<{ liked: boolean; likes: number }> {
    const response = await apiService.post<{ liked: boolean; likes: number; message: string }>(
      `${this.baseUrl}/${id}/like`
    );
    
    return {
      liked: response.liked,
      likes: response.likes,
    };
  }

  /**
   * Incrémenter les vues d'une histoire
   */
  async incrementViews(id: string): Promise<void> {
    await apiService.post(`${this.baseUrl}/${id}/view`);
  }

  /**
   * Obtenir les catégories d'histoires
   */
  async getCategories(): Promise<StoryCategory[]> {
    const response = await apiService.get<{ categories: StoryCategory[] }>('/categories');
    return response.categories;
  }

  /**
   * Rechercher des histoires
   */
  async searchStories(query: string, filters: Partial<StoryFilters> = {}): Promise<Story[]> {
    const searchFilters: StoryFilters = {
      ...filters,
      search: query,
      limit: filters.limit || 20,
    };

    const result = await this.getStories(searchFilters);
    return result.stories;
  }

  /**
   * Obtenir les histoires populaires
   */
  async getPopularStories(limit: number = 10): Promise<Story[]> {
    const result = await this.getStories({
      sortBy: 'views',
      sortOrder: 'desc',
      limit,
      status: 'published',
    });
    
    return result.stories;
  }

  /**
   * Obtenir les histoires récentes
   */
  async getRecentStories(limit: number = 10): Promise<Story[]> {
    const result = await this.getStories({
      sortBy: 'date',
      sortOrder: 'desc',
      limit,
      status: 'published',
    });
    
    return result.stories;
  }

  /**
   * Obtenir les histoires d'un utilisateur
   */
  async getUserStories(userId?: string, includePrivate: boolean = false): Promise<Story[]> {
    const filters: StoryFilters = {
      author: userId,
      limit: 100,
    };

    if (!includePrivate) {
      filters.status = 'published';
    }

    const result = await this.getStories(filters);
    return result.stories;
  }

  /**
   * Obtenir les chapitres d'une histoire
   */
  async getChapters(storyId: string): Promise<Chapter[]> {
    const response = await apiService.get<{ chapters: Chapter[] }>(`${this.baseUrl}/${storyId}/chapters`);
    return response.chapters;
  }

  /**
   * Créer un nouveau chapitre
   */
  async createChapter(storyId: string, chapterData: {
    title: string;
    content: string;
    chapterNumber: number;
  }): Promise<Chapter> {
    const response = await apiService.post<{ chapter: Chapter; message: string }>(
      `${this.baseUrl}/${storyId}/chapters`,
      chapterData
    );
    
    return response.chapter;
  }

  /**
   * Mettre à jour un chapitre
   */
  async updateChapter(storyId: string, chapterId: string, chapterData: {
    title?: string;
    content?: string;
    chapterNumber?: number;
  }): Promise<Chapter> {
    const response = await apiService.put<{ chapter: Chapter; message: string }>(
      `${this.baseUrl}/${storyId}/chapters/${chapterId}`,
      chapterData
    );
    
    return response.chapter;
  }

  /**
   * Supprimer un chapitre
   */
  async deleteChapter(storyId: string, chapterId: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${storyId}/chapters/${chapterId}`);
  }

  /**
   * Obtenir les tags populaires
   */
  async getPopularTags(limit: number = 20): Promise<{ tag: string; count: number }[]> {
    const response = await apiService.get<{ tags: { tag: string; count: number }[] }>(
      `/tags/popular?limit=${limit}`
    );
    
    return response.tags;
  }

  /**
   * Obtenir les statistiques d'une histoire
   */
  async getStoryStats(id: string): Promise<{
    views: number;
    likes: number;
    comments: number;
    readingTime: number;
    chapters: number;
  }> {
    const response = await apiService.get<{
      stats: {
        views: number;
        likes: number;
        comments: number;
        readingTime: number;
        chapters: number;
      };
    }>(`${this.baseUrl}/${id}/stats`);
    
    return response.stats;
  }

  /**
   * Calculer le temps de lecture estimé
   */
  calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }

  /**
   * Formater le temps de lecture
   */
  formatReadingTime(minutes: number): string {
    if (minutes < 1) return 'Moins d\'une minute';
    if (minutes === 1) return '1 minute';
    if (minutes < 60) return `${minutes} minutes`;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return hours === 1 ? '1 heure' : `${hours} heures`;
    }
    
    return `${hours}h ${remainingMinutes}min`;
  }
}

export const storiesService = new StoriesService();
export default storiesService;
