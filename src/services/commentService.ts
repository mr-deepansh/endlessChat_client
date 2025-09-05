import api from './api';

export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  post: string;
  likes: string[];
  replies: Comment[];
  isLiked?: boolean;
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

class CommentService {
  // Get comments for a post
  async getComments(postId: string, page = 1, limit = 20): Promise<CommentsResponse> {
    const response = await api.get(`/blogs/comments/${postId}?page=${page}&limit=${limit}`);
    return response.data.data;
  }

  // Add comment to post
  async addComment(postId: string, content: string): Promise<Comment> {
    const response = await api.post(`/blogs/comments/${postId}`, { content });
    return response.data.data;
  }

  // Like/Unlike comment
  async toggleCommentLike(commentId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const response = await api.post(`/blogs/comments/${commentId}/like`);
    return response.data.data;
  }

  // Reply to comment
  async replyToComment(commentId: string, content: string): Promise<Comment> {
    const response = await api.post(`/blogs/comments/${commentId}/reply`, { content });
    return response.data.data;
  }

  // Update comment
  async updateComment(commentId: string, content: string): Promise<Comment> {
    const response = await api.patch(`/blogs/comments/${commentId}`, { content });
    return response.data.data;
  }

  // Delete comment
  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/blogs/comments/${commentId}`);
  }
}

export default new CommentService();