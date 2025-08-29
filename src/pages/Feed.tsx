import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { throttle } from '../utils/throttle';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { feedService } from '../services';
import { Post, FeedParams } from '../types/api';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from '../hooks/use-toast';
import { Search, RefreshCw, Plus, MessageCircle, Loader2 } from 'lucide-react';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import Sidebar from '../components/feed/Sidebar';

interface FeedState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const Feed: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [feedState, setFeedState] = useState<FeedState>({
    posts: [],
    loading: true,
    error: null,
    hasMore: true,
    page: 1,
  });

  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'trending'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const feedParams = useMemo(
    (): FeedParams => ({
      page: feedState.page,
      limit: 20,
      sort: sortBy,
    }),
    [feedState.page, sortBy]
  );

  const loadFeed = useCallback(
    async (reset = false) => {
      if (!isAuthenticated) return;

      try {
        setFeedState(prev => ({
          ...prev,
          loading: reset ? true : prev.loading,
          error: null,
        }));

        const params = reset ? { ...feedParams, page: 1 } : feedParams;
        const response = await feedService.getFeed(params);

        if (response.success && response.data) {
          const newPosts = Array.isArray(response.data) ? response.data : [];
          setFeedState(prev => ({
            ...prev,
            posts: reset ? newPosts : [...prev.posts, ...newPosts],
            loading: false,
            hasMore: newPosts.length === params.limit,
            page: reset ? 2 : prev.page + 1,
          }));
        } else {
          throw new Error(response.message || 'Failed to load feed');
        }
      } catch (error: any) {
        setFeedState(prev => ({
          ...prev,
          loading: false,
          error: error.message || 'Failed to load feed',
        }));

        toast({
          title: 'Error',
          description: error.message || 'Failed to load feed',
          variant: 'destructive',
        });
      }
    },
    [isAuthenticated, feedParams]
  );

  const refreshFeed = useCallback(async () => {
    setRefreshing(true);
    await loadFeed(true);
    setRefreshing(false);

    toast({
      title: 'Feed Refreshed',
      description: 'Your feed has been updated with the latest posts.',
    });
  }, [loadFeed]);

  const loadMore = useCallback(() => {
    if (!feedState.loading && feedState.hasMore) {
      loadFeed();
    }
  }, [feedState.loading, feedState.hasMore, loadFeed]);

  const handlePostInteraction = useCallback(
    async (
      postId: string,
      action: 'like' | 'unlike' | 'bookmark' | 'unbookmark' | 'repost' | 'unrepost',
      data?: any
    ) => {
      try {
        let response;

        switch (action) {
          case 'like':
            response = await feedService.likePost(postId);
            break;
          case 'unlike':
            response = await feedService.unlikePost(postId);
            break;
          case 'bookmark':
            response = await feedService.bookmarkPost(postId);
            break;
          case 'unbookmark':
            response = await feedService.unbookmarkPost(postId);
            break;
          case 'repost':
            response = await feedService.repostPost(postId, data);
            break;
          case 'unrepost':
            response = await feedService.unrepostPost(postId);
            break;
        }

        if (response?.success) {
          const updatePost = (post: any) => {
            if (post._id !== postId) return post;

            const updates = { ...post, ...response.data };

            if (action === 'like') updates.isLiked = true;
            else if (action === 'unlike') updates.isLiked = false;
            else if (action === 'bookmark') updates.isBookmarked = true;
            else if (action === 'unbookmark') updates.isBookmarked = false;
            else if (action === 'repost') updates.isReposted = true;
            else if (action === 'unrepost') updates.isReposted = false;

            return updates;
          };

          setFeedState(prev => ({
            ...prev,
            posts: prev.posts.map(updatePost),
          }));
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Action failed',
          variant: 'destructive',
        });
      }
    },
    []
  );

  const handlePostCreated = useCallback((newPost: Post) => {
    setFeedState(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts],
    }));
    setShowCreatePost(false);

    toast({
      title: 'Post Created',
      description: 'Your post has been published successfully.',
    });
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab as 'home' | 'explore' | 'trending');
    setFeedState(prev => ({
      ...prev,
      posts: [],
      page: 1,
      hasMore: true,
    }));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadFeed(true);
    }
  }, [isAuthenticated, activeTab, sortBy, loadFeed]);

  useEffect(() => {
    const throttledHandleScroll = throttle(() => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        feedState.hasMore &&
        !feedState.loading
      ) {
        loadMore();
      }
    }, 200);

    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [loadMore, feedState.hasMore, feedState.loading]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Welcome to EndlessChat</h2>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">Please sign in to access your feed</p>
            <Button asChild className="w-full">
              <Link to="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold gradient-text">Home</h1>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={sortBy === 'recent' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('recent')}
                    >
                      Recent
                    </Button>
                    <Button
                      variant={sortBy === 'trending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy('trending')}
                    >
                      Trending
                    </Button>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={refreshFeed} disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {showCreatePost && (
                <CreatePost
                  onPostCreated={handlePostCreated}
                  onCancel={() => setShowCreatePost(false)}
                />
              )}

              {!showCreatePost && (
                <Card
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setShowCreatePost(true)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {user?.firstName?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-muted-foreground">What's on your mind?</div>
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              )}

              <div className="space-y-4">
                {feedState.loading && feedState.posts.length === 0 ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="p-4 sm:p-6">
                        <div className="flex items-start space-x-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : feedState.error ? (
                  <Card className="p-6 text-center">
                    <p className="text-destructive mb-4">{feedState.error}</p>
                    <Button onClick={() => loadFeed(true)} variant="outline">
                      Try Again
                    </Button>
                  </Card>
                ) : feedState.posts.length === 0 ? (
                  <Card className="p-6 text-center">
                    <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      {activeTab === 'home'
                        ? 'Follow some users to see their posts in your feed'
                        : 'No posts found. Try a different filter or search term.'}
                    </p>
                    <Button onClick={() => setShowCreatePost(true)}>Create Your First Post</Button>
                  </Card>
                ) : (
                  <>
                    {feedState.posts.map(post => (
                      <PostCard
                        key={post._id}
                        post={post}
                        onLike={() =>
                          handlePostInteraction(post._id, post.isLiked ? 'unlike' : 'like')
                        }
                        onRepost={() =>
                          handlePostInteraction(post._id, post.isReposted ? 'unrepost' : 'repost')
                        }
                        onBookmark={() =>
                          handlePostInteraction(
                            post._id,
                            post.isBookmarked ? 'unbookmark' : 'bookmark'
                          )
                        }
                        className="hover:shadow-md transition-shadow"
                      />
                    ))}

                    {feedState.hasMore && (
                      <div className="text-center py-6">
                        {feedState.loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Loading more posts...</span>
                          </div>
                        ) : (
                          <Button onClick={loadMore} variant="outline">
                            Load More Posts
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="hidden min-[1024px]:block lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Sidebar />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
