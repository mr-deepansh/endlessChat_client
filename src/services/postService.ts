import { api } from './api';

export const postService = {
  getUserPosts: async (userId?: string) => {
    try {
      const endpoint = userId ? `/posts/user/${userId}` : '/posts/my-posts';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      console.error('Posts API not available:', error);
      return {
        success: true,
        data: [
          {
            _id: 'demo-post-1',
            content: 'Welcome to EndlessChat! This is a demo post.',
            author: {
              _id: 'demo-user',
              username: 'demo_user',
              firstName: 'Demo',
              lastName: 'User',
              avatar:
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
            },
            createdAt: new Date().toISOString(),
            likesCount: 5,
            commentsCount: 2,
            repostsCount: 1,
            sharesCount: 0,
            isLiked: false,
            isBookmarked: false,
          },
        ],
      };
    }
  },

  createPost: async (postData: any) => {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error: any) {
      console.error('Create post failed:', error);
      return { success: false, message: 'Failed to create post' };
    }
  },

  likePost: async (postId: string) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      return response.data;
    } catch (error: any) {
      return { success: false, message: 'Failed to like post' };
    }
  },

  unlikePost: async (postId: string) => {
    try {
      const response = await api.delete(`/posts/${postId}/like`);
      return response.data;
    } catch (error: any) {
      return { success: false, message: 'Failed to unlike post' };
    }
  },
};
