import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import LeftSidebar from '../../components/layout/LeftSidebar';
import CreatePost from '../../components/posts/CreatePost';
import PostCard from '../../components/posts/PostCard';
import FeedSidebar from '../../components/feed/FeedSidebar';
import FeedUserSuggestions from '../../components/user/FeedUserSuggestions';
import { useAuth } from '../../contexts/AuthContext';
import { postService, userService } from '../../services';
import { toast } from '../../hooks/use-toast';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Card, CardContent } from '../../components/ui/card';

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
        console.log('Feed response:', response);
        setPosts(response.posts || []);
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
        setPosts(response.posts || []);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <LeftSidebar />
      <div className="ml-56 sm:ml-60 lg:ml-64 xl:ml-72 2xl:ml-80 transition-all duration-300">
        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 py-3 sm:py-4 lg:py-6 xl:py-8 2xl:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
            <div className="lg:col-span-2 xl:col-span-3 2xl:col-span-4">
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <CreatePost
                  onSubmit={handleCreatePost}
                  placeholder="What's happening? 🚀 Share your thoughts!"
                />
              </div>

              <div className="space-y-3 sm:space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-10">
                {loading && (
                  <div className="text-center py-6 sm:py-8 lg:py-12">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base lg:text-lg">Creating post...</p>
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
                    <CardContent className="p-6 sm:p-8 lg:p-10 xl:p-12 2xl:p-16 text-center">
                      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <div className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">👋</div>
                        <div>
                          <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-foreground mb-2">
                            Welcome to your feed!
                          </h3>
                          <p className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-muted-foreground">
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
              <div className="sticky top-16 sm:top-20 lg:top-24 xl:top-28 2xl:top-32">
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
