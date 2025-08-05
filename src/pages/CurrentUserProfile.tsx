import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Calendar, 
  MapPin, 
  Link as LinkIcon,
  Edit3,
  UserPlus,
  Settings,
  Shield
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  mutualFollowersCount: number;
}

const CurrentUserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<UserStats>({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    mutualFollowersCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch user posts
      const postsResponse = await axios.get(`${API_BASE}/posts/user/${user?._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPosts(postsResponse.data.data || []);

      // Fetch user stats
      const statsResponse = await axios.get(`${API_BASE}/users/stats/${user?._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(statsResponse.data.data || stats);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <Avatar className="w-32 h-32 border-4 border-primary/20">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-gradient-primary text-white text-2xl">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{user.firstName} {user.lastName}</h1>
                    <p className="text-muted-foreground text-lg">@{user.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <p className="text-foreground">{user.bio || "No bio yet. Tell the world about yourself!"}</p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  {user.role === 'admin' && (
                    <Badge variant="secondary" className="bg-gradient-primary text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats.postsCount}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center cursor-pointer hover:underline">
                    <div className="text-2xl font-bold">{stats.followersCount}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center cursor-pointer hover:underline">
                    <div className="text-2xl font-bold">{stats.followingCount}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center cursor-pointer hover:underline">
                    <div className="text-2xl font-bold">{stats.mutualFollowersCount}</div>
                    <div className="text-sm text-muted-foreground">Mutual</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="mutual">Mutual</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Card key={post._id}>
                  <CardContent className="p-4">
                    <p className="mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        {post.commentsCount}
                      </span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No posts yet. Share your first post!
              </div>
            )}
          </TabsContent>

          <TabsContent value="followers" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              Followers list will be implemented soon
            </div>
          </TabsContent>

          <TabsContent value="following" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              Following list will be implemented soon
            </div>
          </TabsContent>

          <TabsContent value="mutual" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              Mutual followers will be implemented soon
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CurrentUserProfile;