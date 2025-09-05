import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import CreatePost from '../components/posts/CreatePost';
import PostCard from '../components/posts/PostCard';
import { useAuth } from '../contexts/AuthContext';
import { postService, userService } from '../services';
import { toast } from '../hooks/use-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, CardContent } from '../components/ui/card';

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

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadPosts = async () => {
      try {
        const response = await userService.getUserFeed();
        if (response.posts) {
          setPosts(response.posts);
        }
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    };

    loadPosts();
    const interval = setInterval(loadPosts, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleCreatePost = async (postData: any) => {
    setLoading(true);
    try {
      const newPost = await postService.createPost({
        content: postData.content,
        files: postData.files
      });

      const newPostData: Post = {
        _id: newPost._id,
        author: newPost.author,
        content: newPost.content,
        images: newPost.media?.map(m => m.url) || [],
        createdAt: newPost.createdAt,
        likesCount: newPost.likes.length,
        commentsCount: newPost.comments.length,
        repostsCount: newPost.reposts.length,
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

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;

    try {
      const response = await postService.toggleLike(postId);
      
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
      const repostedPost = await postService.repost(postId, quoteText);
      
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

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <div>
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
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

            {posts.length === 0 && !loading ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold mb-2">Welcome to EndlessChat!</h3>
                  <p className="text-muted-foreground mb-4">
                    Start sharing your thoughts, create polls, upload media, or schedule posts.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Use hashtags (#), mentions (@), emojis 😎, and location 📍 to make your posts
                    engaging!
                  </p>
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
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
