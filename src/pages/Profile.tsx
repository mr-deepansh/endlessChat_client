import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import { userService, socialService, User, Post } from '@/services';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { 
  MessageCircle, 
  Heart, 
  Repeat2, 
  Eye, 
  Calendar,
  MapPin,
  Link as LinkIcon,
  Github,
  Linkedin,
  UserPlus,
  UserMinus,
  Settings
} from 'lucide-react';

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        // Find user by username
        const users = await userService.searchUsers(username.replace('@', ''));
        const foundUser = users.find(u => u.username === username.replace('@', ''));
        
        if (foundUser) {
          setUser(foundUser);
          setIsFollowing(foundUser.isFollowing || false);
          
          // Fetch user posts
          const userPosts = await userService.getUserPosts(foundUser._id);
          setPosts(userPosts);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  const { execute: executeFollow } = useApi({
    showSuccessToast: true,
    successMessage: 'Follow status updated successfully'
  });

  const handleFollow = async () => {
    if (!user) return;
    
    const result = await executeFollow(async () => {
      return isFollowing 
        ? await socialService.unfollowUser(user._id)
        : await socialService.followUser(user._id);
    });
    
    if (result) {
      setIsFollowing(!isFollowing);
      setUser(prev => prev ? {
        ...prev,
        followersCount: isFollowing 
          ? prev.followersCount - 1 
          : prev.followersCount + 1
      } : null);
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
          <p className="text-muted-foreground">The user @{username} does not exist.</p>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-32 w-32 ring-4 ring-primary/20">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                  {user.firstName?.[0] || user.username?.[0] || 'U'}{user.lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4 md:mt-0">
                    {isOwnProfile ? (
                      <Button variant="outline" asChild>
                        <Link to="/settings">
                          <Settings className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Link>
                      </Button>
                    ) : (
                      <Button 
                        variant={isFollowing ? "outline" : "default"}
                        onClick={handleFollow}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                
                {user.bio && (
                  <p className="text-foreground mb-4">{user.bio}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {user.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
                
                {user.website && (
                  <div className="flex items-center gap-1 text-sm mb-4">
                    <LinkIcon className="w-4 h-4" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{user.postsCount || 0}</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.followersCount || 0}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.followingCount || 0}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Mutual</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="reposts">Reposts</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
            <TabsTrigger value="views">Views</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="mt-6">
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post._id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.author.avatar} alt={post.author.username} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {post.author.firstName?.[0] || post.author.username?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{post.author.firstName} {post.author.lastName}</span>
                            <span className="text-muted-foreground">@{post.author.username}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground text-sm">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mb-4">{post.content}</p>
                          
                          <div className="flex items-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">{post.commentsCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Repeat2 className="w-4 h-4" />
                              <span className="text-sm">{post.repostsCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{post.likesCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No posts yet</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="reposts" className="mt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reposts yet</p>
            </div>
          </TabsContent>
          
          <TabsContent value="comments" className="mt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No comments yet</p>
            </div>
          </TabsContent>
          
          <TabsContent value="likes" className="mt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No liked posts yet</p>
            </div>
          </TabsContent>
          
          <TabsContent value="views" className="mt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No viewed posts yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;