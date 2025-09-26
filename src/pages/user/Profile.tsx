import { Calendar, Filter, Grid3X3, Link as LinkIcon, List, MapPin, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FollowButton } from '../../components/common/FollowButton';
import LeftSidebar from '../../components/layout/LeftSidebar';
import Navbar from '../../components/layout/Navbar';
import PostCard from '../../components/posts/PostCard';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';
import { postService, userService } from '../../services';
import { followService } from '../../services/followService';
import type { Post } from '../../services/postService';
import type { User } from '../../services/userService';

const Profile = () => {
  const { userId, username } = useParams<{ userId?: string; username?: string }>();
  const location = useLocation();
  const { user: currentUser, refreshUserAfterFollow } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [postFilter, setPostFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  // Get identifier from either /profile/:userId or /u/:username route
  const identifier = userId || username || '';
  const isUsernameRoute = !!username;

  // Utility to show username or userId in error
  const cleanUsername = username || userId || 'unknown';

  useEffect(() => {
    const fetchUserData = async () => {
      if (!identifier) return;

      try {
        setLoading(true);
        // cleanUsername is now defined at component level

        // Check if this is the current user's profile
        const isCurrentUser =
          currentUser &&
          ((isUsernameRoute && currentUser.username === identifier) ||
            (!isUsernameRoute &&
              (currentUser._id === identifier || currentUser.id === identifier)));

        if (isCurrentUser) {
          setUser(currentUser);
          setIsFollowing(false);

          // Fetch current user's posts
          try {
            const userPosts = await postService.getMyPosts();
            const postsData = userPosts.posts || [];
            setPosts(postsData);
            setFilteredPosts(postsData);
          } catch (error) {
            console.warn('User posts API not available:', error);
            setPosts([]);
            setFilteredPosts([]);
          }
        } else {
          // Find other user by ID or username
          try {
            let foundUser;
            if (isUsernameRoute) {
              // Search by username
              const usersResponse = await userService.searchUsers(identifier, 1, 10);
              foundUser = usersResponse.users?.find(u => u.username === identifier);
            } else {
              // Get by ID
              foundUser = await userService.getUserById(identifier);
            }

            if (foundUser) {
              setUser(foundUser);

              // Check follow status using the new endpoint
              try {
                const followStatus = await followService.checkFollowStatus(
                  foundUser._id || foundUser.id
                );
                setIsFollowing(followStatus.data?.isFollowing || false);
              } catch (error) {
                console.warn('Failed to check follow status:', error);
                // Fallback to user data or default to false
                setIsFollowing(foundUser.isFollowing || false);
              }

              // Fetch user posts
              try {
                const userPosts = await postService.getUserPosts(foundUser.username);
                const postsData = userPosts.posts || [];
                setPosts(postsData);
                setFilteredPosts(postsData);
              } catch (error) {
                console.warn('User posts API not available:', error);
                setPosts([]);
                setFilteredPosts([]);
              }
            } else {
              setUser(null);
            }
          } catch (userError) {
            console.error('Failed to fetch user:', userError);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [identifier, currentUser, isUsernameRoute]);

  // Filter posts based on selected filter
  useEffect(() => {
    let filtered = posts;

    switch (postFilter) {
      case 'text':
        filtered = posts.filter(post => post.type === 'text' || !post.type);
        break;
      case 'media':
        filtered = posts.filter(post => post.type === 'media' || post.images?.length);
        break;
      case 'poll':
        filtered = posts.filter(post => post.type === 'poll' || post.poll);
        break;
      case 'article':
        filtered = posts.filter(post => post.type === 'article');
        break;
      default:
        filtered = posts;
    }

    setFilteredPosts(filtered);
  }, [posts, postFilter]);

  const { execute: executeFollow } = useApi({
    showSuccessToast: true,
    successMessage: 'Follow status updated successfully',
  });

  const handleFollow = async () => {
    if (!user) return;

    try {
      const userId = user.id || user._id;
      const response = await followService.followUser(userId);

      if (response.success) {
        const newIsFollowing = response.data?.isFollowing ?? !isFollowing;
        setIsFollowing(newIsFollowing);

        // Update the target user's follower count
        setUser(prev =>
          prev
            ? {
                ...prev,
                followersCount: response.data?.followersCount || prev.followersCount,
              }
            : null
        );

        // Refresh current user data to get updated following count
        await refreshUserAfterFollow();
      }
    } catch (error: any) {
      console.error('Follow action failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4">
          <div className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg mb-4"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <p className="text-muted-foreground">The user {cleanUsername} does not exist.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile =
    user &&
    currentUser &&
    ((currentUser.id && user.id && currentUser.id === user.id) ||
      (currentUser._id && user._id && currentUser._id === user._id) ||
      (currentUser.id && user._id && currentUser.id === user._id) ||
      (currentUser._id && user.id && currentUser._id === user.id));

  // Debug logging to help identify the issue
  console.log('Profile Debug:', {
    routeType: isUsernameRoute ? 'username' : 'userId',
    identifier,
    currentUserId: currentUser?.id || currentUser?._id,
    currentUserUsername: currentUser?.username,
    profileUserId: user?.id || user?._id,
    profileUsername: user?.username,
    isOwnProfile,
    isFollowing,
    userIsFollowing: user?.isFollowing,
    comparisons: {
      'currentUser.id === user.id': currentUser?.id === user?.id,
      'currentUser._id === user._id': currentUser?._id === user?._id,
      'currentUser.id === user._id': currentUser?.id === user?._id,
      'currentUser._id === user.id': currentUser?._id === user?.id,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LeftSidebar />
      <div className="ml-60 transition-all duration-300">
        <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8 2xl:p-10">
          {/* Profile Header */}
          <Card className="mb-4 sm:mb-6 xl:mb-8 2xl:mb-10">
            <CardContent className="p-4 sm:p-6 xl:p-8 2xl:p-10">
              <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 sm:gap-6">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 xl:h-40 xl:w-40 2xl:h-48 2xl:w-48 ring-4 ring-primary/20">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="bg-gradient-primary text-white text-lg sm:text-2xl">
                    {user.firstName?.[0] || user.username?.[0] || 'U'}
                    {user.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col items-center sm:items-start sm:flex-row sm:justify-between mb-3 sm:mb-4">
                    <div>
                      <h1 className="text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold">
                        {user.firstName} {user.lastName}
                      </h1>
                      <p className="text-muted-foreground text-sm sm:text-base">@{user.username}</p>
                    </div>

                    <div className="flex gap-2 mt-3 sm:mt-0">
                      {isOwnProfile ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/settings">
                            <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="text-xs sm:text-sm">Edit Profile</span>
                          </Link>
                        </Button>
                      ) : (
                        <FollowButton
                          userId={user.id || user._id}
                          isFollowing={isFollowing}
                          onFollowChange={async (newIsFollowing, newFollowersCount) => {
                            setIsFollowing(newIsFollowing);
                            if (newFollowersCount !== undefined) {
                              setUser(prev =>
                                prev ? { ...prev, followersCount: newFollowersCount } : null
                              );
                            }
                            // Refresh current user data
                            await refreshUserAfterFollow();
                          }}
                          size="sm"
                        />
                      )}
                    </div>
                  </div>

                  {user.bio && (
                    <p className="text-foreground mb-3 sm:mb-4 text-sm sm:text-base">{user.bio}</p>
                  )}

                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">{user.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">
                        Joined{' '}
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {user.website && (
                    <div className="flex items-center justify-center sm:justify-start gap-1 text-xs sm:text-sm mb-3 sm:mb-4">
                      <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs sm:text-sm"
                      >
                        {user.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 xl:gap-6 2xl:gap-8 mt-4 sm:mt-6 xl:mt-8 2xl:mt-10 pt-4 sm:pt-6 xl:pt-8 2xl:pt-10 border-t">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-primary">
                    {posts.length || user.postsCount || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-blue-500">
                    {user.followersCount || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-green-500">
                    {user.followingCount || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-purple-500">
                    {posts.reduce((sum, post) => sum + (post.likesCount || 0), 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Likes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-4 w-auto">
                <TabsTrigger value="posts" className="text-xs sm:text-sm">
                  Posts ({posts.length})
                </TabsTrigger>
                <TabsTrigger value="reposts" className="text-xs sm:text-sm">
                  Reposts
                </TabsTrigger>
                <TabsTrigger value="likes" className="text-xs sm:text-sm">
                  Likes
                </TabsTrigger>
                <TabsTrigger value="media" className="text-xs sm:text-sm">
                  Media
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Select value={postFilter} onValueChange={setPostFilter}>
                  <SelectTrigger className="w-32">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Posts</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="poll">Polls</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-r-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-l-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value="posts" className="mt-4 sm:mt-6">
              <div
                className={
                  viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'
                }
              >
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <PostCard
                      key={post._id || `post-${index}`}
                      post={{
                        _id: post._id || `post-${index}`,
                        content: post.content || '',
                        author: {
                          _id: post.author?._id || post.author?.id || user._id || user.id,
                          id: post.author?.id || post.author?._id || user.id || user._id,
                          username: post.author?.username || user.username,
                          firstName: post.author?.firstName || user.firstName,
                          lastName: post.author?.lastName || user.lastName,
                          avatar: post.author?.avatar || user.avatar,
                        },
                        createdAt: post.createdAt || new Date().toISOString(),
                        likesCount: post.engagement?.likes || post.likesCount || 0,
                        commentsCount: post.engagement?.comments || post.commentsCount || 0,
                        repostsCount: post.engagement?.shares || post.repostsCount || 0,
                        sharesCount: post.engagement?.shares || post.sharesCount || 0,
                        viewsCount: post.engagement?.views || post.viewsCount || 0,
                        isLiked: post.isLiked || false,
                        isReposted: post.isReposted || false,
                        isBookmarked: post.isBookmarked || false,
                        images: post.images || [],
                        poll: post.poll,
                        location: post.location,
                        type: post.type || 'text',
                      }}
                      currentUserId={currentUser?.id || currentUser?._id}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 col-span-full">
                    <p className="text-muted-foreground">No posts found</p>
                    {postFilter !== 'all' && (
                      <Button variant="ghost" onClick={() => setPostFilter('all')} className="mt-2">
                        Clear filter
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reposts" className="mt-4 sm:mt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">No reposts yet</p>
              </div>
            </TabsContent>

            <TabsContent value="likes" className="mt-4 sm:mt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">No liked posts yet</p>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-4 sm:mt-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {posts
                  .filter(post => post.images?.length || post.type === 'media')
                  .map((post, index) => (
                    <div
                      key={post._id || `media-${index}`}
                      className="aspect-square bg-muted rounded-lg overflow-hidden"
                    >
                      {post.images?.[0] ? (
                        <img
                          src={post.images[0]}
                          alt="Post media"
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Media
                        </div>
                      )}
                    </div>
                  ))}
                {posts.filter(post => post.images?.length || post.type === 'media').length ===
                  0 && (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No media posts yet</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
