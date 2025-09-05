import api from './api';

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  followers: string[];
  following: string[];
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
  isVerified: boolean;
  role: 'user' | 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  user: User;
  stats: {
    postsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export interface UsersResponse {
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FeedResponse {
  posts: any[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

class UserService {
  // Get current user profile
  async getCurrentProfile(): Promise<User> {
    const response = await api.get('/users/profile');
    return response.data.data;
  }

  // Update current user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/users/profile', data);
    return response.data.data;
  }

  // Get user profile by username
  async getUserProfile(username: string): Promise<UserProfile> {
    const response = await api.get(`/users/profile/${username}`);
    return response.data.data;
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  }

  // Search users
  async searchUsers(query: string, page = 1, limit = 10): Promise<UsersResponse> {
    const response = await api.get(`/users/search?username=${query}&page=${page}&limit=${limit}`);
    return response.data.data;
  }

  // Get all users
  async getAllUsers(page = 1, limit = 10, filters?: any): Promise<UsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await api.get(`/users?${params}`);
    return response.data.data;
  }

  // Follow user
  async followUser(userId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
    const response = await api.post(`/users/follow/${userId}`);
    return response.data.data;
  }

  // Unfollow user
  async unfollowUser(userId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
    const response = await api.post(`/users/unfollow/${userId}`);
    return response.data.data;
  }

  // Get user followers
  async getUserFollowers(userId: string, page = 1, limit = 50): Promise<UsersResponse> {
    const response = await api.get(`/users/followers/${userId}?page=${page}&limit=${limit}`);
    return response.data.data;
  }

  // Get user following
  async getUserFollowing(userId: string, page = 1, limit = 50): Promise<UsersResponse> {
    const response = await api.get(`/users/following/${userId}?page=${page}&limit=${limit}`);
    return response.data.data;
  }

  // Get user feed
  async getUserFeed(page = 1, limit = 20, sort = 'recent'): Promise<FeedResponse> {
    const response = await api.get(`/users/feed?page=${page}&limit=${limit}&sort=${sort}`);
    return response.data.data;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/users/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // Upload cover image
  async uploadCoverImage(file: File): Promise<{ coverImage: string }> {
    const formData = new FormData();
    formData.append('cover', file);

    const response = await api.post('/users/upload-cover', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  // Update user (admin)
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  // Get user posts
  async getUserPosts(page = 1, limit = 20): Promise<any[]> {
    try {
      const response = await api.get(`/users/posts?page=${page}&limit=${limit}`);
      return response.data.data || [];
    } catch (error) {
      console.warn('getUserPosts API not available');
      return [];
    }
  }

  // Get user stats
  async getUserStats(): Promise<any> {
    try {
      const response = await api.get('/users/stats');
      return response.data.data || {
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        mutualFollowersCount: 0,
        likesReceived: 0,
        commentsReceived: 0
      };
    } catch (error) {
      console.warn('getUserStats API not available');
      return {
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        mutualFollowersCount: 0,
        likesReceived: 0,
        commentsReceived: 0
      };
    }
  }
}

export default new UserService();