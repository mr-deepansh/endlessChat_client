import { api, ApiResponse } from './api';

export interface PostData {
  content: string;
  images?: string[];
  visibility?: 'public' | 'followers' | 'private';
}

export interface CommentData {
  content: string;
  postId: string;
  parentId?: string;
}

export const realTimePostService = {
  // Create Post
  createPost: async (data: PostData) => {
    const response = await api.post('/posts', data);
    return response.data;
  },

  // Get Feed
  getFeed: async (page = 1, limit = 20) => {
    const response = await api.get('/users/feed', { params: { page, limit } });
    return response.data;
  },

  // Get User Posts
  getUserPosts: async (userId: string, page = 1, limit = 20) => {
    const response = await api.get(`/posts/user/${userId}`, { params: { page, limit } });
    return response.data;
  },

  // Like Post
  likePost: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Unlike Post
  unlikePost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}/like`);
    return response.data;
  },

  // Repost
  repost: async (postId: string, content?: string) => {
    const response = await api.post(`/posts/${postId}/repost`, { content });
    return response.data;
  },

  // Unrepost
  unrepost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}/repost`);
    return response.data;
  },

  // Bookmark Post
  bookmarkPost: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/bookmark`);
    return response.data;
  },

  // Unbookmark Post
  unbookmarkPost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}/bookmark`);
    return response.data;
  },

  // Add Comment
  addComment: async (data: CommentData) => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  // Get Comments
  getComments: async (postId: string, page = 1, limit = 20) => {
    const response = await api.get(`/posts/${postId}/comments`, { params: { page, limit } });
    return response.data;
  },

  // Like Comment
  likeComment: async (commentId: string) => {
    const response = await api.post(`/comments/${commentId}/like`);
    return response.data;
  },

  // Delete Post
  deletePost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  // Update Post
  updatePost: async (postId: string, data: Partial<PostData>) => {
    const response = await api.put(`/posts/${postId}`, data);
    return response.data;
  },
};
