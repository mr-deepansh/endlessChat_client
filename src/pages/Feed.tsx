import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import LeftSidebar from '../components/layout/LeftSidebar';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import FeedSidebar from '../components/feed/FeedSidebar';
import FeedUserSuggestions from '../components/user/FeedUserSuggestions';
import { useAuth } from '../contexts/AuthContext';
import { postService, userService } from '../services';
import { toast } from '../hooks/use-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, CardContent } from '../components/ui/card';

interface Post {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
    title?: string;
  };
  content: string;
  images?: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  comments?: Comment[];
}

const Feed: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  usePageTitle('Feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadPosts = async () => {
      try {
        const response = await userService.getUserFeed();
        if (response.posts) {
          setPosts(response.posts);
          return;
        }
      } catch (backendError) {
        console.warn('Backend feed failed:', backendError);
        setPosts([]);
      }
    };

    loadPosts();
    const interval = setInterval(loadPosts, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleCreatePost = async (postData: any) => {
    setLoading(true);
    try {
      const newPost = await postService.createPost({
        content: postData.content,
        files: postData.files,
      });

      const newPostData: Post = {
        _id: newPost._id,
        author: newPost.author,
        content: newPost.content,
        images: newPost.media?.map(m => m.url) || [],
        createdAt: newPost.createdAt,
        likesCount: newPost.likes?.length || 0,
        commentsCount: newPost.comments?.length || 0,
        repostsCount: newPost.reposts?.length || 0,
        sharesCount: 0,
        isLiked: newPost.isLiked || false,
        isBookmarked: false,
        isReposted: newPost.isReposted || false,
        comments: [],
      };

      setPosts([newPostData, ...posts]);
      toast({
        title: 'Post Created',
        description: 'Your post has been published successfully.',
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await postService.toggleLike(postId);
      setPosts(
        posts.map(p =>
          p._id === postId
            ? {
                ...p,
                isLiked: response.isLiked,
                likesCount: response.likesCount,
              }
            : p
        )
      );
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update like',
        variant: 'destructive',
      });
    }
  };

  const handleUserFollow = (userId: string) => {
    const loadPosts = async () => {
      try {
        const response = await userService.getUserFeed();
        if (response.posts) {
          setPosts(response.posts);
        }
      } catch (error) {
        console.warn('Failed to refresh feed after follow:', error);
      }
    };
    loadPosts();
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <LeftSidebar />
      <div className="ml-60 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <CreatePost
                  onSubmit={handleCreatePost}
                  placeholder="What's happening? 🚀 Share your thoughts!"
                />
              </div>

              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Creating post...</p>
                  </div>
                )}

                {showSuggestions && (
                  <FeedUserSuggestions
                    currentUserId={user?._id}
                    onUserFollow={handleUserFollow}
                    onDismiss={() => setShowSuggestions(false)}
                  />
                )}

                {posts.length === 0 && !loading ? (
                  <Card className="border-none shadow-soft bg-gradient-card">
                    <CardContent className="p-8 text-center">
                      <div className="space-y-4">
                        <div className="text-6xl">👋</div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            Welcome to your feed!
                          </h3>
                          <p className="text-muted-foreground">
                            Follow some users to see their posts here, or create your first post to
                            get started.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  posts
                    .filter(post => post && post.author)
                    .map((post, index) => (
                      <PostCard
                        key={post._id || `post-${index}`}
                        post={{
                          _id: post._id || `post-${index}`,
                          content: post.content || '',
                          author: {
                            _id: post.author?._id || '',
                            username: post.author?.username || 'unknown',
                            firstName: post.author?.firstName || 'Unknown',
                            lastName: post.author?.lastName || 'User',
                            avatar: post.author?.avatar,
                          },
                          createdAt: post.createdAt || new Date().toISOString(),
                          likesCount: post.likesCount || 0,
                          commentsCount: post.commentsCount || 0,
                          repostsCount: post.repostsCount || 0,
                          sharesCount: post.sharesCount || 0,
                          viewsCount: 0,
                          isLiked: post.isLiked || false,
                          isReposted: post.isReposted || false,
                          isBookmarked: post.isBookmarked || false,
                          images: post.images || [],
                          type: 'text',
                        }}
                        currentUserId={user?._id}
                        onLike={() => handleLike(post._id)}
                        onRepost={() => {}}
                        onShare={() => {}}
                        onEdit={() => {}}
                        onDelete={() => {}}
                      />
                    ))
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <FeedSidebar onUserFollow={handleUserFollow} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
