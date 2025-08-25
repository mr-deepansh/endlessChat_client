import { apiClient } from '../core/apiClient';
import { buildQueryString } from '../core/utils';
import {
  User,
  UpdateProfileRequest,
  UploadAvatarRequest,
  MessageResponse,
  UserSearchParams,
  UserSearchByUsernameParams,
  FeedParams,
  FollowParams,
  PaginatedResponse,
} from '../core/types';

/**
 * Profile Service
 * Handles all profile-related API calls
 */
class ProfileService {
  private readonly baseUrl = '/users';

  /**
   * Get current user profile
   */
  async getCurrentProfile(): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseUrl}/profile/me`);
    return response.data;
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId: string): Promise<User> {
    const response = await apiClient.get<User>(`${this.baseUrl}/${userId}`);
    return response.data;
  }

  /**
   * Update current user profile
   */
  async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<User>(`${this.baseUrl}/profile/me`, profileData);
    return response.data;
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(avatarData: UploadAvatarRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      `${this.baseUrl}/upload-avatar`,
      avatarData
    );
    return response.data;
  }

  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers(params: UserSearchParams = {}): Promise<PaginatedResponse<User>> {
    const queryString = buildQueryString(params);
    const response = await apiClient.get<PaginatedResponse<User>>(`${this.baseUrl}${queryString}`);
    return response.data;
  }

  /**
   * Search users by username
   */
  async searchUsers(params: UserSearchByUsernameParams): Promise<User[]> {
    const queryString = buildQueryString(params);
    const response = await apiClient.get<User[]>(`${this.baseUrl}/search${queryString}`);
    return response.data;
  }

  /**
   * Get user feed
   */
  async getUserFeed(params: FeedParams = {}): Promise<any[]> {
    const queryString = buildQueryString(params);
    const response = await apiClient.get<any[]>(`${this.baseUrl}/feed${queryString}`);
    return response.data;
  }

  /**
   * Follow user
   */
  async followUser(userId: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(`${this.baseUrl}/follow/${userId}`);
    return response.data;
  }

  /**
   * Unfollow user
   */
  async unfollowUser(userId: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(`${this.baseUrl}/unfollow/${userId}`);
    return response.data;
  }

  /**
   * Get user followers
   */
  async getFollowers(userId: string, params: FollowParams = {}): Promise<User[]> {
    const queryString = buildQueryString(params);
    const response = await apiClient.get<User[]>(
      `${this.baseUrl}/followers/${userId}${queryString}`
    );
    return response.data;
  }

  /**
   * Get user following
   */
  async getFollowing(userId: string, params: FollowParams = {}): Promise<User[]> {
    const queryString = buildQueryString(params);
    const response = await apiClient.get<User[]>(
      `${this.baseUrl}/following/${userId}${queryString}`
    );
    return response.data;
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId?: string): Promise<{
    postsCount: number;
    followersCount: number;
    followingCount: number;
    likesReceived: number;
  }> {
    const endpoint = userId ? `${this.baseUrl}/${userId}/stats` : `${this.baseUrl}/stats/me`;
    const response = await apiClient.get<{
      postsCount: number;
      followersCount: number;
      followingCount: number;
      likesReceived: number;
    }>(endpoint);
    return response.data;
  }

  /**
   * Block user
   */
  async blockUser(userId: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(`${this.baseUrl}/block/${userId}`);
    return response.data;
  }

  /**
   * Unblock user
   */
  async unblockUser(userId: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(`${this.baseUrl}/unblock/${userId}`);
    return response.data;
  }

  /**
   * Get blocked users
   */
  async getBlockedUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>(`${this.baseUrl}/blocked`);
    return response.data;
  }

  /**
   * Report user
   */
  async reportUser(userId: string, reason: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(`${this.baseUrl}/report/${userId}`, {
      reason,
    });
    return response.data;
  }

  /**
   * Get suggested users
   */
  async getSuggestedUsers(limit: number = 10): Promise<User[]> {
    const response = await apiClient.get<User[]>(`${this.baseUrl}/suggested?limit=${limit}`);
    return response.data;
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<User['preferences']>): Promise<User> {
    const response = await apiClient.patch<User>(`${this.baseUrl}/preferences`, preferences);
    return response.data;
  }

  /**
   * Delete account
   */
  async deleteAccount(password: string): Promise<MessageResponse> {
    const response = await apiClient.delete<MessageResponse>(`${this.baseUrl}/account`, {
      data: { password },
    });
    return response.data;
  }
}

export const profileService = new ProfileService();
export default profileService;
