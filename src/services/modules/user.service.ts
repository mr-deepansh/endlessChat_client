import { usersApi as apiClient } from '../core/serviceClients';
import type {
  ApiResponse,
  User,
  PaginatedResponse,
  SearchParams,
  FollowStats,
} from '../../types/api';

export interface UserSearchParams extends SearchParams {
  username?: string;
  email?: string;
  role?: 'user' | 'admin' | 'super_admin';
  isActive?: boolean;
  sortBy?: 'createdAt' | 'username' | 'email' | 'lastLoginAt';
  sortOrder?: 'asc' | 'desc';
}

export interface FeedParams extends SearchParams {
  sort?: 'recent' | 'popular' | 'trending';
  timeRange?: '1h' | '24h' | '7d' | '30d';
}

class UserService {
  private readonly baseUrl = '/users';

  // User Discovery & Search
  async searchUsers(params: UserSearchParams = {}): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<User>>(`${this.baseUrl}/search${queryString}`);
  }

  async getAllUsers(params: UserSearchParams = {}): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<User>>(`${this.baseUrl}${queryString}`);
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${this.baseUrl}/${userId}`);
  }

  // Feed Management
  async getFeed(params: FeedParams = {}): Promise<ApiResponse<any[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<any[]>(`${this.baseUrl}/feed${queryString}`);
  }

  // Social Features - Following System
  async followUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.baseUrl}/follow/${userId}`);
  }

  async unfollowUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post<{ message: string }>(`${this.baseUrl}/unfollow/${userId}`);
  }

  async getFollowers(
    userId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<User>>(
      `${this.baseUrl}/followers/${userId}${queryString}`
    );
  }

  async getFollowing(
    userId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<User>>(
      `${this.baseUrl}/following/${userId}${queryString}`
    );
  }

  // User Statistics
  async getUserStats(userId: string): Promise<
    ApiResponse<{
      followersCount: number;
      followingCount: number;
      postsCount: number;
      likesReceived: number;
      joinedAt: string;
      lastActive: string;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/${userId}/stats`);
  }

  // Bulk Operations for Enterprise Scale
  async bulkFollowUsers(userIds: string[]): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ userId: string; error: string }>;
    }>
  > {
    return apiClient.post('/users/bulk/follow', { userIds });
  }

  async bulkUnfollowUsers(userIds: string[]): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ userId: string; error: string }>;
    }>
  > {
    return apiClient.post('/users/bulk/unfollow', { userIds });
  }

  // User Recommendations
  async getRecommendedUsers(
    params: {
      limit?: number;
      type?: 'similar' | 'popular' | 'new';
    } = {}
  ): Promise<ApiResponse<User[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<User[]>(`${this.baseUrl}/recommendations${queryString}`);
  }

  // User Activity
  async getUserActivity(userId: string, params: SearchParams = {}): Promise<ApiResponse<any[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<any[]>(`${this.baseUrl}/${userId}/activity${queryString}`);
  }

  // Privacy & Blocking
  async blockUser(userId: string, reason?: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/${userId}/block`, { reason });
  }

  async unblockUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/${userId}/block`);
  }

  async getBlockedUsers(params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<User>>(`${this.baseUrl}/blocked${queryString}`);
  }

  // User Verification
  async requestVerification(data: {
    type: 'identity' | 'business' | 'celebrity';
    documents?: string[];
    reason: string;
  }): Promise<ApiResponse<{ requestId: string; status: string }>> {
    return apiClient.post('/users/verification/request', data);
  }

  // Export User Data (GDPR Compliance)
  async exportUserData(): Promise<ApiResponse<{ downloadUrl: string; expiresAt: string }>> {
    return apiClient.post('/users/export-data');
  }

  // Delete Account
  async deleteAccount(
    password: string,
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete('/users/account', {
      data: { password, reason },
    });
  }

  // User Preferences
  async updatePreferences(preferences: {
    privacy?: {
      profileVisibility: 'public' | 'followers' | 'private';
      showEmail: boolean;
      showLocation: boolean;
    };
    notifications?: {
      email: boolean;
      push: boolean;
      sms: boolean;
      marketing: boolean;
    };
    content?: {
      language: string;
      timezone: string;
      theme: 'light' | 'dark' | 'auto';
    };
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put('/users/preferences', preferences);
  }

  async getPreferences(): Promise<ApiResponse<any>> {
    return apiClient.get('/users/preferences');
  }

  // Performance Optimized Methods for Large Scale
  async getUsersInBatch(userIds: string[]): Promise<ApiResponse<User[]>> {
    // Split into chunks of 100 for optimal performance
    const chunks = this.chunkArray(userIds, 100);
    const results: User[] = [];

    for (const chunk of chunks) {
      const response = await apiClient.post<User[]>('/users/batch', { userIds: chunk });
      if (response.success && response.data) {
        results.push(...response.data);
      }
    }

    return {
      success: true,
      data: results,
      message: 'Users retrieved successfully',
    };
  }

  // Utility Methods
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Cache Management for Performance
  private userCache = new Map<string, { user: User; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getCachedUser(userId: string): Promise<User | null> {
    const cached = this.userCache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.user;
    }

    try {
      const response = await this.getUserById(userId);
      if (response.success && response.data) {
        this.userCache.set(userId, {
          user: response.data,
          timestamp: Date.now(),
        });
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }

    return null;
  }

  clearUserCache(userId?: string): void {
    if (userId) {
      this.userCache.delete(userId);
    } else {
      this.userCache.clear();
    }
  }

  // Real-time User Status
  async getUserOnlineStatus(userIds: string[]): Promise<
    ApiResponse<
      Record<
        string,
        {
          isOnline: boolean;
          lastSeen: string;
        }
      >
    >
  > {
    return apiClient.post('/users/online-status', { userIds });
  }

  // User Metrics for Analytics
  async getUserEngagementMetrics(
    userId: string,
    timeRange: string = '30d'
  ): Promise<
    ApiResponse<{
      profileViews: number;
      followersGained: number;
      followersLost: number;
      postsCreated: number;
      likesReceived: number;
      commentsReceived: number;
      sharesReceived: number;
    }>
  > {
    const queryString = apiClient.buildQueryString({ timeRange });
    return apiClient.get(`${this.baseUrl}/${userId}/metrics${queryString}`);
  }
}

export const userService = new UserService();
export default userService;
