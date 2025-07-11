/**
 * Types pour le système d'histoires - LireLibre
 * Gestion des histoires, catégories, sources et métadonnées
 */

export interface Story {
  id: string;
  title: string;
  description: string;
  content: string;
  category: StoryCategory;
  tags: string[];
  authorId?: string; // Pour les histoires créées par les utilisateurs
  author: Author;
  coverImage?: string;
  coverImageUrl?: string; // URL de l'image de couverture
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  chapters?: Chapter[];
  source: StorySource;
  language: string;
  status: StoryStatus;
  estimatedReadingTime: number; // en minutes
  statistics?: {
    wordCount: number;
    characterCount: number;
    readingTime: number;
  };
}

export interface Chapter {
  id: string;
  storyId: string;
  title: string;
  content: string;
  chapterNumber: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Author {
  id?: string;
  name: string;
  bio?: string;
  avatar?: string;
  externalId?: string; // Pour les auteurs d'APIs externes
  sourceApi?: string;
}

export type StoryCategory = 
  | 'Fiction' 
  | 'Non-fiction' 
  | 'Poésie' 
  | 'Théâtre' 
  | 'Science-fiction'
  | 'Fantasy' 
  | 'Romance' 
  | 'Mystère' 
  | 'Horreur' 
  | 'Biographie' 
  | 'Histoire'
  | 'Philosophie' 
  | 'Autre';

export interface StoryCategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface StorySource {
  type: 'user' | 'gutenberg' | 'openlibrary' | 'wikisource' | 'manybooks' | 'creative_commons';
  externalId?: string;
  apiUrl?: string;
  license: string;
  originalUrl?: string;
}

export type StoryStatus = 'draft' | 'published' | 'completed' | 'ongoing' | 'archived';

export interface CreateStoryRequest {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: File;
  isPublished: boolean;
}

export interface UpdateStoryRequest extends Partial<CreateStoryRequest> {
  id: string;
}

export interface StoryFilters {
  category?: string;
  tags?: string[];
  author?: string;
  source?: string;
  status?: StoryStatus;
  search?: string;
  language?: string;
  sortBy?: 'date' | 'views' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ExternalStoryImport {
  source: 'gutenberg' | 'openlibrary' | 'wikisource' | 'manybooks';
  externalId: string;
  title: string;
  author: string;
  description?: string;
  category?: string;
  language?: string;
  license: string;
}

// Données d'API externes
export interface GutenbergBook {
  id: number;
  title: string;
  authors: Array<{ name: string; birth_year?: number; death_year?: number }>;
  subjects: string[];
  languages: string[];
  download_count: number;
  formats: Record<string, string>;
  media_type: string;
}

export interface OpenLibraryWork {
  key: string;
  title: string;
  authors?: Array<{ key: string; name: string }>;
  subjects?: string[];
  description?: string | { value: string };
  covers?: number[];
  first_publish_date?: string;
}

export interface WikisourceText {
  title: string;
  author: string;
  content: string;
  language: string;
  source_url: string;
  license: string;
}
