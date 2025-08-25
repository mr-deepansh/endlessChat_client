import { api, withErrorHandling } from './api';
import { Comment } from './userService';

export interface CreateCommentData {
  content: string;
  postId: string;
  parentId?: string;
}

export interface UpdateCommentData {
  content: string;
}

export interface CommentsResponse {
  comments: Comment[];
  hasMore: boolean;
  nextCursor?: string;
}

export const commentService = {
  // Create comment
  createComment: async (data: CreateCommentData): Promise<Comment> => {
    return withErrorHandling(
      () => api.post<Comment>('/comments', data),
      'Failed to create comment'
    );
  },

  // Get post comments
  getPostComments: async (
    postId: string,
    cursor?: string,
    limit: number = 20
  ): Promise<CommentsResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    return withErrorHandling(
      () => api.get<CommentsResponse>(`/comments/post/${postId}?${params.toString()}`),
      'Failed to load comments'
    );
  },

  // Get comment replies
  getCommentReplies: async (
    commentId: string,
    cursor?: string,
    limit: number = 10
  ): Promise<CommentsResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    return withErrorHandling(
      () => api.get<CommentsResponse>(`/comments/${commentId}/replies?${params.toString()}`),
      'Failed to load replies'
    );
  },

  // Update comment
  updateComment: async (commentId: string, data: UpdateCommentData): Promise<Comment> => {
    return withErrorHandling(
      () => api.put<Comment>(`/comments/${commentId}`, data),
      'Failed to update comment'
    );
  },

  // Delete comment
  deleteComment: async (commentId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.delete<{ message: string }>(`/comments/${commentId}`),
      'Failed to delete comment'
    );
  },

  // Like/Unlike comment
  toggleLike: async (commentId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    return withErrorHandling(
      () => api.post<{ isLiked: boolean; likesCount: number }>(`/comments/${commentId}/like`),
      'Failed to update like'
    );
  },
};
