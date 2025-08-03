import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import UserCard from '@/components/user/UserCard';
import PostCard from '@/components/posts/PostCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Edit, Settings } from 'lucide-react';

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  location?: string;
  isFollowing?: boolean;
}

interface Post {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
}

const Profile = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const isOwnProfile = currentUser?._id === userId;

  // Mock user data
  const mockUser: User = {
    _id: userId || '1',
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Full-stack developer passionate about React, TypeScript, and building amazing user experiences. Coffee enthusiast ☕ and open source contributor.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    role: 'user',
    isActive: true,
    followersCount: 1250,
    followingCount: 340,
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'San Francisco, CA',
    isFollowing: false
  };

  const mockPosts: Post[] = [
    {
      _id: '1',
      content: 'Just shipped a new feature! Really excited about the TypeScript integration we built. The type safety is incredible and makes the whole development experience so much smoother.',
      author: mockUser,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likesCount: 89,
      commentsCount: 12,
      repostsCount: 23,
      isLiked: false,
      isReposted: false,
      isBookmarked: false
    },
    {
      _id: '2',
      content: 'Beautiful morning run through Golden Gate Park! 🌲 Sometimes the best debugging happens away from the screen.',
      author: mockUser,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      likesCount: 156,
      commentsCount: 8,
      repostsCount: 45,
      isLiked: true,
      isReposted: false,
      isBookmarked: true
    }
  ];

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfileUser(mockUser);
      setPosts(mockPosts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    toast({
      title: "Following!",
      description: `You are now following ${profileUser?.firstName} ${profileUser?.lastName}`,
    });
  };

  const handleUnfollow = async (userId: string) => {
    toast({
      title: "Unfollowed",
      description: `You unfollowed ${profileUser?.firstName} ${profileUser?.lastName}`,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-start space-x-4">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              </div>
            </div>
            {Array.from({ length: 2 }).map((_, index) => (
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
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileUser) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Profile Header */}
        <div className="mb-8">
          <UserCard
            user={profileUser}
            currentUserId={currentUser?._id}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
            showFullProfile={true}
          />
          
          {isOwnProfile && (
            <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          )}
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="replies">Replies</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary/10 flex items-center justify-center">
                  <Edit className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile ? "Start sharing your thoughts with the community!" : `${profileUser.firstName} hasn't posted anything yet.`}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUser?._id}
                />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="replies" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No replies yet</h3>
              <p className="text-muted-foreground">Replies will appear here when available.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="media" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No media yet</h3>
              <p className="text-muted-foreground">Photos and videos will appear here when available.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="likes" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No likes yet</h3>
              <p className="text-muted-foreground">Liked posts will appear here when available.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;