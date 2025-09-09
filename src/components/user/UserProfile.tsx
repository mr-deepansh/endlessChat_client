import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  Users,
  UserCheck,
  Settings,
  MessageCircle,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import userService, { User, UserProfile as UserProfileType } from '../../services/userService';
import { followService } from '../../services/followService';
import { postService } from '../../services';
import { toast } from '../../hooks/use-toast';
import { useAuth } from '../../contexts/AuthContext';
import PostCard from '../posts/PostCard';

interface UserProfileProps {
  username?: string;
  userId?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ username, userId }) => {
  const { user: currentUser } = useAuth();
  const params = useParams();
  const profileId = userId || params.userId;
  const profileUsername = username || params.username;

  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = currentUser?._id === profile?.user._id;

  useEffect(() => {
    if (profileUsername) {
      loadUserProfile();
    } else if (profileId) {
      loadUserById();
    }
  }, [profileUsername, profileId]);

  useEffect(() => {
    if (profile && activeTab === 'posts') {
      loadUserPosts();
    }
  }, [profile, activeTab]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserProfile(profileUsername!);
      setProfile(data);
      setIsFollowing(data.user.isFollowing || false);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserById = async () => {
    try {
      setLoading(true);
      const userData = await userService.getUserById(profileId!);
      setProfile({
        user: userData,
        stats: {
          postsCount: userData.postsCount || 0,
          followersCount: userData.followersCount || 0,
          followingCount: userData.followingCount || 0,
        },
      });
      setIsFollowing(userData.isFollowing || false);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    if (!profile) return;

    try {
      setPostsLoading(true);
      const userPosts = await postService.getUserPostsById(profile.user._id);
      setPosts(userPosts);
    } catch (error) {
      console.error('Failed to load user posts:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profile) return;

    setFollowLoading(true);
    try {
      const response = isFollowing
        ? await followService.unfollowUser(profile.user._id)
        : await followService.followUser(profile.user._id);

      if (response.success) {
        setIsFollowing(!isFollowing);
        setProfile(prev =>
          prev
            ? {
                ...prev,
                stats: {
                  ...prev.stats,
                  followersCount: response.data?.followersCount || prev.stats.followersCount,
                },
              }
            : null
        );

        toast({
          title: isFollowing ? 'Unfollowed' : 'Following',
          description: response.message,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update follow status',
        variant: 'destructive',
      });
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="border-none shadow-soft bg-gradient-card">
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-muted rounded-full" />
                <div className="flex-1">
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="border-none shadow-soft bg-gradient-card">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">User not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { user, stats } = profile;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <Card className="border-none shadow-soft bg-gradient-card mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24 ring-4 ring-primary/20">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground">@{user.username}</p>

                  <div className="flex items-center space-x-2 mt-2">
                    {user.role === 'admin' && (
                      <Badge className="bg-gradient-primary text-white">Admin</Badge>
                    )}
                    {user.isVerified && <Badge variant="secondary">Verified</Badge>}
                    {!user.isActive && <Badge variant="destructive">Suspended</Badge>}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                  {isOwnProfile ? (
                    <Link to="/settings">
                      <Button variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button
                        variant={isFollowing ? 'outline' : 'default'}
                        onClick={handleFollow}
                        disabled={followLoading}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" />
                            Following
                          </>
                        ) : (
                          <>
                            <Users className="w-4 h-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {user.bio && <p className="text-foreground mt-4 leading-relaxed">{user.bio}</p>}

              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6 mt-4">
                <div className="text-sm">
                  <span className="font-semibold text-foreground">{stats.postsCount}</span>
                  <span className="text-muted-foreground ml-1">Posts</span>
                </div>
                <Link
                  to={`/profile/${user._id}/following`}
                  className="text-sm hover:text-primary transition-smooth"
                >
                  <span className="font-semibold text-foreground">{stats.followingCount}</span>
                  <span className="text-muted-foreground ml-1">Following</span>
                </Link>
                <Link
                  to={`/profile/${user._id}/followers`}
                  className="text-sm hover:text-primary transition-smooth"
                >
                  <span className="font-semibold text-foreground">{stats.followersCount}</span>
                  <span className="text-muted-foreground ml-1">Followers</span>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-6">
          {postsLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-none shadow-soft bg-gradient-card">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-full" />
                        <div className="flex-1">
                          <div className="h-4 bg-muted rounded mb-2" />
                          <div className="h-4 bg-muted rounded w-3/4" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={() => {}}
                  onRepost={() => {}}
                  onShare={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          ) : (
            <Card className="border-none shadow-soft bg-gradient-card">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  {isOwnProfile ? "You haven't posted anything yet" : 'No posts yet'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <Card className="border-none shadow-soft bg-gradient-card">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Media posts will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="likes" className="mt-6">
          <Card className="border-none shadow-soft bg-gradient-card">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Liked posts will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
