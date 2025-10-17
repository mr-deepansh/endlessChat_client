import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import LeftSidebar from '../../components/layout/LeftSidebar';
import PostCard from '../../components/posts/PostCard';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import postService from '../../services/postService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../hooks/use-toast';

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      fetchPost();
      trackView();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPostById(postId!);
      setPost(response);
    } catch (error: any) {
      // Don't show error for 401 on public post view
      if (error.response?.status !== 401) {
        setError(error.message || 'Failed to load post');
        toast({
          title: 'Error',
          description: 'Failed to load post',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await postService.trackView(postId!);
    } catch (_error) {
      // Silently fail view tracking
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await postService.toggleLike(postId);
      setPost((prev: any) => ({
        ...prev,
        isLiked: response.isLiked,
        likesCount: response.likesCount,
      }));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to like post',
        variant: 'destructive',
      });
    }
  };

  const handleRepost = async (postId: string, withQuote?: boolean, quoteText?: string) => {
    try {
      await postService.repost(postId, quoteText);
      toast({
        title: 'Success',
        description: withQuote ? 'Quote repost created' : 'Post reposted',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to repost',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (postId: string) => {
    setPost((prev: any) => ({
      ...prev,
      sharesCount: (prev.sharesCount || 0) + 1,
    }));
  };

  const handleDelete = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      toast({ title: 'Post Deleted', description: 'Post deleted successfully' });
      navigate('/feed');
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to delete post', variant: 'destructive' });
    }
  };

  const handleEdit = async (postId: string, content: string) => {
    try {
      await postService.editPost(postId, content);
      setPost((prev: any) => ({ ...prev, content }));
      toast({ title: 'Post Updated', description: 'Post updated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: 'Failed to update post', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <LeftSidebar />
        <div className="ml-60 transition-all duration-300">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <LeftSidebar />
        <div className="ml-60 transition-all duration-300">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <Card className="border-none shadow-soft bg-gradient-card">
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-xl font-semibold mb-2">Post not found</h3>
                <p className="text-muted-foreground mb-4">
                  The post you're looking for doesn't exist or has been removed.
                </p>
                <Button onClick={() => navigate('/feed')}>Go back to feed</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <LeftSidebar />
      <div className="ml-60 transition-all duration-300">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Back Button */}
          <div className="mb-4">
            <Button
              variant="ghost"
              onClick={() => (isAuthenticated ? navigate(-1) : navigate('/'))}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>

          {/* Post */}
          <div className="space-y-6">
            <PostCard
              post={post}
              currentUserId={user?._id}
              onLike={isAuthenticated ? handleLike : () => setShowLoginPrompt(true)}
              onRepost={handleRepost}
              onComment={isAuthenticated ? () => {} : () => setShowLoginPrompt(true)}
              onShare={handleShare}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />

            {/* Comments Section */}
            {isAuthenticated ? (
              <PostComments postId={postId!} currentUserId={user?._id} />
            ) : (
              <Card className="border-none shadow-soft bg-gradient-card">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">Sign in to view and post comments</p>
                  <Button onClick={() => navigate('/login')}>Login to Comment</Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Login Prompt Modal */}
          {showLoginPrompt && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowLoginPrompt(false)}
            >
              <Card className="max-w-md mx-4" onClick={e => e.stopPropagation()}>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">Sign in Required</h3>
                  <p className="text-muted-foreground mb-4">
                    You need to be signed in to interact with posts
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={() => setShowLoginPrompt(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => navigate('/login')}>Login</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
