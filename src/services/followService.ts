import { apiClient } from './core/apiClient';
import type { ApiResponse } from './api';

export interface FollowResponse {
  success: boolean;
  message: string;
  data?: {
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
  };
}

export const followService = {
  // Follow/Unfollow toggle (backend now handles both)
  followUser: async (userId: string): Promise<FollowResponse> => {
    const response = await apiClient.post(`/users/follow/${userId}`, {});
    return response;
  },

  // Unfollow a user (kept for compatibility)
  unfollowUser: async (userId: string): Promise<FollowResponse> => {
    // Use same endpoint as follow since backend handles toggle
    const response = await apiClient.post(`/users/follow/${userId}`, {});
    return response;
  },

  // Get followers list
  getFollowers: async (userId: string, page = 1, limit = 20) => {
    const response = await apiClient.get(`/users/followers/${userId}?page=${page}&limit=${limit}`);
    return response;
  },

  // Get following list
  getFollowing: async (userId: string, page = 1, limit = 20) => {
    const response = await apiClient.get(`/users/following/${userId}?page=${page}&limit=${limit}`);
    return response;
  },

  // Check if following
  checkFollowStatus: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}/follow-status`);
    return response;
  },
};
