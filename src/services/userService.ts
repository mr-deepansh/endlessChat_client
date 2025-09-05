import { apiClient } from './core/apiClient';

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
    const response = await apiClient.get('/users/profile/me');
    return response.data;
  }

  // Update current user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put('/users/profile/me', data);
    return response.data;
  }

  // Get user profile by username
  async getUserProfile(username: string): Promise<UserProfile> {
    const response = await apiClient.get(`/users/profile/${username}`);
    return response.data;
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  // Search users
  async searchUsers(query: string, page = 1, limit = 10): Promise<UsersResponse> {
    const response = await apiClient.get(
      `/users/search?username=${query}&page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Get all users
  async getAllUsers(page = 1, limit = 10, filters?: any): Promise<UsersResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await apiClient.get(`/users?${params}`);
    return response.data;
  }

  // Follow user
  async followUser(userId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
    const response = await apiClient.post(`/users/follow/${userId}`);
    return response.data;
  }

  // Unfollow user
  async unfollowUser(userId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
    const response = await apiClient.post(`/users/unfollow/${userId}`);
    return response.data;
  }

  // Get user followers
  async getUserFollowers(userId: string, page = 1, limit = 50): Promise<UsersResponse> {
    const response = await apiClient.get(`/users/followers/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Get user following
  async getUserFollowing(userId: string, page = 1, limit = 50): Promise<UsersResponse> {
    const response = await apiClient.get(`/users/following/${userId}?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Get user feed
  async getUserFeed(page = 1, limit = 20, sort = 'recent'): Promise<FeedResponse> {
    const response = await apiClient.get(`/users/feed?page=${page}&limit=${limit}&sort=${sort}`);
    return response.data;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  // Upload avatar
  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.uploadFile('/users/upload-avatar', file);
    return response.data;
  }

  // Upload cover image
  async uploadCoverImage(file: File): Promise<{ coverImage: string }> {
    const formData = new FormData();
    formData.append('cover', file);

    const response = await apiClient.uploadFile('/users/upload-cover', file);
    return response.data;
  }

  // Update user (admin)
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  // Get user posts
  async getUserPosts(page = 1, limit = 20): Promise<any[]> {
    try {
      const response = await apiClient.get(`/users/posts?page=${page}&limit=${limit}`);
      return response.data || [];
    } catch (error) {
      console.warn('getUserPosts API not available');
      return [];
    }
  }

  // Get user stats
  async getUserStats(): Promise<any> {
    try {
      const response = await apiClient.get('/users/stats');
      return (
        response.data || {
          postsCount: 0,
          followersCount: 0,
          followingCount: 0,
          mutualFollowersCount: 0,
          likesReceived: 0,
          commentsReceived: 0,
        }
      );
    } catch (error) {
      console.warn('getUserStats API not available');
      return {
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        mutualFollowersCount: 0,
        likesReceived: 0,
        commentsReceived: 0,
      };
    }
  }
}

export default new UserService();
