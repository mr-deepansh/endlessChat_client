import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import CreatePost from '@/components/posts/CreatePost';
import PostCard from '@/components/posts/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { cacheService } from '@/services/core/cache';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { TrendingUp, Users, Sparkles, Flame, Clock, Globe, Eye } from 'lucide-react';

interface Post {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
  images?: string[];
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    endsAt: string;
  };
  location?: string;
  scheduledFor?: string;
  type?: 'text' | 'article' | 'poll' | 'media';
  repostOf?: Post;
  quotedPost?: Post;
}

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedType, setFeedType] = useState<'recent' | 'trending' | 'following' | 'hot'>('recent');

const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Enhanced mock data with new features
  const mockPosts: Post[] = [
    {
      _id: '1',
      content: 'Just launched my new project! Excited to share it with the community. Built with React, TypeScript, and lots of ☕. What do you think?',
      author: {
        _id: '2',
        username: 'johndev',
        firstName: 'John',
        lastName: 'Developer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likesCount: 42,
      commentsCount: 8,
      repostsCount: 12,
      sharesCount: 5,
      viewsCount: 1240,
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
      type: 'text',
      location: 'San Francisco, CA'
    },
    {
      _id: '2',
      content: 'Which framework do you prefer for building modern web apps?',
      author: {
        _id: '3',
        username: 'sarahdesign',
        firstName: 'Sarah',
        lastName: 'Designer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c8e8?w=400&h=400&fit=crop&crop=face'
      },
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likesCount: 128,
      commentsCount: 23,
      repostsCount: 45,
      sharesCount: 18,
      viewsCount: 3420,
      isLiked: true,
      isReposted: false,
      isBookmarked: true,
      type: 'poll',
      poll: {
        question: 'Which framework do you prefer for building modern web apps?',
        options: [
          { text: 'React', votes: 45 },
          { text: 'Vue.js', votes: 23 },
          { text: 'Angular', votes: 12 },
          { text: 'Svelte', votes: 8 }
        ],
        totalVotes: 88,
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      _id: '3',
      content: 'Hot take: TypeScript is not just "JavaScript with types". It fundamentally changes how you think about code structure and API design.',
      author: {
        _id: '4',
        username: 'mikecoding',
        firstName: 'Mike',
        lastName: 'Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
      },
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      likesCount: 89,
      commentsCount: 34,
      repostsCount: 67,
      sharesCount: 23,
      viewsCount: 2150,
      isLiked: false,
      isReposted: true,
      isBookmarked: false,
      type: 'article',
      quotedPost: {
        _id: '4',
        content: 'JavaScript is the future of web development',
        author: {
          _id: '5',
          username: 'webdev',
          firstName: 'Web',
          lastName: 'Developer',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face'
        },
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        likesCount: 15,
        commentsCount: 3,
        repostsCount: 2,
        sharesCount: 1,
        viewsCount: 450,
        type: 'text'
      }
    },
    {
      _id: '5',
      content: 'Beautiful sunset from my morning run! 🌅',
      author: {
        _id: '6',
        username: 'naturelover',
        firstName: 'Nature',
        lastName: 'Lover',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
      },
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      likesCount: 234,
      commentsCount: 45,
      repostsCount: 78,
      sharesCount: 32,
      viewsCount: 5670,
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
      type: 'media',
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
      location: 'Golden Gate Park, SF'
    }
  ];

  useEffect(() => {
    loadFeed();
  }, [feedType]);

  const loadFeed = async () => {
    setIsLoading(true);
    try {
      // Try to load from API first, fallback to mock data
      try {
        const feedData = await userService.getUserFeed({
          sort: feedType,
          limit: 20,
          page: 1
        });
        setPosts(feedData.length > 0 ? feedData : mockPosts);
      } catch (apiError) {
        console.warn('API feed failed, using mock data:', apiError);
        setPosts(mockPosts);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load feed. Please try again.",
        variant: "destructive",
      });
      setPosts(mockPosts); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (postData: any) => {
    if (!user) return;

    const newPost: Post = {
      _id: Date.now().toString(),
      content: postData.content,
      author: {
        _id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      },
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      repostsCount: 0,
      sharesCount: 0,
      viewsCount: 0,
      isLiked: false,
      isReposted: false,
      isBookmarked: false,
      type: postData.type || 'text',
      images: postData.images,
      poll: postData.poll,
      location: postData.location,
      scheduledFor: postData.scheduledFor
    };

    // Optimistic update
    setPosts(prev => [newPost, ...prev]);
    
    // Invalidate feed cache
    cacheService.invalidateByTag('feed');
    cacheService.invalidateByTag('posts');
    
    toast({
      title: "Post created!",
      description: postData.scheduledFor ? "Your post has been scheduled." : "Your post has been shared with the community.",
    });
  };

  const handleLike = async (postId: string) => {
    // Optimistic update
    setPosts(prev => prev.map(post => {
      if (post._id === postId) {
        const isLiked = !post.isLiked;
        return {
          ...post,
          isLiked,
          likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1
        };
      }
      return post;
    }));

    toast({
      title: posts.find(p => p._id === postId)?.isLiked ? "Post unliked!" : "Post liked!",
      description: posts.find(p => p._id === postId)?.isLiked ? "You unliked this post." : "You liked this post.",
    });
  };

  const handleComment = (postId: string) => {
    // Increment view count when opening comments
    setPosts(prev => prev.map(post => 
      post._id === postId 
        ? { ...post, viewsCount: post.viewsCount + 1 }
        : post
    ));
    
    toast({
      title: "Comments",
      description: "Opening comments section...",
    });
  };

  const handleRepost = (postId: string, withQuote?: boolean, quoteText?: string) => {
    if (withQuote && quoteText) {
      // Handle quote repost
      const originalPost = posts.find(p => p._id === postId);
      if (originalPost && user) {
        const quotePost: Post = {
          _id: Date.now().toString(),
          content: quoteText,
          author: {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.avatar
          },
          createdAt: new Date().toISOString(),
          likesCount: 0,
          commentsCount: 0,
          repostsCount: 0,
          sharesCount: 0,
          viewsCount: 1,
          isLiked: false,
          isReposted: false,
          isBookmarked: false,
          type: 'text',
          quotedPost: originalPost
        };
        setPosts(prev => [quotePost, ...prev]);
        
        // Update original post repost count
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { ...post, repostsCount: post.repostsCount + 1 }
            : post
        ));
      }
      toast({
        title: "Quote posted!",
        description: "Your quote post has been shared.",
      });
    } else {
      // Simple repost - update counts
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          const isReposted = !post.isReposted;
          return {
            ...post,
            isReposted,
            repostsCount: isReposted ? post.repostsCount + 1 : post.repostsCount - 1
          };
        }
        return post;
      }));
      
      toast({
        title: posts.find(p => p._id === postId)?.isReposted ? "Unreposted!" : "Reposted!",
        description: posts.find(p => p._id === postId)?.isReposted ? "Removed from your timeline." : "Post shared to your timeline.",
      });
    }
  };

  const handleShare = (postId: string) => {
    // Update share count and view count
    setPosts(prev => prev.map(post => 
      post._id === postId 
        ? { 
            ...post, 
            sharesCount: post.sharesCount + 1,
            viewsCount: post.viewsCount + 1
          }
        : post
    ));
    
    // Copy link to clipboard
    const postUrl = `${window.location.origin}/post/${postId}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Post link has been copied to clipboard.",
      });
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = postUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Link copied!",
        description: "Post link has been copied to clipboard.",
      });
    });
  };

  const handleDelete = (postId: string) => {
    setPosts(prev => prev.filter(post => post._id !== postId));
    toast({
      title: "Post deleted",
      description: "Your post has been removed.",
    });
  };

  const feedTypeButtons = [
    { type: 'recent' as const, label: 'Recent', icon: Clock },
    { type: 'hot' as const, label: 'Hot', icon: Flame },
    { type: 'trending' as const, label: 'Trending', icon: TrendingUp },
    { type: 'following' as const, label: 'Following', icon: Users },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Enhanced Feed Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Globe className="w-6 h-6" />
              Feed
            </h1>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {posts.length} posts
            </div>
          </div>
          
          {/* Feed Type Selector */}
          <div className="flex items-center justify-center space-x-1 p-1 bg-muted/30 rounded-lg backdrop-blur-sm">
            {feedTypeButtons.map(({ type, label, icon: Icon }) => (
              <Button
                key={type}
                variant={feedType === type ? "default" : "ghost"}
                size="sm"
                onClick={() => setFeedType(type)}
                className={`flex items-center space-x-2 transition-all duration-200 ${
                  feedType === type 
                    ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-lg' 
                    : 'hover:bg-background/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Create Post */}
        {user && (
          <div className="mb-6">
            <CreatePost onSubmit={handleCreatePost} />
          </div>
        )}

        <Separator className="mb-6" />

        {/* Posts Feed */}
        <div className="space-y-6">
          {isLoading ? (
            // Loading Skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-4 p-6 rounded-lg border bg-card">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-[60px]" />
                  <Skeleton className="h-8 w-[60px]" />
                  <Skeleton className="h-8 w-[60px]" />
                  <Skeleton className="h-8 w-[40px]" />
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share something with the community!
              </p>
              {user && (
                <Button variant="gradient" size="lg">
                  Create your first post
                </Button>
              )}
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?._id}
                onLike={handleLike}
                onComment={handleComment}
                onRepost={handleRepost}
                onShare={handleShare}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Feed;