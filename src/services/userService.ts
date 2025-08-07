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
  emailOrUsername?: string;
  email?: string;
  username?: string;
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
  login: async (data: LoginData): Promise<{ data: { user: User; accessToken: string } }> => {
    return api.post<{ data: { user: User; accessToken: string } }>('/users/login', data);
  },

  register: async (data: RegisterData): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/users/register', data);
  },

  logout: async (): Promise<{ message: string }> => {
    return api.post<{ message: string }>('/users/logout');
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
      () => api.get<User>('/users/profile/me', {
        cache: {
          ttl: 2 * 60 * 1000, // 2 minutes
          tags: ['user', 'profile']
        }
      }),
      'Failed to load profile'
    );
  },

  getUserProfile: async (userId: string): Promise<User> => {
    return withErrorHandling(
      () => api.get<User>(`/users/${userId}`, {
        cache: {
          ttl: 5 * 60 * 1000, // 5 minutes
          tags: ['user', `user_${userId}`]
        }
      }),
      'Failed to load user profile'
    );
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    return withErrorHandling(
      () => api.put<User>('/users/profile/me', data),
      'Failed to update profile'
    );
  },

  uploadAvatar: async (avatarUrl: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.post<{ message: string }>('/users/upload-avatar', { avatarUrl }),
      'Failed to upload avatar'
    );
  },

  changePassword: async (currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.post<{ message: string }>('/users/change-password', { currentPassword, newPassword, confirmNewPassword }),
      'Failed to change password'
    );
  },

  // Follow System
  followUser: async (userId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.post<{ message: string }>(`/users/follow/${userId}`),
      'Failed to follow user'
    );
  },

  unfollowUser: async (userId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.post<{ message: string }>(`/users/unfollow/${userId}`),
      'Failed to unfollow user'
    );
  },

  getFollowers: async (userId: string, page: number = 1, limit: number = 50): Promise<User[]> => {
    return withErrorHandling(
      () => api.get<User[]>(`/users/followers/${userId}?page=${page}&limit=${limit}`),
      'Failed to load followers'
    );
  },

  getFollowing: async (userId: string, page: number = 1, limit: number = 50): Promise<User[]> => {
    return withErrorHandling(
      () => api.get<User[]>(`/users/following/${userId}?page=${page}&limit=${limit}`),
      'Failed to load following'
    );
  },

  // User Stats
  getUserStats: async (userId?: string): Promise<UserStats> => {
    const endpoint = userId ? `/users/${userId}/stats` : '/users/stats/me';
    try {
      return await withErrorHandling(
        () => api.get<UserStats>(endpoint),
        'Failed to load user stats'
      );
    } catch (error: any) {
      // Return default stats if endpoint doesn't exist yet
      if (error.response?.status === 404) {
        console.warn('Stats endpoint not available yet');
        return {
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
          mutualFollowersCount: 0,
          likesReceived: 0,
          commentsReceived: 0
        };
      }
      throw error;
    }
  },

  // Posts
  getUserPosts: async (userId?: string): Promise<Post[]> => {
    const endpoint = userId ? `/posts/user/${userId}` : '/posts/me';
    try {
      return await withErrorHandling(
        () => api.get<Post[]>(endpoint),
        'Failed to load posts'
      );
    } catch (error: any) {
      // Return empty array if endpoint doesn't exist yet
      if (error.response?.status === 404) {
        console.warn('Posts endpoint not available yet');
        return [];
      }
      throw error;
    }
  },

  // Get all users with pagination and filtering
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<User[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return api.get<User[]>(`/users?${queryParams.toString()}`);
  },

  // Search users with debouncing
  searchUsers: async (username: string): Promise<User[]> => {
    if (!username.trim()) return [];
    return api.get<User[]>(`/users/search?username=${encodeURIComponent(username)}`);
  },

  // Get user feed
  getUserFeed: async (params?: {
    limit?: number;
    page?: number;
    sort?: string;
  }): Promise<any[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return withErrorHandling(
      () => api.get<any[]>(`/users/feed?${queryParams.toString()}`, {
        cache: {
          ttl: 1 * 60 * 1000, // 1 minute for feed
          tags: ['feed', 'posts']
        }
      }),
      'Failed to load feed'
    );
  },
};

export default userService;