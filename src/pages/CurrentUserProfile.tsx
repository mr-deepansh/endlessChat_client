import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
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
  Shield,
  Save,
  X,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { userService, type UserStats } from '@/services/userService';
import { ProfileSkeleton } from '@/components/loaders/ProfileSkeleton';

interface Post {
  _id: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

const CurrentUserProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.username && user._id && user.email) {
      const cleanUsername = user.username.replace(/^@+/, '');
      navigate(`/${cleanUsername}`, { replace: true });
    }
  }, [user, navigate]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<UserStats>({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0,
    mutualFollowersCount: 0,
    likesReceived: 0,
    commentsReceived: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    bio: '',
    location: '',
  });

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    if (user) {
      fetchUserData();
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        bio: user.bio || '',
        location: (user as any).location || '',
      });
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      // Try to fetch user posts and stats, but handle 404 gracefully
      try {
        const postsData = await userService.getUserPosts();
        setPosts(postsData || []);
      } catch (postsError: any) {
        console.warn('Posts API not available:', postsError);
        setPosts([]); // Set empty array if API not available
      }

      try {
        const statsData = await userService.getUserStats();
        setStats(statsData || stats);
      } catch (statsError: any) {
        console.warn('Stats API not available:', statsError);
        // Keep default stats if API not available
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Don't show error toast for API not being ready
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm);
      setIsEditModalOpen(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please log in</h2>
            <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <ProfileSkeleton />
      </Layout>
    );
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
                  {user.firstName?.[0] || user.username?.[0] || 'U'}
                  {user.lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-muted-foreground text-lg">@{user.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleEditProfile}>
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
                  <p className="text-foreground">
                    {user.bio || 'No bio yet. Tell the world about yourself!'}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Joined{' '}
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {(user as any).location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{(user as any).location}</span>
                    </div>
                  )}
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
              posts.map(post => (
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

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <Card className="glass border-white/20 shadow-2xl">
          <CardHeader>
            <CardTitle className="gradient-text">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={editForm.firstName}
                  onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={editForm.lastName}
                  onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                value={editForm.username}
                onChange={e => setEditForm({ ...editForm, username: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-foreground">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={editForm.bio}
                onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground">
                Location
              </Label>
              <Input
                id="location"
                value={editForm.location}
                onChange={e => setEditForm({ ...editForm, location: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                placeholder="City, Country"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveProfile} className="flex-1" variant="hero">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={() => setIsEditModalOpen(false)}
                variant="outline"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </Modal>
    </Layout>
  );
};

export default CurrentUserProfile;
