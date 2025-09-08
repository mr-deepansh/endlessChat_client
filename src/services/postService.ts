import { apiClient } from './core/apiClient';

export interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  media?: Array<{
    type: 'image' | 'video';
    url: string;
    publicId: string;
  }>;
  likes: string[];
  comments: string[];
  reposts: string[];
  views: number;
  isLiked?: boolean;
  isReposted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  content: string;
  files?: File[] | FileList;
}

export interface PostsResponse {
  posts: Post[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

class PostService {
  // Get all posts (feed)
  async getPosts(page = 1, limit = 10): Promise<PostsResponse> {
    const response = await apiClient.get(`/blogs/posts?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Get post by ID
  async getPostById(id: string): Promise<Post> {
    const response = await apiClient.get(`/blogs/posts/${id}`);
    return response.data;
  }

  // Create new post
  async createPost(data: CreatePostData): Promise<Post> {
    const formData = new FormData();
    formData.append('content', data.content);

    if (data.files && data.files.length > 0) {
      Array.from(data.files).forEach(file => {
        formData.append('files', file);
      });
    }

    const response = await apiClient.post('/blogs/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update post
  async updatePost(
    id: string,
    data: { content?: string; title?: string; status?: string }
  ): Promise<Post> {
    const response = await apiClient.patch(`/blogs/posts/${id}`, data);
    return response.data;
  }

  // Delete post
  async deletePost(id: string): Promise<void> {
    console.log('PostService: Deleting post', id);
    const response = await apiClient.delete(`/blogs/posts/${id}`);
    console.log('PostService: Delete response', response);
    return response;
  }

  // Edit post content
  async editPost(id: string, content: string): Promise<Post> {
    const response = await apiClient.patch(`/blogs/posts/${id}`, { content });
    return response.data;
  }

  // Bookmark post
  async bookmarkPost(postId: string): Promise<{ isBookmarked: boolean }> {
    const response = await apiClient.post(`/blogs/engagement/${postId}/bookmark`);
    return response.data;
  }

  // Get my posts
  async getMyPosts(page = 1, limit = 10): Promise<PostsResponse> {
    const response = await apiClient.get(`/blogs/posts/my-posts?page=${page}&limit=${limit}`);
    return response.data;
  }

  // Get user posts by username
  async getUserPosts(username: string, page = 1, limit = 10): Promise<PostsResponse> {
    const response = await apiClient.get(
      `/blogs/posts/user/${username}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  // Like/Unlike post
  async toggleLike(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const response = await apiClient.post(`/blogs/engagement/${postId}/like`);
    return response.data;
  }

  // Track post view
  async trackView(postId: string): Promise<void> {
    await apiClient.post(`/blogs/engagement/${postId}/view`);
  }

  // Repost
  async repost(postId: string, content?: string): Promise<Post> {
    const response = await apiClient.post(`/blogs/engagement/${postId}/repost`, { content });
    return response.data;
  }
}

export default new PostService();
