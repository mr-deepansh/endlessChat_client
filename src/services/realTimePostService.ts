import { blogsApi as blogsClient, usersApi as usersClient } from './core/serviceClients';

export interface PostData {
  title?: string;
  content: string;
  type?: 'post' | 'poll';
  category?: string;
  tags?: string[];
  visibility?: 'public' | 'followers' | 'private';
  status?: 'draft' | 'published';
}

export interface CommentData {
  content: string;
  postId: string;
  parentId?: string;
}

export const realTimePostService = {
  // Create Post
  createPost: async (data: PostData) => {
    const generateUniqueTitle = () => {
      if (data.title) return data.title;
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      return `Post_${timestamp}_${random}`;
    };

    const payload = {
      title: generateUniqueTitle(),
      content: data.content,
      type: data.type || 'post',
      status: data.status || 'published',
      category: data.category,
      tags: data.tags,
      visibility: data.visibility || 'public',
      metadata: {
        device: navigator.userAgent.substring(0, 90),
        language: navigator.language.split(',')[0].substring(0, 5),
        platform: 'web',
      },
    };
    const response = await blogsClient.post('/blogs/posts', payload);
    return response;
  },

  // Get Feed
  getFeed: async (page = 1, limit = 20) => {
    const query = usersClient.buildQueryString({ page, limit });
    const response = await usersClient.get(`/users/feed${query}`);
    return response.data;
  },

  // Get User Posts by Username
  getUserPostsByUsername: async (username: string, page = 1, limit = 20) => {
    const query = blogsClient.buildQueryString({ page, limit });
    const response = await blogsClient.get(`/blogs/posts/user/${username}${query}`);
    return response;
  },

  // Get My Posts
  getMyPosts: async (page = 1, limit = 20) => {
    const query = blogsClient.buildQueryString({ page, limit });
    const response = await blogsClient.get(`/blogs/posts/my-posts${query}`);
    return response;
  },

  // Track View
  trackView: async (postId: string) => {
    const response = await blogsClient.post(`/blogs/engagement/${postId}/view`);
    return response.data;
  },

  // Vote on Poll
  voteOnPoll: async (postId: string, optionId: string) => {
    const response = await blogsClient.post(`/blogs/engagement/${postId}/vote`, { optionId });
    return response.data;
  },

  // Like Post
  likePost: async (postId: string) => {
    const response = await blogsClient.post(`/blogs/engagement/${postId}/like`);
    return response.data;
  },

  // Unlike Post
  unlikePost: async (postId: string) => {
    const response = await blogsClient.delete(`/blogs/engagement/${postId}/like`);
    return response.data;
  },

  // Repost
  repost: async (postId: string, content?: string) => {
    const payload = content ? { content } : {};
    const response = await blogsClient.post(`/blogs/engagement/${postId}/repost`, payload);
    return response;
  },

  // Unrepost
  unrepost: async (postId: string) => {
    const response = await blogsClient.delete(`/blogs/engagement/${postId}/repost`);
    return response;
  },

  // Bookmark Post
  bookmarkPost: async (postId: string) => {
    const response = await blogsClient.post(`/blogs/engagement/${postId}/bookmark`);
    return response.data;
  },

  // Unbookmark Post
  unbookmarkPost: async (postId: string) => {
    const response = await blogsClient.delete(`/blogs/engagement/${postId}/bookmark`);
    return response.data;
  },

  // Add Comment
  addComment: async (data: CommentData) => {
    const response = await blogsClient.post(`/blogs/comments/${data.postId}`, {
      content: data.content,
      parentCommentId: data.parentId,
    });
    return response.data;
  },

  // Get Comments
  getComments: async (postId: string, page = 1, limit = 20) => {
    const query = blogsClient.buildQueryString({ page, limit });
    const response = await blogsClient.get(`/blogs/comments/${postId}${query}`);
    return response.data;
  },

  // Like Comment
  likeComment: async (commentId: string) => {
    const response = await blogsClient.post(`/blogs/comments/${commentId}/like`);
    return response.data;
  },

  // Delete Post
  deletePost: async (postId: string) => {
    const response = await blogsClient.delete(`/blogs/posts/${postId}`);
    return response.data;
  },

  // Update Post
  updatePost: async (postId: string, data: Partial<PostData>) => {
    const response = await blogsClient.patch(`/blogs/posts/${postId}`, data);
    return response.data;
  },

  // Search Users by username (GET /users/search?username=)
  searchUsersByUsername: async (username: string, page = 1, limit = 20) => {
    const query = usersClient.buildQueryString({ username, page, limit });
    const response = await usersClient.get(`/users/search${query}`);
    return response.data;
  },
};
