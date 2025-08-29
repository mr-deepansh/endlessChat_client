import { apiClient } from '../core/apiClient';
import { ApiResponse, Post, FeedParams, User } from '../../types/api';

class FeedService {
  private readonly baseUrl = '/users';
  private readonly postsUrl = '/posts';

  // Feed Management
  async getFeed(params: FeedParams = {}): Promise<ApiResponse<Post[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Post[]>(`${this.baseUrl}/feed${queryString}`);
  }

  async getUserFeed(userId: string, params: FeedParams = {}): Promise<ApiResponse<Post[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Post[]>(`${this.baseUrl}/${userId}/feed${queryString}`);
  }

  async getExploreFeed(params: FeedParams = {}): Promise<ApiResponse<Post[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Post[]>(`${this.postsUrl}/explore${queryString}`);
  }

  async getTrendingPosts(
    params: {
      timeframe?: '1h' | '24h' | '7d' | '30d';
      limit?: number;
      category?: string;
    } = {}
  ): Promise<ApiResponse<Post[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Post[]>(`${this.postsUrl}/trending${queryString}`);
  }

  // Post Creation & Management
  async createPost(data: {
    content: string;
    images?: string[];
    visibility?: 'public' | 'private' | 'followers';
    tags?: string[];
    location?: {
      name: string;
      coordinates?: [number, number];
    };
    scheduledAt?: string;
  }): Promise<ApiResponse<Post>> {
    return apiClient.post<Post>(`${this.postsUrl}`, data);
  }

  async updatePost(
    postId: string,
    data: {
      content?: string;
      visibility?: 'public' | 'private' | 'followers';
      tags?: string[];
    }
  ): Promise<ApiResponse<Post>> {
    return apiClient.put<Post>(`${this.postsUrl}/${postId}`, data);
  }

  async deletePost(postId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.postsUrl}/${postId}`);
  }

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    return apiClient.get<Post>(`${this.postsUrl}/${postId}`);
  }

  // Post Interactions
  async likePost(postId: string): Promise<
    ApiResponse<{
      isLiked: boolean;
      likesCount: number;
    }>
  > {
    return apiClient.post(`${this.postsUrl}/${postId}/like`);
  }

  async unlikePost(postId: string): Promise<
    ApiResponse<{
      isLiked: boolean;
      likesCount: number;
    }>
  > {
    return apiClient.delete(`${this.postsUrl}/${postId}/like`);
  }

  async bookmarkPost(postId: string): Promise<
    ApiResponse<{
      isBookmarked: boolean;
    }>
  > {
    return apiClient.post(`${this.postsUrl}/${postId}/bookmark`);
  }

  async unbookmarkPost(postId: string): Promise<
    ApiResponse<{
      isBookmarked: boolean;
    }>
  > {
    return apiClient.delete(`${this.postsUrl}/${postId}/bookmark`);
  }

  async repostPost(
    postId: string,
    data?: {
      comment?: string;
    }
  ): Promise<
    ApiResponse<{
      isReposted: boolean;
      repostsCount: number;
    }>
  > {
    return apiClient.post(`${this.postsUrl}/${postId}/repost`, data);
  }

  async unrepostPost(postId: string): Promise<
    ApiResponse<{
      isReposted: boolean;
      repostsCount: number;
    }>
  > {
    return apiClient.delete(`${this.postsUrl}/${postId}/repost`);
  }

  async sharePost(
    postId: string,
    data: {
      platform: 'twitter' | 'facebook' | 'linkedin' | 'copy' | 'email';
      message?: string;
    }
  ): Promise<
    ApiResponse<{
      shareUrl: string;
      sharesCount: number;
    }>
  > {
    return apiClient.post(`${this.postsUrl}/${postId}/share`, data);
  }

  // Comments
  async getComments(
    postId: string,
    params: {
      page?: number;
      limit?: number;
      sortBy?: 'newest' | 'oldest' | 'popular';
    } = {}
  ): Promise<
    ApiResponse<
      Array<{
        _id: string;
        content: string;
        author: User;
        likesCount: number;
        repliesCount: number;
        isLiked: boolean;
        createdAt: string;
        updatedAt: string;
        parentId?: string;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.postsUrl}/${postId}/comments${queryString}`);
  }

  async addComment(
    postId: string,
    data: {
      content: string;
      parentId?: string; // For replies
    }
  ): Promise<
    ApiResponse<{
      _id: string;
      content: string;
      author: User;
      likesCount: number;
      repliesCount: number;
      isLiked: boolean;
      createdAt: string;
      parentId?: string;
    }>
  > {
    return apiClient.post(`${this.postsUrl}/${postId}/comments`, data);
  }

  async updateComment(
    postId: string,
    commentId: string,
    data: {
      content: string;
    }
  ): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.postsUrl}/${postId}/comments/${commentId}`, data);
  }

  async deleteComment(postId: string, commentId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.postsUrl}/${postId}/comments/${commentId}`);
  }

  async likeComment(
    postId: string,
    commentId: string
  ): Promise<
    ApiResponse<{
      isLiked: boolean;
      likesCount: number;
    }>
  > {
    return apiClient.post(`${this.postsUrl}/${postId}/comments/${commentId}/like`);
  }

  async unlikeComment(
    postId: string,
    commentId: string
  ): Promise<
    ApiResponse<{
      isLiked: boolean;
      likesCount: number;
    }>
  > {
    return apiClient.delete(`${this.postsUrl}/${postId}/comments/${commentId}/like`);
  }

  // Post Analytics
  async getPostAnalytics(postId: string): Promise<
    ApiResponse<{
      views: number;
      likes: number;
      comments: number;
      reposts: number;
      shares: number;
      engagement: {
        rate: number;
        score: number;
      };
      demographics: {
        ageGroups: Record<string, number>;
        countries: Record<string, number>;
        devices: Record<string, number>;
      };
      timeline: Array<{
        date: string;
        views: number;
        interactions: number;
      }>;
    }>
  > {
    return apiClient.get(`${this.postsUrl}/${postId}/analytics`);
  }

  // Bookmarks
  async getBookmarkedPosts(
    params: {
      page?: number;
      limit?: number;
      sortBy?: 'newest' | 'oldest';
    } = {}
  ): Promise<ApiResponse<Post[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Post[]>(`${this.baseUrl}/bookmarks${queryString}`);
  }

  // Search & Discovery
  async searchPosts(params: {
    query: string;
    page?: number;
    limit?: number;
    sortBy?: 'relevance' | 'newest' | 'popular';
    filters?: {
      dateRange?: {
        start: string;
        end: string;
      };
      hasImages?: boolean;
      hasVideos?: boolean;
      author?: string;
      tags?: string[];
    };
  }): Promise<ApiResponse<Post[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Post[]>(`${this.postsUrl}/search${queryString}`);
  }

  async getHashtagPosts(
    hashtag: string,
    params: {
      page?: number;
      limit?: number;
      sortBy?: 'newest' | 'popular';
    } = {}
  ): Promise<ApiResponse<Post[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Post[]>(`${this.postsUrl}/hashtag/${hashtag}${queryString}`);
  }

  async getTrendingHashtags(
    params: {
      limit?: number;
      timeframe?: '1h' | '24h' | '7d';
    } = {}
  ): Promise<
    ApiResponse<
      Array<{
        tag: string;
        count: number;
        growth: number;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.postsUrl}/hashtags/trending${queryString}`);
  }

  // Media Upload
  async uploadImage(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<
    ApiResponse<{
      url: string;
      thumbnailUrl?: string;
      width: number;
      height: number;
      size: number;
    }>
  > {
    return apiClient.uploadFile(`${this.postsUrl}/upload/image`, file, onProgress);
  }

  async uploadVideo(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<
    ApiResponse<{
      url: string;
      thumbnailUrl: string;
      duration: number;
      width: number;
      height: number;
      size: number;
    }>
  > {
    return apiClient.uploadFile(`${this.postsUrl}/upload/video`, file, onProgress);
  }

  // Reporting
  async reportPost(
    postId: string,
    data: {
      reason: 'spam' | 'harassment' | 'inappropriate' | 'copyright' | 'other';
      description?: string;
    }
  ): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.postsUrl}/${postId}/report`, data);
  }

  // Draft Management
  async saveDraft(data: {
    content: string;
    images?: string[];
    visibility?: 'public' | 'private' | 'followers';
    tags?: string[];
  }): Promise<
    ApiResponse<{
      _id: string;
      content: string;
      images?: string[];
      visibility: string;
      tags?: string[];
      createdAt: string;
      updatedAt: string;
    }>
  > {
    return apiClient.post(`${this.postsUrl}/drafts`, data);
  }

  async getDrafts(
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<
    ApiResponse<
      Array<{
        _id: string;
        content: string;
        images?: string[];
        visibility: string;
        tags?: string[];
        createdAt: string;
        updatedAt: string;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.postsUrl}/drafts${queryString}`);
  }

  async updateDraft(
    draftId: string,
    data: {
      content?: string;
      images?: string[];
      visibility?: 'public' | 'private' | 'followers';
      tags?: string[];
    }
  ): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.postsUrl}/drafts/${draftId}`, data);
  }

  async deleteDraft(draftId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.postsUrl}/drafts/${draftId}`);
  }

  async publishDraft(draftId: string): Promise<ApiResponse<Post>> {
    return apiClient.post<Post>(`${this.postsUrl}/drafts/${draftId}/publish`);
  }

  // Scheduled Posts
  async getScheduledPosts(
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<
    ApiResponse<
      Array<{
        _id: string;
        content: string;
        images?: string[];
        visibility: string;
        tags?: string[];
        scheduledAt: string;
        status: 'scheduled' | 'published' | 'failed';
        createdAt: string;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.postsUrl}/scheduled${queryString}`);
  }

  async cancelScheduledPost(postId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.postsUrl}/scheduled/${postId}`);
  }

  async updateScheduledPost(
    postId: string,
    data: {
      content?: string;
      images?: string[];
      visibility?: 'public' | 'private' | 'followers';
      tags?: string[];
      scheduledAt?: string;
    }
  ): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.postsUrl}/scheduled/${postId}`, data);
  }
}

export const feedService = new FeedService();
export default feedService;
