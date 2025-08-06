import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import CreatePost from '@/components/posts/CreatePost';
import PostCard from '@/components/posts/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { TrendingUp, Users, Sparkles } from 'lucide-react';

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
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
  images?: string[];
}

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedType, setFeedType] = useState<'recent' | 'trending' | 'following'>('recent');

const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Mock data for demo purposes
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
      isLiked: false,
      isReposted: false,
      isBookmarked: false
    },
    {
      _id: '2',
      content: 'Beautiful sunset from my morning run! 🌅 Sometimes you need to step away from the code and enjoy nature.',
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
      isLiked: true,
      isReposted: false,
      isBookmarked: true
    },
    {
      _id: '3',
      content: 'Hot take: TypeScript is not just "JavaScript with types". It fundamentally changes how you think about code structure and API design. The type system teaches you to be more intentional with your interfaces.',
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
      isLiked: false,
      isReposted: true,
      isBookmarked: false
    }
  ];

  useEffect(() => {
    loadFeed();
  }, [feedType]);

  const loadFeed = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPosts(mockPosts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load feed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (content: string) => {
    if (!user) return;

    const newPost: Post = {
      _id: Date.now().toString(),
      content,
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
      isLiked: false,
      isReposted: false,
      isBookmarked: false
    };

    setPosts(prev => [newPost, ...prev]);
    toast({
      title: "Post created!",
      description: "Your post has been shared with the community.",
    });
  };

  const handleLike = async (postId: string) => {
    // Optimistic update handled in PostCard component
    toast({
      title: "Post liked!",
      description: "You liked this post.",
    });
  };

  const handleComment = (postId: string) => {
    toast({
      title: "Comments",
      description: "Comment feature coming soon!",
    });
  };

  const handleRepost = (postId: string) => {
    toast({
      title: "Reposted!",
      description: "Post shared to your timeline.",
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
    { type: 'recent' as const, label: 'Recent', icon: Sparkles },
    { type: 'trending' as const, label: 'Trending', icon: TrendingUp },
    { type: 'following' as const, label: 'Following', icon: Users },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Feed Type Selector */}
        <div className="flex items-center justify-center space-x-1 mb-6">
          {feedTypeButtons.map(({ type, label, icon: Icon }) => (
            <Button
              key={type}
              variant={feedType === type ? "default" : "ghost"}
              size="sm"
              onClick={() => setFeedType(type)}
              className="flex items-center space-x-2"
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Button>
          ))}
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