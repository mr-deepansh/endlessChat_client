import { api, withErrorHandling } from './api';
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
  // Follow a user
  followUser: async (userId: string): Promise<FollowResponse> => {
    const response = await api.post(`/users/follow/${userId}`);
    return response.data;
  },

  // Unfollow a user
  unfollowUser: async (userId: string): Promise<FollowResponse> => {
    const response = await api.post(`/users/unfollow/${userId}`);
    return response.data;
  },

  // Get followers list
  getFollowers: async (userId: string, page = 1, limit = 20) => {
    const response = await api.get(`/users/followers/${userId}`, { params: { page, limit } });
    return response.data;
  },

  // Get following list
  getFollowing: async (userId: string, page = 1, limit = 20) => {
    const response = await api.get(`/users/following/${userId}`, { params: { page, limit } });
    return response.data;
  },

  // Check if following
  checkFollowStatus: async (userId: string) => {
    const response = await api.get(`/users/${userId}/follow-status`);
    return response.data;
  },
};
