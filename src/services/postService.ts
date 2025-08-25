import { api, withErrorHandling } from './api';
import { User, Post } from './userService';

export interface CreatePostData {
  content: string;
  media?: File[];
  repostId?: string;
}

export interface UpdatePostData {
  content?: string;
}

export interface PostsResponse {
  posts: Post[];
  hasMore: boolean;
  nextCursor?: string;
}

export const postService = {
  // Create post
  createPost: async (data: CreatePostData): Promise<Post> => {
    const formData = new FormData();
    formData.append('content', data.content);

    if (data.repostId) {
      formData.append('repostId', data.repostId);
    }

    if (data.media && data.media.length > 0) {
      data.media.forEach((file, index) => {
        formData.append(`media`, file);
      });
    }

    return withErrorHandling(() => api.upload<Post>('/posts', formData), 'Failed to create post');
  },

  // Get feed posts
  getFeedPosts: async (cursor?: string, limit: number = 20): Promise<PostsResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    return withErrorHandling(
      () => api.get<PostsResponse>(`/posts/feed?${params.toString()}`),
      'Failed to load feed'
    );
  },

  // Get user posts
  getUserPosts: async (
    userId?: string,
    cursor?: string,
    limit: number = 20
  ): Promise<PostsResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    const endpoint = userId ? `/posts/user/${userId}` : '/posts/me';
    return withErrorHandling(
      () => api.get<PostsResponse>(`${endpoint}?${params.toString()}`),
      'Failed to load posts'
    );
  },

  // Get single post
  getPost: async (postId: string): Promise<Post> => {
    return withErrorHandling(() => api.get<Post>(`/posts/${postId}`), 'Failed to load post');
  },

  // Update post
  updatePost: async (postId: string, data: UpdatePostData): Promise<Post> => {
    return withErrorHandling(
      () => api.put<Post>(`/posts/${postId}`, data),
      'Failed to update post'
    );
  },

  // Delete post
  deletePost: async (postId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.delete<{ message: string }>(`/posts/${postId}`),
      'Failed to delete post'
    );
  },

  // Like/Unlike post
  toggleLike: async (postId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
    return withErrorHandling(
      () => api.post<{ isLiked: boolean; likesCount: number }>(`/posts/${postId}/like`),
      'Failed to update like'
    );
  },

  // Bookmark/Unbookmark post
  toggleBookmark: async (postId: string): Promise<{ isBookmarked: boolean }> => {
    return withErrorHandling(
      () => api.post<{ isBookmarked: boolean }>(`/posts/${postId}/bookmark`),
      'Failed to update bookmark'
    );
  },

  // Repost
  repost: async (postId: string, content?: string): Promise<Post> => {
    return withErrorHandling(
      () => api.post<Post>(`/posts/${postId}/repost`, { content }),
      'Failed to repost'
    );
  },

  // Get bookmarked posts
  getBookmarkedPosts: async (cursor?: string, limit: number = 20): Promise<PostsResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    return withErrorHandling(
      () => api.get<PostsResponse>(`/posts/bookmarks?${params.toString()}`),
      'Failed to load bookmarked posts'
    );
  },

  // Search posts
  searchPosts: async (
    query: string,
    cursor?: string,
    limit: number = 20
  ): Promise<PostsResponse> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    return withErrorHandling(
      () => api.get<PostsResponse>(`/posts/search?${params.toString()}`),
      'Failed to search posts'
    );
  },
};
