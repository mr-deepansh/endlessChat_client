import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { feedService, notificationService } from '../services';
import { Post, FeedParams } from '../types/api';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from '../hooks/use-toast';
import { Search, TrendingUp, Users, Globe, Filter, RefreshCw, Plus } from 'lucide-react';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import Sidebar from '../components/feed/Sidebar';

// Enterprise-grade interfaces
interface FeedState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

interface PostInteractionPayload {
  postId: string;
  action: 'like' | 'unlike' | 'bookmark' | 'unbookmark' | 'repost' | 'unrepost';
  data?: Record<string, unknown>;
}

type TabType = 'home' | 'explore' | 'trending';
type SortType = 'recent' | 'popular' | 'trending';

// Performance constants
const POSTS_PER_PAGE = 15;
const SEARCH_DEBOUNCE_MS = 300;
const SCROLL_THRESHOLD = 800;

const Feed: React.FC = memo(() => {
  const { user, isAuthenticated } = useAuth();

  // Core state with proper typing
  const [feedState, setFeedState] = useState<FeedState>({
    posts: [],
    loading: true,
    error: null,
    hasMore: true,
    page: 1,
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Performance refs
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollThrottleRef = useRef<boolean>(false);

  // Memoized feed parameters for performance
  const feedParams = useMemo(
    (): FeedParams => ({
      page: feedState.page,
      limit: POSTS_PER_PAGE,
      sort: sortBy,
    }),
    [feedState.page, sortBy]
  );

  // Optimized feed loading with error boundaries
  const loadFeed = useCallback(
    async (reset = false): Promise<void> => {
      if (!isAuthenticated || (feedState.loading && !reset)) return;

      try {
        setFeedState(prev => ({
          ...prev,
          loading: reset ? true : prev.loading,
          error: null,
          ...(reset && { posts: [], page: 1, hasMore: true }),
        }));

        const params = reset ? { ...feedParams, page: 1 } : feedParams;
        let response;

        switch (activeTab) {
          case 'home':
            response = await feedService.getFeed(params);
            break;
          case 'explore':
            response = await feedService.getExploreFeed(params);
            break;
          case 'trending':
            response = await feedService.getTrendingPosts({
              ...params,
              timeframe: '24h',
            });
            break;
          default:
            throw new Error(`Invalid tab: ${activeTab}`);
        }

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
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load feed';

        setFeedState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        toast({
          title: 'Feed Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
    [isAuthenticated, activeTab, feedParams, feedState.loading]
  );

  // Optimized search with proper debouncing
  const searchPosts = useCallback(async (): Promise<void> => {
    if (!searchQuery.trim()) {
      loadFeed(true);
      return;
    }

    try {
      setFeedState(prev => ({ ...prev, loading: true, error: null }));

      const response = await feedService.searchPosts({
        query: searchQuery.trim(),
        page: 1,
        limit: 20,
        sortBy: 'relevance',
      });

      if (response.success && response.data) {
        const posts = Array.isArray(response.data) ? response.data : [];

        setFeedState(prev => ({
          ...prev,
          posts,
          loading: false,
          hasMore: false,
          page: 1,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';

      setFeedState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      toast({
        title: 'Search Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [searchQuery, loadFeed]);

  // Optimized refresh with proper feedback
  const refreshFeed = useCallback(async (): Promise<void> => {
    setRefreshing(true);
    try {
      await loadFeed(true);
      toast({
        title: 'Feed Refreshed',
        description: 'Your feed has been updated with the latest posts.',
      });
    } finally {
      setRefreshing(false);
    }
  }, [loadFeed]);

  // Throttled load more for performance
  const loadMore = useCallback((): void => {
    if (!feedState.loading && feedState.hasMore) {
      loadFeed();
    }
  }, [feedState.loading, feedState.hasMore, loadFeed]);

  // Optimized post interactions with proper error handling
  const handlePostInteraction = useCallback(
    async (postId: string, action: string, data?: Record<string, unknown>): Promise<void> => {
      const validActions = ['like', 'unlike', 'bookmark', 'unbookmark', 'repost', 'unrepost'];

      if (!validActions.includes(action)) {
        toast({
          title: 'Invalid Action',
          description: `Action "${action}" is not supported`,
          variant: 'destructive',
        });
        return;
      }

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
          // Optimistic UI update
          setFeedState(prev => ({
            ...prev,
            posts: prev.posts.map(post => {
              if (post._id !== postId) return post;

              const updates: Partial<Post> = {};

              switch (action) {
                case 'like':
                  updates.isLiked = true;
                  updates.likesCount = (post.likesCount || 0) + 1;
                  break;
                case 'unlike':
                  updates.isLiked = false;
                  updates.likesCount = Math.max(0, (post.likesCount || 0) - 1);
                  break;
                case 'bookmark':
                  updates.isBookmarked = true;
                  break;
                case 'unbookmark':
                  updates.isBookmarked = false;
                  break;
                case 'repost':
                  updates.isReposted = true;
                  updates.repostsCount = (post.repostsCount || 0) + 1;
                  break;
                case 'unrepost':
                  updates.isReposted = false;
                  updates.repostsCount = Math.max(0, (post.repostsCount || 0) - 1);
                  break;
              }

              return { ...post, ...updates };
            }),
          }));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Action failed';

        toast({
          title: 'Interaction Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    },
    []
  );

  // Optimized post creation handler
  const handlePostCreated = useCallback((newPost: Post): void => {
    setFeedState(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts],
    }));
    setShowCreatePost(false);

    toast({
      title: 'Post Published',
      description: 'Your post has been published successfully.',
    });
  }, []);

  // Validated tab change handler
  const handleTabChange = useCallback((tab: string): void => {
    const validTabs: TabType[] = ['home', 'explore', 'trending'];
    const newTab = tab as TabType;

    if (!validTabs.includes(newTab)) {
      console.error(`Invalid tab: ${tab}`);
      return;
    }

    setActiveTab(newTab);
    setSearchQuery('');
    setFeedState(prev => ({
      ...prev,
      posts: [],
      page: 1,
      hasMore: true,
      error: null,
    }));
  }, []);

  // Initialize feed on auth/tab/sort changes
  useEffect(() => {
    if (isAuthenticated) {
      loadFeed(true);
    }
  }, [isAuthenticated, activeTab, sortBy]);

  // Optimized search debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim()) {
        searchPosts();
      } else if (searchQuery === '') {
        loadFeed(true);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchPosts, loadFeed]);

  // Performance-optimized infinite scroll
  useEffect(() => {
    const handleScroll = (): void => {
      if (!scrollThrottleRef.current) {
        requestAnimationFrame(() => {
          const { innerHeight } = window;
          const { scrollTop, offsetHeight } = document.documentElement;

          if (innerHeight + scrollTop >= offsetHeight - SCROLL_THRESHOLD) {
            loadMore();
          }

          scrollThrottleRef.current = false;
        });
        scrollThrottleRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // Early return for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">Welcome to EndlessChat</h2>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              Please log in to view your feed and connect with others.
            </p>
            <Button className="w-full" onClick={() => (window.location.href = '/login')}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Feed</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={refreshFeed} disabled={refreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button onClick={() => setShowCreatePost(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts, users, hashtags..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="home" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Home
                  </TabsTrigger>
                  <TabsTrigger value="explore" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Explore
                  </TabsTrigger>
                  <TabsTrigger value="trending" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                  </TabsTrigger>
                </TabsList>

                {/* Sort Options */}
                <div className="flex items-center gap-2 mt-4">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <div className="flex gap-2">
                    {(['recent', 'popular', 'trending'] as const).map(sort => (
                      <Badge
                        key={sort}
                        variant={sortBy === sort ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => setSortBy(sort)}
                      >
                        {sort.charAt(0).toUpperCase() + sort.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Tabs>
            </div>

            {/* Create Post Modal */}
            {showCreatePost && (
              <CreatePost
                onClose={() => setShowCreatePost(false)}
                onPostCreated={handlePostCreated}
              />
            )}

            {/* Feed Content */}
            <div className="space-y-6">
              {/* Error State */}
              {feedState.error && (
                <Card className="border-destructive">
                  <CardContent className="pt-6">
                    <p className="text-destructive text-center">{feedState.error}</p>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => loadFeed(true)}
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Posts */}
              {feedState.posts.map(post => (
                <PostCard key={post._id} post={post} onInteraction={handlePostInteraction} />
              ))}

              {/* Loading Skeletons */}
              {feedState.loading && (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={`skeleton-${i}`}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <Skeleton className="h-48 w-full rounded-lg" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!feedState.loading && feedState.posts.length === 0 && !feedState.error && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="py-12">
                      <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery
                          ? `No posts match "${searchQuery}"`
                          : activeTab === 'home'
                            ? 'Follow some users to see their posts here'
                            : 'No posts available right now'}
                      </p>
                      {activeTab === 'home' && (
                        <Button variant="outline" onClick={() => setActiveTab('explore')}>
                          Explore Posts
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Load More */}
              {feedState.hasMore && !feedState.loading && feedState.posts.length > 0 && (
                <div className="text-center">
                  <Button variant="outline" onClick={loadMore}>
                    Load More Posts
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
});

Feed.displayName = 'Feed';

export default Feed;
