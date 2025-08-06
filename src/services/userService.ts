import { api, withErrorHandling } from './api';

// User-related types
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
}

export interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  createdAt: string;
  updatedAt: string;
  media?: string[];
  repost?: {
    _id: string;
    content: string;
    author: User;
  };
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  parent?: string;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  mutualFollowersCount: number;
  likesReceived: number;
  commentsReceived: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
}

// User Service
export const userService = {
  // Authentication
  login: async (data: LoginData): Promise<{ user: User; token: string }> => {
    return withErrorHandling(
      () => api.post<{ user: User; token: string }>('/users/login', data),
      'Login failed. Please check your credentials.'
    );
  },

  register: async (data: RegisterData): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.post<{ message: string }>('/users/register', data),
      'Registration failed. Please try again.'
    );
  },

  logout: async (): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.post<{ message: string }>('/users/logout'),
      'Logout failed'
    );
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.post<{ message: string }>('/users/forgot-password', { email }),
      'Failed to send password reset email'
    );
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.post<{ message: string }>('/users/reset-password', { token, password }),
      'Failed to reset password'
    );
  },

  // Profile Management
  getProfile: async (): Promise<User> => {
    return withErrorHandling(
      () => api.get<User>('/users/profile/me'),
      'Failed to load profile'
    );
  },

  getUserProfile: async (userId: string): Promise<User> => {
    return withErrorHandling(
      () => api.get<User>(`/users/profile/${userId}`),
      'Failed to load user profile'
    );
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    return withErrorHandling(
      () => api.put<User>('/users/profile/me', data),
      'Failed to update profile'
    );
  },

  uploadAvatar: async (file: File): Promise<{ avatar: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return withErrorHandling(
      () => api.upload<{ avatar: string }>('/users/profile/avatar', formData),
      'Failed to upload avatar'
    );
  },

  // Follow System
  followUser: async (userId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.post<{ message: string }>(`/users/${userId}/follow`),
      'Failed to follow user'
    );
  },

  unfollowUser: async (userId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.delete<{ message: string }>(`/users/${userId}/follow`),
      'Failed to unfollow user'
    );
  },

  getFollowers: async (userId?: string): Promise<User[]> => {
    const endpoint = userId ? `/users/${userId}/followers` : '/users/followers';
    return withErrorHandling(
      () => api.get<User[]>(endpoint),
      'Failed to load followers'
    );
  },

  getFollowing: async (userId?: string): Promise<User[]> => {
    const endpoint = userId ? `/users/${userId}/following` : '/users/following';
    return withErrorHandling(
      () => api.get<User[]>(endpoint),
      'Failed to load following'
    );
  },

  // User Stats
  getUserStats: async (userId?: string): Promise<UserStats> => {
    const endpoint = userId ? `/users/${userId}/stats` : '/users/stats/me';
    return withErrorHandling(
      () => api.get<UserStats>(endpoint),
      'Failed to load user stats'
    );
  },

  // Posts
  getUserPosts: async (userId?: string): Promise<Post[]> => {
    const endpoint = userId ? `/posts/user/${userId}` : '/posts/me';
    return withErrorHandling(
      () => api.get<Post[]>(endpoint),
      'Failed to load posts'
    );
  },

  // Search
  searchUsers: async (query: string): Promise<User[]> => {
    return withErrorHandling(
      () => api.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`),
      'Failed to search users'
    );
  },

  // Suggested Users
  getSuggestedUsers: async (): Promise<User[]> => {
    return withErrorHandling(
      () => api.get<User[]>('/users/suggested'),
      'Failed to load suggested users'
    );
  },
};

export default userService;