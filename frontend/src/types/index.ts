export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  description?: string;
  summary?: string;
  genre: string;
  status?: string;
  coverImage?: string;
  isPublished: boolean;
  viewCount: number;
  likeCount: number;
  word_count?: number;
  character_count?: number;
  reading_time?: number;
  language?: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  story: Story;
  parentComment?: Comment;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: number;
  user: User;
  story: Story;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
