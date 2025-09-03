import { postsApi as apiClient } from '../core/serviceClients';
import type { ApiResponse, PaginatedResponse, SearchParams } from '../../types/api';

export interface Post {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isVerified?: boolean;
  };
  media?: Array<{
    type: 'image' | 'video' | 'gif';
    url: string;
    thumbnail?: string;
    alt?: string;
  }>;
  location?: {
    name: string;
    coordinates?: { lat: number; lng: number };
  };
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    reposts: number;
  };
  engagement: {
    isLiked: boolean;
    isBookmarked: boolean;
    isReposted: boolean;
    isFollowing: boolean;
  };
  visibility: 'public' | 'followers' | 'private';
  type: 'text' | 'image' | 'video' | 'poll' | 'article' | 'repost';
  tags?: string[];
  mentions?: string[];
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  expiresAt?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  postId: string;
  parentId?: string;
  replies?: Comment[];
  likes: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  content: string;
  media?: Array<{
    type: 'image' | 'video' | 'gif';
    url: string;
    alt?: string;
  }>;
  location?: {
    name: string;
    coordinates?: { lat: number; lng: number };
  };
  visibility?: 'public' | 'followers' | 'private';
  tags?: string[];
  mentions?: string[];
  scheduledAt?: string;
  expiresAt?: string;
}

export interface FeedParams extends SearchParams {
  type?: 'timeline' | 'explore' | 'trending' | 'following';
  sort?: 'recent' | 'popular' | 'trending';
  timeRange?: '1h' | '24h' | '7d' | '30d';
  category?: string;
  location?: string;
  hasMedia?: boolean;
}

class FeedService {
  private readonly baseUrl = '/posts';
  private readonly feedUrl = '/feed';

  // Feed Management
  async getFeed(params: FeedParams = {}): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Post>>(`${this.feedUrl}${queryString}`);
  }

  async getTimelineFeed(params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Post>>(`${this.feedUrl}/timeline${queryString}`);
  }

  async getExploreFeed(params: FeedParams = {}): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Post>>(`${this.feedUrl}/explore${queryString}`);
  }

  async getTrendingFeed(params: FeedParams = {}): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Post>>(`${this.feedUrl}/trending${queryString}`);
  }

  // Post Management
  async createPost(postData: CreatePostData): Promise<ApiResponse<Post>> {
    return apiClient.post<Post>(this.baseUrl, postData);
  }

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    return apiClient.get<Post>(`${this.baseUrl}/${postId}`);
  }

  async updatePost(postId: string, postData: Partial<CreatePostData>): Promise<ApiResponse<Post>> {
    return apiClient.put<Post>(`${this.baseUrl}/${postId}`, postData);
  }

  async deletePost(postId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/${postId}`);
  }

  async getUserPosts(
    userId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Post>>(`/users/${userId}/posts${queryString}`);
  }

  // Post Interactions
  async likePost(postId: string): Promise<
    ApiResponse<{
      isLiked: boolean;
      likesCount: number;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/${postId}/like`);
  }

  async unlikePost(postId: string): Promise<
    ApiResponse<{
      isLiked: boolean;
      likesCount: number;
      message: string;
    }>
  > {
    return apiClient.delete(`${this.baseUrl}/${postId}/like`);
  }

  async repostPost(
    postId: string,
    comment?: string
  ): Promise<
    ApiResponse<{
      repost: Post;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/${postId}/repost`, { comment });
  }

  async unrepostPost(postId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/${postId}/repost`);
  }

  async sharePost(
    postId: string,
    data: {
      platform?: 'twitter' | 'facebook' | 'linkedin' | 'copy';
      message?: string;
    }
  ): Promise<
    ApiResponse<{
      shareUrl: string;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/${postId}/share`, data);
  }

  async bookmarkPost(postId: string): Promise<
    ApiResponse<{
      isBookmarked: boolean;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/${postId}/bookmark`);
  }

  async unbookmarkPost(postId: string): Promise<
    ApiResponse<{
      isBookmarked: boolean;
      message: string;
    }>
  > {
    return apiClient.delete(`${this.baseUrl}/${postId}/bookmark`);
  }

  // Comments Management
  async getPostComments(
    postId: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Comment>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Comment>>(
      `${this.baseUrl}/${postId}/comments${queryString}`
    );
  }

  async createComment(
    postId: string,
    data: {
      content: string;
      parentId?: string;
      mentions?: string[];
    }
  ): Promise<ApiResponse<Comment>> {
    return apiClient.post<Comment>(`${this.baseUrl}/${postId}/comments`, data);
  }

  async updateComment(commentId: string, content: string): Promise<ApiResponse<Comment>> {
    return apiClient.put<Comment>(`/comments/${commentId}`, { content });
  }

  async deleteComment(commentId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`/comments/${commentId}`);
  }

  async likeComment(commentId: string): Promise<
    ApiResponse<{
      isLiked: boolean;
      likesCount: number;
    }>
  > {
    return apiClient.post(`/comments/${commentId}/like`);
  }

  async unlikeComment(commentId: string): Promise<
    ApiResponse<{
      isLiked: boolean;
      likesCount: number;
    }>
  > {
    return apiClient.delete(`/comments/${commentId}/like`);
  }

  // Post Analytics
  async getPostAnalytics(postId: string): Promise<
    ApiResponse<{
      views: {
        total: number;
        unique: number;
        byHour: Array<{ hour: number; views: number }>;
      };
      engagement: {
        likes: number;
        comments: number;
        shares: number;
        reposts: number;
        bookmarks: number;
        clickThroughs: number;
      };
      audience: {
        demographics: Record<string, number>;
        locations: Record<string, number>;
        devices: Record<string, number>;
      };
      performance: {
        engagementRate: number;
        reachRate: number;
        viralityScore: number;
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/${postId}/analytics`);
  }

  // Content Discovery
  async searchPosts(params: {
    query: string;
    type?: 'text' | 'image' | 'video' | 'all';
    sortBy?: 'relevance' | 'recent' | 'popular';
    timeRange?: '1h' | '24h' | '7d' | '30d' | 'all';
    location?: string;
    author?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Post>>(`${this.baseUrl}/search${queryString}`);
  }

  async getPostsByHashtag(
    hashtag: string,
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Post>>(
      `${this.baseUrl}/hashtag/${hashtag}${queryString}`
    );
  }

  async getTrendingHashtags(
    params: {
      timeRange?: '1h' | '24h' | '7d';
      location?: string;
      limit?: number;
    } = {}
  ): Promise<
    ApiResponse<
      Array<{
        hashtag: string;
        count: number;
        trend: 'rising' | 'stable' | 'falling';
        change: number;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`/hashtags/trending${queryString}`);
  }

  // Media Management
  async uploadMedia(
    file: File,
    type: 'image' | 'video' | 'gif'
  ): Promise<
    ApiResponse<{
      url: string;
      thumbnail?: string;
      metadata: {
        size: number;
        dimensions?: { width: number; height: number };
        duration?: number;
        format: string;
      };
    }>
  > {
    return apiClient.uploadFile('/media/upload', file);
  }

  async processVideo(
    videoUrl: string,
    options: {
      quality?: 'low' | 'medium' | 'high';
      generateThumbnail?: boolean;
      compress?: boolean;
    } = {}
  ): Promise<
    ApiResponse<{
      processedUrl: string;
      thumbnail?: string;
      jobId: string;
    }>
  > {
    return apiClient.post('/media/process-video', {
      videoUrl,
      options,
    });
  }

  // Bookmarks & Saved Posts
  async getBookmarkedPosts(
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Post>>(`/bookmarks${queryString}`);
  }

  async createBookmarkCollection(
    name: string,
    description?: string
  ): Promise<
    ApiResponse<{
      id: string;
      name: string;
      description?: string;
    }>
  > {
    return apiClient.post('/bookmarks/collections', { name, description });
  }

  async addToBookmarkCollection(
    collectionId: string,
    postId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`/bookmarks/collections/${collectionId}/posts`, { postId });
  }

  // Post Scheduling
  async schedulePost(postData: CreatePostData & { scheduledAt: string }): Promise<
    ApiResponse<{
      id: string;
      scheduledAt: string;
      status: 'scheduled';
      message: string;
    }>
  > {
    return apiClient.post('/posts/schedule', postData);
  }

  async getScheduledPosts(
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Post>>(`/posts/scheduled${queryString}`);
  }

  async updateScheduledPost(
    postId: string,
    data: Partial<CreatePostData & { scheduledAt: string }>
  ): Promise<ApiResponse<Post>> {
    return apiClient.put(`/posts/scheduled/${postId}`, data);
  }

  async cancelScheduledPost(postId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`/posts/scheduled/${postId}`);
  }

  // Content Moderation
  async reportPost(
    postId: string,
    data: {
      reason: 'spam' | 'harassment' | 'hate_speech' | 'violence' | 'copyright' | 'other';
      description?: string;
    }
  ): Promise<
    ApiResponse<{
      reportId: string;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/${postId}/report`, data);
  }

  async hidePost(postId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/${postId}/hide`);
  }

  async unhidePost(postId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/${postId}/hide`);
  }

  // Real-time Features
  async subscribeToPostUpdates(postId: string, callback: (update: any) => void): () => void {
    const ws = new WebSocket(
      `${apiClient.getInstance().defaults.baseURL?.replace('http', 'ws')}/posts/${postId}/live`
    );

    ws.onmessage = event => {
      try {
        const update = JSON.parse(event.data);
        callback(update);
      } catch (error) {
        console.error('Failed to parse post update:', error);
      }
    };

    return () => ws.close();
  }

  // Performance Optimizations
  private postCache = new Map<string, { post: Post; timestamp: number }>();
  private readonly CACHE_TTL = 2 * 60 * 1000; // 2 minutes

  async getCachedPost(postId: string): Promise<Post | null> {
    const cached = this.postCache.get(postId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.post;
    }

    try {
      const response = await this.getPost(postId);
      if (response.success && response.data) {
        this.postCache.set(postId, {
          post: response.data,
          timestamp: Date.now(),
        });
        return response.data;
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    }

    return null;
  }

  clearPostCache(postId?: string): void {
    if (postId) {
      this.postCache.delete(postId);
    } else {
      this.postCache.clear();
    }
  }

  // Bulk Operations
  async bulkDeletePosts(postIds: string[]): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ postId: string; error: string }>;
    }>
  > {
    return apiClient.post('/posts/bulk/delete', { postIds });
  }

  async bulkUpdatePostVisibility(
    postIds: string[],
    visibility: 'public' | 'followers' | 'private'
  ): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ postId: string; error: string }>;
    }>
  > {
    return apiClient.post('/posts/bulk/visibility', { postIds, visibility });
  }

  // Feed Customization
  async updateFeedPreferences(preferences: {
    showReposts?: boolean;
    showLikedPosts?: boolean;
    contentTypes?: Array<'text' | 'image' | 'video' | 'poll'>;
    languages?: string[];
    blockedKeywords?: string[];
    prioritizeFollowing?: boolean;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put('/feed/preferences', preferences);
  }

  async getFeedPreferences(): Promise<ApiResponse<any>> {
    return apiClient.get('/feed/preferences');
  }

  // Content Insights
  async getContentInsights(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<
    ApiResponse<{
      topPerformingPosts: Post[];
      engagementTrends: Array<{ date: string; engagement: number }>;
      audienceGrowth: Array<{ date: string; followers: number }>;
      bestPostingTimes: Array<{ hour: number; engagement: number }>;
      contentTypePerformance: Record<string, number>;
      hashtagPerformance: Array<{ hashtag: string; reach: number; engagement: number }>;
    }>
  > {
    const queryString = apiClient.buildQueryString({ timeRange });
    return apiClient.get(`/insights/content${queryString}`);
  }
}

export const feedService = new FeedService();
export default feedService;
