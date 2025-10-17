import { Bookmark, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import LeftSidebar from '../../components/layout/LeftSidebar';
import Navbar from '../../components/layout/Navbar';
import PostCard from '../../components/posts/PostCard';
import { Card, CardContent } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { usePageTitle } from '../../hooks/usePageTitle';
import postService from '../../services/postService';

const Bookmarks: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  usePageTitle('Bookmarks');

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await postService.getBookmarkedPosts();
      setPosts(response.posts || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load bookmarks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async (postId: string) => {
    try {
      await postService.bookmarkPost(postId);
      setPosts(prev => prev.filter(post => post._id !== postId));
      toast({
        title: 'Success',
        description: 'Bookmark removed',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove bookmark',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <LeftSidebar />
      <div className="ml-60 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              <Bookmark className="w-6 h-6 mr-2" />
              Bookmarks
            </h1>
            <p className="text-muted-foreground">Your saved posts</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <PostCard key={post._id} post={post} onBookmark={handleBookmark} />
              ))}
            </div>
          ) : (
            <Card className="border-none shadow-soft bg-gradient-card">
              <CardContent className="p-8 text-center">
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No bookmarks yet</h3>
                <p className="text-muted-foreground">
                  Save posts you want to read later by clicking the bookmark icon.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
