// Core API Types
export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}

// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  lastActive: string;
  location?: string;
  website?: string;
  isFollowing?: boolean;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
    privacy: 'public' | 'private';
  };
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Profile Types
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface UploadAvatarRequest {
  avatarUrl: string;
}

// Search & Filter Types
export interface UserSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserSearchByUsernameParams {
  username: string;
}

// Feed Types
export interface FeedParams {
  limit?: number;
  page?: number;
  sort?: 'recent' | 'popular' | 'trending';
}

// Follow System Types
export interface FollowParams {
  limit?: number;
  page?: number;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalComments: number;
  suspendedUsers: number;
  newUsersToday: number;
  postsToday: number;
  commentsToday: number;
}

export interface AdminUser extends User {
  reportCount?: number;
  suspensionReason?: string;
  suspendedAt?: string;
  suspendedBy?: string;
}

// Generic Response Types
export interface MessageResponse {
  message: string;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}

// Query Builder Types
export interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

// Cache Types
export interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  key?: string;
  tags?: string[];
}

// Request Config Types
export interface RequestConfig {
  cache?: CacheConfig;
  retry?: boolean;
  timeout?: number;
  signal?: AbortSignal;
}