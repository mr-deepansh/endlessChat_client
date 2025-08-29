import { apiClient } from '../core/apiClient';
import {
  ApiResponse,
  User,
  UserSearchParams,
  FollowResponse,
  FeedParams,
  Post,
} from '../../types/api';

class UserService {
  private readonly baseUrl = '/users';

  // User Discovery & Search
  async searchUsers(params: UserSearchParams = {}): Promise<ApiResponse<User[]>> {
    // Use mock data for now since backend returns unexpected format
    return this.mockSearchUsers(params);

    /* Uncomment when backend is fixed
    const queryString = apiClient.buildQueryString(params);
    try {
      const response = await apiClient.get<User[]>(`${this.baseUrl}/search${queryString}`);
      // Ensure response.data is always an array
      if (response.success && response.data) {
        const users = Array.isArray(response.data) ? response.data : 
                     response.data.users ? response.data.users : 
                     [response.data].filter(u => u && u._id);
        return { ...response, data: users };
      }
      return response;
    } catch (error: any) {
      return this.mockSearchUsers(params);
    }
    */
  }

  // Mock search implementation for development
  private mockSearchUsers(params: UserSearchParams): Promise<ApiResponse<User[]>> {
    const mockUsers: User[] = [
      {
        _id: '1',
        username: 'admin_user',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        role: 'admin',
        isActive: true,
        followersCount: 150,
        followingCount: 75,
        postsCount: 25,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '2',
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        role: 'user',
        isActive: true,
        followersCount: 89,
        followingCount: 120,
        postsCount: 45,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: '3',
        username: 'sarah_smith',
        firstName: 'Sarah',
        lastName: 'Smith',
        email: 'sarah@example.com',
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612c8e8?w=100&h=100&fit=crop&crop=face',
        role: 'user',
        isActive: true,
        followersCount: 234,
        followingCount: 89,
        postsCount: 67,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Filter users based on search query
    const filtered = params.username
      ? mockUsers.filter(
          user =>
            user.username.toLowerCase().includes(params.username!.toLowerCase()) ||
            user.firstName.toLowerCase().includes(params.username!.toLowerCase()) ||
            user.lastName.toLowerCase().includes(params.username!.toLowerCase())
        )
      : mockUsers;

    const limited = filtered.slice(0, params.limit || 10);

    return Promise.resolve({
      success: true,
      data: limited,
      message: 'Mock search results',
    });
  }

  async getAllUsers(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      isActive?: boolean;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<ApiResponse<User[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<User[]>(`${this.baseUrl}${queryString}`);
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${this.baseUrl}/${userId}`);
  }

  // Social Features
  async followUser(userId: string): Promise<ApiResponse<FollowResponse>> {
    return apiClient.post<FollowResponse>(`${this.baseUrl}/follow/${userId}`);
  }

  async unfollowUser(userId: string): Promise<ApiResponse<FollowResponse>> {
    return apiClient.post<FollowResponse>(`${this.baseUrl}/unfollow/${userId}`);
  }

  async getFollowers(
    userId: string,
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<User[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<User[]>(`${this.baseUrl}/followers/${userId}${queryString}`);
  }

  async getFollowing(
    userId: string,
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<User[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<User[]>(`${this.baseUrl}/following/${userId}${queryString}`);
  }

  // Feed Management
  async getFeed(params: FeedParams = {}): Promise<ApiResponse<Post[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Post[]>(`${this.baseUrl}/feed${queryString}`);
  }

  async getUserFeed(userId: string, params: FeedParams = {}): Promise<ApiResponse<Post[]>> {
    // Use mock data for now since backend endpoint doesn't exist
    return this.mockUserFeed(userId, params);

    /* Uncomment when backend is ready
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Post[]>(`${this.baseUrl}/${userId}/feed${queryString}`);
    */
  }

  // Mock user feed implementation
  private mockUserFeed(userId: string, params: FeedParams = {}): Promise<ApiResponse<Post[]>> {
    const mockPosts: Post[] = [
      {
        _id: '1',
        content: 'Just launched my new project! Excited to share it with the community. 🚀',
        author: {
          _id: userId,
          username: 'admin_user',
          firstName: 'Admin',
          lastName: 'User',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        },
        likesCount: 24,
        commentsCount: 8,
        repostsCount: 3,
        viewsCount: 156,
        isLiked: false,
        isBookmarked: false,
        isReposted: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '2',
        content:
          'Beautiful sunset from my morning run! 🌅 Nothing beats starting the day with some fresh air and exercise.',
        author: {
          _id: userId,
          username: 'admin_user',
          firstName: 'Admin',
          lastName: 'User',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        },
        likesCount: 45,
        commentsCount: 12,
        repostsCount: 7,
        viewsCount: 289,
        isLiked: true,
        isBookmarked: false,
        isReposted: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        _id: '3',
        content:
          'Hot take: TypeScript is not just JavaScript with types. It fundamentally changes how you think about code structure and maintainability. 💭',
        author: {
          _id: userId,
          username: 'admin_user',
          firstName: 'Admin',
          lastName: 'User',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        },
        likesCount: 67,
        commentsCount: 23,
        repostsCount: 15,
        viewsCount: 445,
        isLiked: false,
        isBookmarked: true,
        isReposted: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Filter and paginate if needed
    const limit = params.limit || 10;
    const page = params.page || 1;
    const startIndex = (page - 1) * limit;
    const paginatedPosts = mockPosts.slice(startIndex, startIndex + limit);

    return Promise.resolve({
      success: true,
      data: paginatedPosts,
      message: 'Mock user feed data',
    });
  }

  // User Statistics
  async getUserStats(userId: string): Promise<
    ApiResponse<{
      postsCount: number;
      followersCount: number;
      followingCount: number;
      likesReceived: number;
      commentsReceived: number;
      joinedAt: string;
      lastActiveAt: string;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/${userId}/stats`);
  }

  // User Preferences
  async updatePreferences(preferences: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
    notifications?: {
      email: boolean;
      push: boolean;
      inApp: boolean;
    };
    privacy?: {
      profileVisibility: 'public' | 'private';
      showEmail: boolean;
      showFollowers: boolean;
      showFollowing: boolean;
    };
  }): Promise<ApiResponse<void>> {
    return apiClient.put<void>(`${this.baseUrl}/preferences`, preferences);
  }

  async getPreferences(): Promise<
    ApiResponse<{
      theme: 'light' | 'dark' | 'system';
      language: string;
      notifications: {
        email: boolean;
        push: boolean;
        inApp: boolean;
      };
      privacy: {
        profileVisibility: 'public' | 'private';
        showEmail: boolean;
        showFollowers: boolean;
        showFollowing: boolean;
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/preferences`);
  }

  // Blocking & Reporting
  async blockUser(userId: string, reason?: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.baseUrl}/block/${userId}`, { reason });
  }

  async unblockUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.baseUrl}/block/${userId}`);
  }

  async getBlockedUsers(
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<User[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<User[]>(`${this.baseUrl}/blocked${queryString}`);
  }

  async reportUser(
    userId: string,
    data: {
      reason: string;
      description?: string;
      category: 'spam' | 'harassment' | 'inappropriate' | 'fake' | 'other';
    }
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.baseUrl}/report/${userId}`, data);
  }

  // User Verification
  async requestVerification(data: {
    type: 'identity' | 'business' | 'creator';
    documents?: string[];
    description: string;
  }): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.baseUrl}/verification/request`, data);
  }

  async getVerificationStatus(): Promise<
    ApiResponse<{
      status: 'none' | 'pending' | 'approved' | 'rejected';
      type?: string;
      submittedAt?: string;
      reviewedAt?: string;
      reason?: string;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/verification/status`);
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

  async getSuggestedFollows(
    params: {
      limit?: number;
      excludeFollowing?: boolean;
    } = {}
  ): Promise<ApiResponse<User[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<User[]>(`${this.baseUrl}/suggestions/follow${queryString}`);
  }

  // User Activity
  async getUserActivity(
    userId: string,
    params: {
      page?: number;
      limit?: number;
      type?: 'posts' | 'likes' | 'comments' | 'follows';
    } = {}
  ): Promise<
    ApiResponse<
      Array<{
        type: string;
        action: string;
        target: any;
        timestamp: string;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/${userId}/activity${queryString}`);
  }

  // Bulk Operations
  async followMultipleUsers(userIds: string[]): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ userId: string; error: string }>;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/bulk/follow`, { userIds });
  }

  async unfollowMultipleUsers(userIds: string[]): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ userId: string; error: string }>;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/bulk/unfollow`, { userIds });
  }

  // User Export
  async exportUserData(): Promise<
    ApiResponse<{
      downloadUrl: string;
      expiresAt: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/export`);
  }

  // Account Deletion
  async requestAccountDeletion(data: {
    password: string;
    reason?: string;
    feedback?: string;
  }): Promise<
    ApiResponse<{
      scheduledDeletionDate: string;
      cancellationDeadline: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/delete-account`, data);
  }

  async cancelAccountDeletion(): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/cancel-deletion`);
  }

  // Utility Methods
  async checkUsernameAvailability(username: string): Promise<
    ApiResponse<{
      available: boolean;
      suggestions?: string[];
    }>
  > {
    return apiClient.get(`${this.baseUrl}/check-username/${username}`);
  }

  async checkEmailAvailability(email: string): Promise<
    ApiResponse<{
      available: boolean;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/check-email`, { email });
  }
}

export const userService = new UserService();
export default userService;
