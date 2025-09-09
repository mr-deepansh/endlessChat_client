// Mock feed service for development when backend is not available
export interface MockPost {
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

export interface MockFeedResponse {
  posts: MockPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const mockPosts: MockPost[] = [
  {
    _id: '1',
    content:
      'Welcome to EndlessChat! 🚀 This is a demo post to show how the platform works. You can create posts, share media, and connect with others.',
    author: {
      _id: 'user1',
      username: 'demo_user',
      firstName: 'Demo',
      lastName: 'User',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    },
    likes: ['user2', 'user3'],
    comments: ['comment1', 'comment2'],
    reposts: ['user4'],
    views: 42,
    isLiked: false,
    isReposted: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '2',
    content:
      'Just finished building this amazing social media platform! The tech stack includes React, TypeScript, Node.js, and MongoDB. What do you think? 💻✨',
    author: {
      _id: 'user2',
      username: 'tech_enthusiast',
      firstName: 'Alex',
      lastName: 'Johnson',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    },
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
        publicId: 'code_screenshot',
      },
    ],
    likes: ['user1', 'user3', 'user5'],
    comments: ['comment3'],
    reposts: [],
    views: 89,
    isLiked: true,
    isReposted: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '3',
    content:
      'Beautiful sunset today! 🌅 Sometimes you just need to take a moment to appreciate the simple things in life. #grateful #nature',
    author: {
      _id: 'user3',
      username: 'nature_lover',
      firstName: 'Sarah',
      lastName: 'Wilson',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    },
    media: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        publicId: 'sunset_photo',
      },
    ],
    likes: ['user1', 'user2', 'user4', 'user6'],
    comments: ['comment4', 'comment5'],
    reposts: ['user7'],
    views: 156,
    isLiked: false,
    isReposted: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    content:
      "Working on some exciting new features for the platform! Can't wait to share them with you all. Stay tuned! 🎉",
    author: {
      _id: 'user4',
      username: 'platform_dev',
      firstName: 'Mike',
      lastName: 'Chen',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    },
    likes: ['user1', 'user3', 'user5', 'user8'],
    comments: ['comment6'],
    reposts: ['user9'],
    views: 73,
    isLiked: true,
    isReposted: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '5',
    content:
      "Just had an amazing coffee with a friend! ☕ Great conversations and even better company. What's your favorite coffee shop?",
    author: {
      _id: 'user5',
      username: 'coffee_addict',
      firstName: 'Emma',
      lastName: 'Davis',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    },
    likes: ['user2', 'user4', 'user6'],
    comments: ['comment7', 'comment8', 'comment9'],
    reposts: [],
    views: 45,
    isLiked: false,
    isReposted: false,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockFeedService = {
  async getFeed(page = 1, limit = 20, sort = 'recent'): Promise<MockFeedResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Sort posts based on sort parameter
    const sortedPosts = [...mockPosts];
    if (sort === 'recent') {
      sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'popular') {
      sortedPosts.sort(
        (a, b) =>
          b.likes.length +
          b.comments.length +
          b.reposts.length -
          (a.likes.length + a.comments.length + a.reposts.length)
      );
    }

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = sortedPosts.slice(startIndex, endIndex);

    return {
      posts: paginatedPosts,
      totalPosts: mockPosts.length,
      totalPages: Math.ceil(mockPosts.length / limit),
      currentPage: page,
      hasNextPage: endIndex < mockPosts.length,
      hasPrevPage: page > 1,
    };
  },

  async createPost(content: string, files?: FileList): Promise<MockPost> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newPost: MockPost = {
      _id: Date.now().toString(),
      content,
      author: {
        _id: 'current_user',
        username: 'current_user',
        firstName: 'Current',
        lastName: 'User',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      },
      likes: [],
      comments: [],
      reposts: [],
      views: 0,
      isLiked: false,
      isReposted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add media if files provided
    if (files && files.length > 0) {
      newPost.media = Array.from(files).map((file, index) => ({
        type: file.type.startsWith('video/') ? ('video' as const) : ('image' as const),
        url: URL.createObjectURL(file),
        publicId: `upload_${Date.now()}_${index}`,
      }));
    }

    // Add to mock posts
    mockPosts.unshift(newPost);

    return newPost;
  },

  async toggleLike(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const post = mockPosts.find(p => p._id === postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const currentUser = 'current_user';
    const isLiked = post.likes.includes(currentUser);

    if (isLiked) {
      post.likes = post.likes.filter(id => id !== currentUser);
    } else {
      post.likes.push(currentUser);
    }

    post.isLiked = !isLiked;

    return {
      isLiked: !isLiked,
      likesCount: post.likes.length,
    };
  },

  async repost(postId: string, content?: string): Promise<MockPost> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const originalPost = mockPosts.find(p => p._id === postId);
    if (!originalPost) {
      throw new Error('Post not found');
    }

    const repost: MockPost = {
      _id: Date.now().toString(),
      content: content || `Reposted: ${originalPost.content}`,
      author: {
        _id: 'current_user',
        username: 'current_user',
        firstName: 'Current',
        lastName: 'User',
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      },
      likes: [],
      comments: [],
      reposts: [],
      views: 0,
      isLiked: false,
      isReposted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock posts
    mockPosts.unshift(repost);

    // Update original post repost count
    originalPost.reposts.push('current_user');
    originalPost.isReposted = true;

    return repost;
  },
};
