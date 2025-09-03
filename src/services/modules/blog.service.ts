import type { ApiResponse, PaginatedResponse, SearchParams } from '../../types/api';
import { blogsApi as apiClient } from '../core/serviceClients';

export interface BlogPostInput {
  title: string;
  content: string;
  type?: 'post' | 'poll';
  category?: string;
  tags?: string[];
  visibility?: 'public' | 'followers' | 'private';
  status?: 'draft' | 'published';
  poll?: {
    question: string;
    options: Array<{ text: string }>;
    allowMultiple?: boolean;
    endsAt?: string;
  };
  scheduledAt?: string;
}

export interface BlogPost extends BlogPostInput {
  _id?: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  metrics?: {
    likes: number;
    views: number;
    shares: number;
    bookmarks: number;
  };
}

export interface BlogCommentInput {
  content: string;
  parentCommentId?: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListParams extends SearchParams {
  status?: 'draft' | 'published';
  type?: 'post' | 'poll';
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

class BlogService {
  private readonly baseUrl = '/blogs';

  async createPost(data: BlogPostInput): Promise<ApiResponse<BlogPost>> {
    const payload = {
      title: data.title || 'Untitled',
      content: data.content,
      type: data.type || 'post',
      status: data.status || 'published',
      category: data.category,
      tags: data.tags,
      visibility: data.visibility || 'public',
      poll: data.poll,
      scheduledAt: data.scheduledAt,
    };
    return apiClient.post<BlogPost>(`${this.baseUrl}/posts`, payload);
  }

  async schedulePost(data: {
    title: string;
    content: string;
    scheduledAt: string;
  }): Promise<ApiResponse<{ id: string; scheduledAt: string }>> {
    return apiClient.post(`${this.baseUrl}/posts`, data);
  }

  async getPosts(params: BlogListParams = {}): Promise<{
    success: boolean;
    posts: BlogPost[];
    pagination: PaginatedResponse<BlogPost>['pagination'] | undefined;
    message?: string;
  }> {
    const queryString = apiClient.buildQueryString(params);
    const resp = await apiClient.get<PaginatedResponse<BlogPost>>(
      `${this.baseUrl}/posts${queryString}`
    );
    return {
      success: resp.success,
      posts: resp.data?.items || [],
      pagination: resp.data?.pagination,
      message: resp.message,
    };
  }

  async getPublishedPosts(params: Omit<BlogListParams, 'status'> = {}): Promise<{
    success: boolean;
    posts: BlogPost[];
    pagination: PaginatedResponse<BlogPost>['pagination'] | undefined;
    message?: string;
  }> {
    const queryString = apiClient.buildQueryString({ ...params, status: 'published' });
    const resp = await apiClient.get<PaginatedResponse<BlogPost>>(
      `${this.baseUrl}/posts${queryString}`
    );
    return {
      success: resp.success,
      posts: resp.data?.items || [],
      pagination: resp.data?.pagination,
      message: resp.message,
    };
  }

  async getDraftPosts(params: Omit<BlogListParams, 'status'> = {}): Promise<{
    success: boolean;
    posts: BlogPost[];
    pagination: PaginatedResponse<BlogPost>['pagination'] | undefined;
    message?: string;
  }> {
    const queryString = apiClient.buildQueryString({ ...params, status: 'draft' });
    const resp = await apiClient.get<PaginatedResponse<BlogPost>>(
      `${this.baseUrl}/posts${queryString}`
    );
    return {
      success: resp.success,
      posts: resp.data?.items || [],
      pagination: resp.data?.pagination,
      message: resp.message,
    };
  }

  async getPollPosts(params: Omit<BlogListParams, 'type'> = {}): Promise<{
    success: boolean;
    posts: BlogPost[];
    pagination: PaginatedResponse<BlogPost>['pagination'] | undefined;
    message?: string;
  }> {
    const queryString = apiClient.buildQueryString({ ...params, type: 'poll' });
    const resp = await apiClient.get<PaginatedResponse<BlogPost>>(
      `${this.baseUrl}/posts${queryString}`
    );
    return {
      success: resp.success,
      posts: resp.data?.items || [],
      pagination: resp.data?.pagination,
      message: resp.message,
    };
  }

  async getMyPosts(params: Pick<SearchParams, 'page' | 'limit'> = {}): Promise<{
    success: boolean;
    posts: BlogPost[];
    pagination: PaginatedResponse<BlogPost>['pagination'] | undefined;
    message?: string;
  }> {
    const queryString = apiClient.buildQueryString(params);
    const resp = await apiClient.get<PaginatedResponse<BlogPost>>(
      `${this.baseUrl}/posts/my-posts${queryString}`
    );
    return {
      success: resp.success,
      posts: resp.data?.items || [],
      pagination: resp.data?.pagination,
      message: resp.message,
    };
  }

  async getPostById(postId: string): Promise<ApiResponse<BlogPost>> {
    return apiClient.get<BlogPost>(`${this.baseUrl}/posts/${postId}`);
  }

  async updatePost(
    postId: string,
    data: Partial<BlogPostInput & { status?: 'draft' | 'published' }>
  ): Promise<ApiResponse<BlogPost>> {
    return apiClient.patch<BlogPost>(`${this.baseUrl}/posts/${postId}`, data);
  }

  async deletePost(postId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/posts/${postId}`);
  }

  async likePost(postId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/engagement/${postId}/like`);
  }

  async trackView(postId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/engagement/${postId}/view`);
  }

  async sharePost(postId: string, platform?: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(
      `${this.baseUrl}/engagement/${postId}/share`,
      platform ? { platform } : {}
    );
  }

  async repost(postId: string, quote?: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/engagement/${postId}/repost`, quote ? { quote } : {});
  }

  async bookmarkPost(postId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/engagement/${postId}/bookmark`);
  }

  async voteOnPoll(postId: string, optionId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/engagement/${postId}/vote`, { optionId });
  }

  async addComment(postId: string, data: BlogCommentInput): Promise<ApiResponse<BlogComment>> {
    return apiClient.post(`${this.baseUrl}/comments/${postId}`, data);
  }

  async replyToComment(
    postId: string,
    data: Required<BlogCommentInput>
  ): Promise<ApiResponse<BlogComment>> {
    return apiClient.post(`${this.baseUrl}/comments/${postId}`, data);
  }

  async getComments(
    postId: string,
    params: Pick<SearchParams, 'page' | 'limit'> = {}
  ): Promise<ApiResponse<PaginatedResponse<BlogComment>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/comments/${postId}${queryString}`);
  }
}

export const blogService = new BlogService();
export default blogService;
