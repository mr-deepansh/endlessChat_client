import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import LeftSidebar from '../components/layout/LeftSidebar';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import FeedSidebar from '../components/feed/FeedSidebar';
import FeedUserSuggestions from '../components/user/FeedUserSuggestions';
import { useAuth } from '../contexts/AuthContext';
import { postService, userService } from '../services';
import { toast } from '../hooks/use-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, CardContent } from '../components/ui/card';
import { mockFeedService } from '../services/mockFeedService';

interface Post {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
    title?: string;
  };
  content: string;
  images?: string[];
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  comments?: Comment[];
}

const Feed: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  usePageTitle('Feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadPosts = async () => {
      try {
        // Try to get feed from backend first
        const response = await userService.getUserFeed();
        if (response.posts) {
          setPosts(response.posts);
          return;
        }
      } catch (backendError) {
        console.warn('Backend feed failed:', backendError);
        // No fallback to mock data - show empty feed
        setPosts([]);
      }
    };

    loadPosts();
    const interval = setInterval(loadPosts, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleCreatePost = async (postData: any) => {
    setLoading(true);
    try {
      let newPost;

      // Try backend first
      try {
        newPost = await postService.createPost({
          content: postData.content,
          files: postData.files,
        });
      } catch (backendError) {
        console.warn('Backend post creation failed:', backendError);
        throw backendError;
      }

      const newPostData: Post = {
        _id: newPost._id,
        author: newPost.author,
        content: newPost.content,
        images: newPost.media?.map(m => m.url) || [],
        createdAt: newPost.createdAt,
        likesCount: newPost.likes?.length || 0,
        commentsCount: newPost.comments?.length || 0,
        repostsCount: newPost.reposts?.length || 0,
        sharesCount: 0,
        isLiked: newPost.isLiked || false,
        isBookmarked: false,
        isReposted: newPost.isReposted || false,
        comments: [],
      };

      setPosts([newPostData, ...posts]);

      toast({
        title: 'Post Created',
        description: 'Your post has been published successfully.',
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = async (postId: string, content: string) => {
    try {
      await postService.editPost(postId, content);
      setPosts(posts.map(p => (p._id === postId ? { ...p, content } : p)));
      toast({
        title: 'Post Updated',
        description: 'Your post has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update post',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      console.log('Deleting post:', postId);

      // Handle real post deletion
      const response = await postService.deletePost(postId);
      console.log('Delete response:', response);

      setPosts(posts.filter(p => p._id !== postId));
      toast({
        title: 'Post Deleted',
        description: 'Your post has been deleted successfully.',
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;

    try {
      let response;

      // Try backend first
      try {
        response = await postService.toggleLike(postId);
      } catch (backendError) {
        console.warn('Backend like failed:', backendError);
        throw backendError;
      }

      setPosts(
        posts.map(p =>
          p._id === postId
            ? {
                ...p,
                isLiked: response.isLiked,
                likesCount: response.likesCount,
              }
            : p
        )
      );
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update like',
        variant: 'destructive',
      });
    }
  };

  const handleRepost = async (postId: string, withQuote = false, quoteText?: string) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;

    try {
      let repostedPost;

      // Try backend first
      try {
        repostedPost = await postService.repost(postId, quoteText);
      } catch (backendError) {
        console.warn('Backend repost failed:', backendError);
        throw backendError;
      }

      setPosts(
        posts.map(p =>
          p._id === postId
            ? {
                ...p,
                isReposted: true,
                repostsCount: p.repostsCount + 1,
              }
            : p
        )
      );

      toast({
        title: 'Success',
        description: 'Post reposted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to repost',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (postId: string, platform?: string) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;

    const shareUrl = `${window.location.origin}/post/${postId}`;
    const shareText = `Check out this post by ${post.author.firstName} ${post.author.lastName}: ${post.content.substring(0, 100)}...`;

    if (platform) {
      let url = '';
      switch (platform) {
        case 'whatsapp':
          url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
          break;
        case 'twitter':
        case 'x':
          url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'linkedin':
          url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
          break;
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          break;
        case 'instagram':
          navigator.clipboard.writeText(shareUrl);
          toast({
            title: 'Link Copied',
            description: 'Post link copied to clipboard. You can paste it in Instagram.',
          });
          return;
        case 'threads':
          url = `https://threads.net/intent/post?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
          break;
        default:
          navigator.clipboard.writeText(shareUrl);
          toast({
            title: 'Link Copied',
            description: 'Post link copied to clipboard.',
          });
          return;
      }

      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }

    setPosts(posts.map(p => (p._id === postId ? { ...p, sharesCount: p.sharesCount + 1 } : p)));

    toast({
      title: 'Shared!',
      description: `Post shared ${platform ? `to ${platform}` : 'successfully'}`,
    });
  };

  const handleUserFollow = (userId: string) => {
    // Refresh feed when user follows someone new
    const loadPosts = async () => {
      try {
        const response = await userService.getUserFeed();
        if (response.posts) {
          setPosts(response.posts);
        }
      } catch (error) {
        console.warn('Failed to refresh feed after follow:', error);
      }
    };
    loadPosts();
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <LeftSidebar />
      <div className="ml-20 lg:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Feed */}
            <div className="lg:col-span-2">
            <div className="mb-6">
              <CreatePost
                onSubmit={handleCreatePost}
                placeholder="What's happening? 🚀 Share your thoughts, polls, media, or schedule a post!"
              />
            </div>

            <div className="space-y-6">
              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Creating post...</p>
                </div>
              )}

              {/* User Suggestions - Show after create post and before posts */}
              {showSuggestions && posts.length >= 0 && (
                <FeedUserSuggestions 
                  currentUserId={user?._id}
                  onUserFollow={handleUserFollow}
                  onDismiss={() => setShowSuggestions(false)}
                />
              )}

              {posts.length === 0 && !loading ? (
                <Card className="border-none shadow-soft bg-gradient-card">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="text-6xl">👋</div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                          Welcome to your feed!
                        </h3>
                        <p className="text-muted-foreground">
                          Follow some users to see their posts here, or create your first post to get started.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                posts
                  .filter(post => post && post.author)
                  .map((post, index) => (
                    <PostCard
                      key={post._id || `post-${index}`}
                      post={{
                        _id: post._id || `post-${index}`,
                        content: post.content || '',
                        author: {
                          _id: post.author?._id || '',
                          username: post.author?.username || 'unknown',
                          firstName: post.author?.firstName || 'Unknown',
                          lastName: post.author?.lastName || 'User',
                          avatar: post.author?.avatar,
                        },
                        createdAt: post.createdAt || new Date().toISOString(),
                        likesCount: post.likesCount || 0,
                        commentsCount: post.commentsCount || 0,
                        repostsCount: post.repostsCount || 0,
                        sharesCount: post.sharesCount || 0,
                        viewsCount: 0,
                        isLiked: post.isLiked || false,
                        isReposted: post.isReposted || false,
                        isBookmarked: post.isBookmarked || false,
                        images: post.images || [],
                        type: 'text',
                      }}
                      currentUserId={user?._id}
                      onLike={() => handleLike(post._id)}
                      onRepost={handleRepost}
                      onShare={handleShare}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <FeedSidebar onUserFollow={handleUserFollow} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
