/**
 * Enterprise-grade Comment Service
 * Handles all comment-related operations with validation, caching, and security
 * @module CommentService
 */

import { apiClient } from './core/apiClient';
import Logger from '../utils/logger';

// ==================== Types ====================

export interface CommentAuthor {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export interface Comment {
  _id: string;
  content: string;
  author: CommentAuthor;
  post: string;
  likes: string[];
  likesCount: number;
  replies: Comment[];
  repliesCount: number;
  parentComment?: string;
  isLiked: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  comments: Comment[];
  totalComments: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CommentFilters {
  page?: number;
  limit?: number;
  sortBy?: 'newest' | 'oldest' | 'popular';
}

export interface CreateCommentData {
  content: string;
  parentComment?: string;
}

export interface UpdateCommentData {
  content: string;
}

// ==================== Validation ====================

class CommentValidator {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 2000;

  static validateContent(content: string): { valid: boolean; error?: string } {
    if (!content || typeof content !== 'string') {
      return { valid: false, error: 'Comment content is required' };
    }

    const trimmed = content.trim();
    if (trimmed.length < this.MIN_LENGTH) {
      return { valid: false, error: 'Comment is too short' };
    }

    if (trimmed.length > this.MAX_LENGTH) {
      return { valid: false, error: `Comment must be less than ${this.MAX_LENGTH} characters` };
    }

    return { valid: true };
  }

  static sanitizeContent(content: string): string {
    return content.trim().replace(/\s+/g, ' ');
  }
}

// ==================== Service ====================

class CommentService {
  private readonly BASE_PATH = '/posts';
  private readonly DEFAULT_LIMIT = 20;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 60000; // 1 minute

  /**
   * Get comments for a post with pagination and sorting
   */
  async getComments(postId: string, filters: CommentFilters = {}): Promise<CommentsResponse> {
    const { page = 1, limit = this.DEFAULT_LIMIT, sortBy = 'createdAt' } = filters;

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy,
        sortOrder: 'desc',
        loadReplies: 'true',
      });

      const url = `/blogs/comments/${postId}?${params}`;
      console.log('🔍 [CommentService] Fetching comments:', { postId, url, filters });

      const cacheKey = `comments_${postId}_${params.toString()}`;
      const cached = this.getFromCache<CommentsResponse>(cacheKey);
      if (cached) {
        console.log('✅ [CommentService] Cache hit:', cacheKey);
        return cached;
      }

      const response = await apiClient.get(url);
      console.log('✅ [CommentService] Response received:', response);

      const result = this.normalizeCommentsResponse(response.data);
      console.log('✅ [CommentService] Normalized result:', result);

      this.setCache(cacheKey, result);
      return result;
    } catch (error: any) {
      console.error('❌ [CommentService] Error details:', {
        postId,
        error: error?.message || error,
        response: error?.response?.data,
        status: error?.response?.status,
        url: `/blogs/comments/${postId}`,
      });
      Logger.error('Failed to fetch comments', { postId, error });
      throw error;
    }
  }

  /**
   * Add a new comment to a post
   */
  async addComment(postId: string, data: CreateCommentData): Promise<Comment> {
    const validation = CommentValidator.validateContent(data.content);
    if (!validation.valid) {
      console.error('❌ [CommentService] Validation failed:', validation.error);
      throw new Error(validation.error);
    }

    try {
      const sanitizedContent = CommentValidator.sanitizeContent(data.content);
      const payload = {
        content: sanitizedContent,
        parentCommentId: data.parentComment,
      };

      console.log('🔍 [CommentService] Adding comment:', { postId, payload });

      const response = await apiClient.post(`/blogs/comments/${postId}`, payload);
      console.log('✅ [CommentService] Comment added:', response);

      this.invalidateCacheForPost(postId);
      return this.normalizeComment(response.data.data || response.data);
    } catch (error: any) {
      console.error('❌ [CommentService] Add comment error:', {
        postId,
        error: error?.message || error,
        response: error?.response?.data,
        status: error?.response?.status,
      });
      Logger.error('Failed to add comment', { postId, error });
      throw error;
    }
  }

  /**
   * Toggle like on a comment
   */
  async toggleCommentLike(commentId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    try {
      const response = await apiClient.post(`/blogs/comments/like/${commentId}`);
      const data = response.data.data || response.data;

      this.invalidateCache();
      return {
        isLiked: data.isLiked ?? true,
        likesCount: data.likesCount ?? 0,
      };
    } catch (error) {
      Logger.error('Failed to toggle comment like', { commentId, error });
      throw new Error('Failed to like comment');
    }
  }

  /**
   * Reply to a comment
   */
  async replyToComment(commentId: string, content: string): Promise<Comment> {
    const validation = CommentValidator.validateContent(content);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const sanitizedContent = CommentValidator.sanitizeContent(content);
      const response = await apiClient.post(`/comments/${commentId}/reply`, {
        content: sanitizedContent,
      });

      this.invalidateCache();
      return this.normalizeComment(response.data.data || response.data);
    } catch (error) {
      Logger.error('Failed to reply to comment', { commentId, error });
      throw new Error('Failed to post reply');
    }
  }

  /**
   * Update an existing comment
   */
  async updateComment(commentId: string, data: UpdateCommentData): Promise<Comment> {
    const validation = CommentValidator.validateContent(data.content);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const sanitizedContent = CommentValidator.sanitizeContent(data.content);
      const response = await apiClient.patch(`/blogs/comments/${commentId}`, {
        content: sanitizedContent,
      });

      this.invalidateCache();
      return this.normalizeComment(response.data.data || response.data);
    } catch (error) {
      Logger.error('Failed to update comment', { commentId, error });
      throw new Error('Failed to update comment');
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(commentId: string): Promise<void> {
    try {
      await apiClient.delete(`/blogs/comments/${commentId}`);
      this.invalidateCache();
    } catch (error) {
      Logger.error('Failed to delete comment', { commentId, error });
      throw new Error('Failed to delete comment');
    }
  }

  /**
   * Get comment by ID
   */
  async getCommentById(commentId: string): Promise<Comment> {
    try {
      const cacheKey = `comment_${commentId}`;
      const cached = this.getFromCache<Comment>(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get(`/comments/${commentId}`);
      const comment = this.normalizeComment(response.data.data || response.data);

      this.setCache(cacheKey, comment);
      return comment;
    } catch (error) {
      Logger.error('Failed to fetch comment', { commentId, error });
      throw new Error('Failed to load comment');
    }
  }

  /**
   * Get replies for a comment
   */
  async getCommentReplies(
    commentId: string,
    filters: CommentFilters = {}
  ): Promise<CommentsResponse> {
    const { page = 1, limit = this.DEFAULT_LIMIT } = filters;

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const response = await apiClient.get(`/blogs/comments/replies/${commentId}?${params}`);
      return this.normalizeCommentsResponse(response.data);
    } catch (error) {
      Logger.error('Failed to fetch comment replies', { commentId, error });
      throw new Error('Failed to load replies');
    }
  }

  // ==================== Private Methods ====================

  private normalizeCommentsResponse(data: any): CommentsResponse {
    return {
      comments: (data.comments || data.data || []).map((comment: any) =>
        this.normalizeComment(comment)
      ),
      totalComments: data.pagination?.totalCount || data.total || 0,
      totalPages: data.pagination?.totalPages || 0,
      currentPage: data.pagination?.currentPage || 1,
      hasNextPage: data.pagination?.hasNext || false,
      hasPrevPage: data.pagination?.hasPrev || false,
    };
  }

  private normalizeComment(comment: any): Comment {
    const author = comment.author || {};
    const fullName = author.fullName || `${author.firstName || ''} ${author.lastName || ''}`.trim();
    const firstName = author.firstName || fullName.split(' ')[0] || 'Unknown';
    const lastName = author.lastName || fullName.split(' ')[1] || 'User';

    return {
      _id: comment._id,
      content: comment.content || '',
      author: {
        _id: author._id || 'unknown',
        username: author.username || 'unknown',
        firstName,
        lastName,
        avatar: author.avatar || null,
      },
      post: comment.post || comment.postId || '',
      likes: comment.likes || [],
      likesCount: comment.likeCount || comment.likesCount || comment.likes?.length || 0,
      replies: (comment.replies || []).map((reply: any) => this.normalizeComment(reply)),
      repliesCount: comment.replyCount || comment.repliesCount || comment.replies?.length || 0,
      parentComment: comment.parentComment,
      isLiked: comment.isLiked || false,
      isEdited: comment.isEdited || false,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private invalidateCache(): void {
    this.cache.clear();
  }

  private invalidateCacheForPost(postId: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(postId)) {
        this.cache.delete(key);
      }
    }
  }
}

export default new CommentService();
