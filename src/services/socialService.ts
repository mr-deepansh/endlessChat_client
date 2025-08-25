import { api } from './api';
import { User } from './userService';
import { debounce } from '@/utils/debounce';

export interface FollowResponse {
  message: string;
  isFollowing: boolean;
}

export interface FeedParams {
  limit?: number;
  page?: number;
  sort?: 'recent' | 'popular' | 'trending';
}

export interface FeedPost {
  _id: string;
  content: string;
  author: User;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  createdAt: string;
  updatedAt: string;
  media?: string[];
}

export const socialService = {
  // Follow/Unfollow
  followUser: async (userId: string): Promise<FollowResponse> => {
    return api.post<FollowResponse>(`/users/follow/${userId}`);
  },

  unfollowUser: async (userId: string): Promise<FollowResponse> => {
    return api.post<FollowResponse>(`/users/unfollow/${userId}`);
  },

  // Followers/Following
  getFollowers: async (
    userId: string,
    params?: { limit?: number; page?: number }
  ): Promise<User[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const query = queryParams.toString();
    return api.get<User[]>(`/users/followers/${userId}${query ? `?${query}` : ''}`);
  },

  getFollowing: async (
    userId: string,
    params?: { limit?: number; page?: number }
  ): Promise<User[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());

    const query = queryParams.toString();
    return api.get<User[]>(`/users/following/${userId}${query ? `?${query}` : ''}`);
  },

  // Feed Management
  getFeed: async (params?: FeedParams): Promise<FeedPost[]> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    const query = queryParams.toString();
    return api.get<FeedPost[]>(`/users/feed${query ? `?${query}` : ''}`);
  },

  // Debounced search for better performance
  searchUsersDebounced: debounce(async (query: string): Promise<User[]> => {
    if (!query.trim()) return [];
    return api.get<User[]>(`/users/search?username=${encodeURIComponent(query)}`);
  }, 300),
};
