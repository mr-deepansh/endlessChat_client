import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { realTimePostService } from '../services/realTimePostService';
import { toast } from '../hooks/use-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  Calendar,
  MapPin,
  Smile,
  Send,
  ThumbsUp,
  Quote,
  ExternalLink,
  UserMinus,
  Flag,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

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

interface Comment {
  _id: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  replies?: Comment[];
}

const Feed: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  usePageTitle('Feed');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [repostText, setRepostText] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [sharePostId, setSharePostId] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        _id: '1',
        author: {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          avatar: '',
          title: 'Software Engineer at Tech Corp',
        },
        content:
          'Just shipped a new feature that improves user experience by 40%! Excited to see how our users respond to these changes. Building great products is all about listening to feedback and iterating quickly. 🚀',
        images: [],
        createdAt: '2024-01-15T10:30:00Z',
        likesCount: 24,
        commentsCount: 8,
        repostsCount: 3,
        sharesCount: 2,
        isLiked: false,
        isBookmarked: false,
        isReposted: false,
        comments: [],
      },
      {
        _id: '2',
        author: {
          _id: '2',
          firstName: 'Sarah',
          lastName: 'Wilson',
          username: 'sarahw',
          avatar: '',
          title: 'Product Manager at StartupXYZ',
        },
        content:
          'Attending an amazing tech conference today! The insights on AI and machine learning are mind-blowing. Networking with brilliant minds and learning about the future of technology. #TechConf2024',
        images: [],
        createdAt: '2024-01-15T08:15:00Z',
        likesCount: 45,
        commentsCount: 12,
        repostsCount: 7,
        sharesCount: 5,
        isLiked: true,
        isBookmarked: true,
        isReposted: false,
        comments: [],
      },
    ];
    setPosts(mockPosts);
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await realTimePostService.createPost({
        content: newPost,
        visibility: 'public',
      });

      if (response.success) {
        const newPostData: Post = {
          _id: response.data._id || Date.now().toString(),
          author: {
            _id: user?._id || '',
            firstName: user?.firstName || 'User',
            lastName: user?.lastName || '',
            username: user?.username || 'user',
            avatar: user?.avatar,
            title: 'EndlessChatt User',
          },
          content: newPost,
          images: [],
          createdAt: new Date().toISOString(),
          likesCount: 0,
          commentsCount: 0,
          repostsCount: 0,
          sharesCount: 0,
          isLiked: false,
          isBookmarked: false,
          isReposted: false,
          comments: [],
        };

        setPosts([newPostData, ...posts]);
        setNewPost('');
        setShowCreatePost(false);

        toast({
          title: 'Post Created',
          description: 'Your post has been published successfully.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive',
      });
    }
  };

  const handleLike = async (postId: string) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;

    try {
      const response = post.isLiked
        ? await realTimePostService.unlikePost(postId)
        : await realTimePostService.likePost(postId);

      if (response.success) {
        setPosts(
          posts.map(p =>
            p._id === postId
              ? {
                  ...p,
                  isLiked: !p.isLiked,
                  likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
                }
              : p
          )
        );
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update like',
        variant: 'destructive',
      });
    }
  };

  const handleBookmark = async (postId: string) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;

    try {
      const response = post.isBookmarked
        ? await realTimePostService.unbookmarkPost(postId)
        : await realTimePostService.bookmarkPost(postId);

      if (response.success) {
        setPosts(posts.map(p => (p._id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p)));
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update bookmark',
        variant: 'destructive',
      });
    }
  };

  const handleRepost = async (postId: string, withQuote = false) => {
    const post = posts.find(p => p._id === postId);
    if (!post) return;

    try {
      const response = post.isReposted
        ? await realTimePostService.unrepost(postId)
        : await realTimePostService.repost(postId, withQuote ? repostText : undefined);

      if (response.success) {
        setPosts(
          posts.map(p =>
            p._id === postId
              ? {
                  ...p,
                  isReposted: !p.isReposted,
                  repostsCount: p.isReposted ? p.repostsCount - 1 : p.repostsCount + 1,
                }
              : p
          )
        );
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to repost',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (postId: string, platform?: string) => {
    if (platform) {
      // Handle sharing to specific platform
      console.log('Share to:', platform, postId);
    } else {
      // Handle generic share
      setPosts(
        posts.map(post =>
          post._id === postId ? { ...post, sharesCount: post.sharesCount + 1 } : post
        )
      );
    }
    setShowShareDialog(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return `${Math.floor(diffInHours / 168)}w`;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to EndlessChatt</h2>
            <p className="text-muted-foreground mb-4">Please sign in to access your feed</p>
            <Button asChild className="w-full">
              <Link to="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      <div>
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Create Post Card */}
          <Card className="mb-6 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              {!showCreatePost ? (
                <div
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => setShowCreatePost(true)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    Start a post...
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-sm text-slate-500">Post to anyone</div>
                    </div>
                  </div>

                  <Textarea
                    placeholder="What do you want to talk about?"
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    className="min-h-[120px] border-none resize-none text-lg placeholder:text-slate-400 focus-visible:ring-0"
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-slate-800"
                      >
                        <ImageIcon className="w-5 h-5 mr-2" />
                        Photo
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-slate-800"
                      >
                        <Video className="w-5 h-5 mr-2" />
                        Video
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-slate-800"
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        Event
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600 hover:text-slate-800"
                      >
                        <Smile className="w-5 h-5 mr-2" />
                        Feeling
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCreatePost(false);
                          setNewPost('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreatePost}
                        disabled={!newPost.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!showCreatePost && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-slate-600 hover:text-slate-800"
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Photo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-slate-600 hover:text-slate-800"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-slate-600 hover:text-slate-800"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Event
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-slate-600 hover:text-slate-800"
                  >
                    <Smile className="w-5 h-5 mr-2" />
                    Feeling
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map(post => (
              <Card
                key={post._id}
                className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700"
              >
                <CardContent className="p-0">
                  {/* Post Header */}
                  <div className="p-4 flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {post.author.firstName[0]}
                          {post.author.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {post.author.firstName} {post.author.lastName}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {post.author.title}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {formatTimeAgo(post.createdAt)} • 🌍
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleBookmark(post._id)}>
                          <Bookmark className="w-4 h-4 mr-2" />
                          {post.isBookmarked ? 'Remove bookmark' : 'Save post'}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy link to post
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <UserMinus className="w-4 h-4 mr-2" />
                          Unfollow {post.author.firstName}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Flag className="w-4 h-4 mr-2" />
                          Report post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-4">
                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Post Images */}
                  {post.images && post.images.length > 0 && (
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
                        {post.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt=""
                            className="w-full h-48 object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center space-x-4">
                        {post.likesCount > 0 && (
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1 text-pink-600" />
                            {post.likesCount}
                          </span>
                        )}
                        {post.commentsCount > 0 && <span>{post.commentsCount} comments</span>}
                      </div>
                      <div className="flex items-center space-x-4">
                        {post.repostsCount > 0 && <span>{post.repostsCount} reposts</span>}
                        {post.sharesCount > 0 && <span>{post.sharesCount} shares</span>}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post._id)}
                        className={`flex-1 ${post.isLiked ? 'text-pink-500' : 'text-slate-600'} hover:bg-blue-50 dark:hover:bg-blue-900/20`}
                      >
                        <Heart className={`w-5 h-5 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                        Like
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Comment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Comments</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="bg-gradient-primary text-white text-sm">
                                  {user?.firstName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Input
                                  placeholder="Write a comment..."
                                  value={commentText}
                                  onChange={e => setCommentText(e.target.value)}
                                  className="mb-2"
                                />
                                <Button size="sm" disabled={!commentText.trim()}>
                                  <Send className="w-4 h-4 mr-2" />
                                  Comment
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-slate-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            <Repeat2 className="w-5 h-5 mr-2" />
                            Repost
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleRepost(post._id)}>
                            <Repeat2 className="w-4 h-4 mr-2" />
                            Repost
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Quote className="w-4 h-4 mr-2" />
                            Quote repost
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-slate-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                          >
                            <Share className="w-5 h-5 mr-2" />
                            Share
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleShare(post._id)}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Share via EndlessChatt
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleShare(post._id, 'linkedin')}>
                            <Linkedin className="w-4 h-4 mr-2" />
                            Share on LinkedIn
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(post._id, 'twitter')}>
                            <Twitter className="w-4 h-4 mr-2" />
                            Share on Twitter
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(post._id, 'facebook')}>
                            <Facebook className="w-4 h-4 mr-2" />
                            Share on Facebook
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShare(post._id, 'instagram')}>
                            <Instagram className="w-4 h-4 mr-2" />
                            Share on Instagram
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy link
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
