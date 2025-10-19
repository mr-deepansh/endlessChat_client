import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Bookmark,
  Flag,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Quote,
  BarChart3,
  FileText,
  MessageSquare,
  Send,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import postService from '@/services/postService';

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface Post {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
  images?: (string | { url: string; publicId: string })[];
  poll?: {
    question: string;
    options: { text: string; votes: number }[];
    totalVotes: number;
    endsAt: string;
  };
  location?: string;
  scheduledFor?: string;
  type?: 'text' | 'article' | 'poll' | 'media';
  repostOf?: Post;
  quotedPost?: Post;
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRepost?: (postId: string, withQuote?: boolean, quoteText?: string) => void;
  onShare?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string, content: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onRepost,
  onShare,
  onDelete,
  onEdit,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isReposted, setIsReposted] = useState(post.isReposted || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount || 0);
  const [quoteText, setQuoteText] = useState('');
  const [selectedPollOption, setSelectedPollOption] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);

  const isOwnPost = currentUserId === post.author?._id;

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => (newIsLiked ? prev + 1 : prev - 1));
    onLike?.(post._id);
  };

  const handleRepost = () => {
    const newIsReposted = !isReposted;
    setIsReposted(newIsReposted);
    setRepostsCount(prev => (newIsReposted ? prev + 1 : prev - 1));
    onRepost?.(post._id);
  };

  const handleQuoteRepost = () => {
    if (quoteText.trim()) {
      onRepost?.(post._id, true, quoteText);
      setQuoteText('');
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await postService.bookmarkPost(post._id);
      setIsBookmarked(response.isBookmarked);
      toast({
        title: response.isBookmarked ? 'Bookmarked' : 'Removed Bookmark',
        description: response.isBookmarked
          ? 'Post saved to bookmarks'
          : 'Post removed from bookmarks',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to bookmark post',
        variant: 'destructive',
      });
    }
  };

  const handlePollVote = (optionIndex: number) => {
    if (!hasVoted) {
      setSelectedPollOption(optionIndex);
      setHasVoted(true);
    }
  };

  const formatNumber = (num: number | undefined) => {
    if (!num || num === 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPostTypeIcon = () => {
    switch (post.type) {
      case 'poll':
        return <BarChart3 className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'media':
        return <Eye className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const renderQuotedPost = (quotedPost: Post) => (
    <div className="mt-3 p-3 border border-border/50 rounded-lg bg-muted/20">
      <div className="flex items-center space-x-2 mb-2">
        <Avatar className="w-6 h-6">
          <AvatarImage src={quotedPost.author?.avatar} alt={quotedPost.author?.username} />
          <AvatarFallback className="text-xs">
            {quotedPost.author?.firstName?.[0] || 'U'}
            {quotedPost.author?.lastName?.[0] || ''}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">
          {quotedPost.author?.firstName || 'Unknown'} {quotedPost.author?.lastName || 'User'}
        </span>
        <span className="text-xs text-muted-foreground">
          @{quotedPost.author?.username || 'unknown'}
        </span>
      </div>
      <p className="text-sm text-foreground/80">{quotedPost.content}</p>
    </div>
  );

  const renderPoll = () => {
    if (!post.poll) return null;

    const timeLeft = new Date(post.poll.endsAt).getTime() - Date.now();
    const isExpired = timeLeft <= 0;

    return (
      <div className="mt-4 p-4 border border-border/50 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5">
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          {post.poll.question}
        </h4>
        <div className="space-y-2">
          {post.poll.options.map((option, index) => {
            const percentage =
              post.poll!.totalVotes > 0 ? (option.votes / post.poll!.totalVotes) * 100 : 0;
            const isSelected = selectedPollOption === index;

            return (
              <div key={index} className="relative">
                <Button
                  variant="ghost"
                  className={`w-full justify-start p-3 h-auto ${
                    hasVoted || isExpired ? 'cursor-default' : 'hover:bg-primary/10'
                  } ${isSelected ? 'bg-primary/20 border-primary/50' : ''}`}
                  onClick={() => !isExpired && handlePollVote(index)}
                  disabled={hasVoted || isExpired}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-left">{option.text}</span>
                    {(hasVoted || isExpired) && (
                      <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                    )}
                  </div>
                </Button>
                {(hasVoted || isExpired) && (
                  <Progress
                    value={percentage}
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-none"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
          <span>{formatNumber(post.poll.totalVotes)} votes</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {isExpired ? 'Poll ended' : `${Math.ceil(timeLeft / (1000 * 60 * 60))}h left`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card className="border-none shadow-soft hover:shadow-primary/10 transition-smooth bg-gradient-card backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={post.author?.avatar} alt={post.author?.username} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {post.author?.firstName?.[0] || 'U'}
                {post.author?.lastName?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-foreground">
                  {post.author?.firstName || 'Unknown'} {post.author?.lastName || 'User'}
                </span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
                {getPostTypeIcon() && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {getPostTypeIcon()}
                    {post.type}
                  </Badge>
                )}
              </div>
              <span className="text-muted-foreground text-sm mt-0.5">
                @{post.author?.username || 'unknown'}
              </span>
              {post.location && (
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{post.location}</span>
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
              <DropdownMenuItem onClick={handleBookmark}>
                <Bookmark className="w-4 h-4 mr-2" />
                {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
              </DropdownMenuItem>
              {!isOwnPost && (
                <>
                  <DropdownMenuItem>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                </>
              )}
              {isOwnPost && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.preventDefault();

                      onDelete?.(post._id);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Post Content */}
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onEdit?.(post._id, editContent);
                    setIsEditing(false);
                  }}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditContent(post.content);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>
          )}

          {/* Poll */}
          {renderPoll()}

          {/* Quoted Post */}
          {post.quotedPost && renderQuotedPost(post.quotedPost)}

          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div
              className={`rounded-lg overflow-hidden ${
                post.images.length === 1
                  ? ''
                  : post.images.length === 2
                    ? 'grid grid-cols-2 gap-2'
                    : 'grid grid-cols-2 gap-2'
              }`}
            >
              {post.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={typeof image === 'string' ? image : image.url}
                  alt={`Post image ${index + 1}`}
                  className={`w-full object-cover hover:scale-105 transition-smooth cursor-pointer ${
                    post.images.length === 1 ? 'max-h-96' : 'h-48'
                  }`}
                  onClick={() => {
                    window.open(typeof image === 'string' ? image : image.url, '_blank');
                  }}
                />
              ))}
              {post.images.length > 4 && (
                <div className="relative">
                  <img
                    src={typeof post.images[3] === 'string' ? post.images[3] : post.images[3].url}
                    alt="Post image 4"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{post.images.length - 3}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post._id)}
              className="flex items-center space-x-2 text-social-comment hover:text-social-comment hover:bg-social-comment/10 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{formatNumber(post.commentsCount || 0)}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center space-x-2 transition-all duration-200 ${
                    isReposted
                      ? 'text-social-repost bg-social-repost/10'
                      : 'text-muted-foreground hover:text-social-repost hover:bg-social-repost/10'
                  }`}
                >
                  <Repeat2 className="w-4 h-4" />
                  <span className="text-sm">{formatNumber(repostsCount)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleRepost}>
                  <Repeat2 className="w-4 h-4 mr-2" />
                  Repost
                </DropdownMenuItem>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                      <Quote className="w-4 h-4 mr-2" />
                      Quote Repost
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Quote Repost</DialogTitle>
                      <DialogDescription>
                        Add your thoughts to this post and share it with your followers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Add your thoughts..."
                        value={quoteText}
                        onChange={e => setQuoteText(e.target.value)}
                        className="min-h-[100px]"
                      />
                      {renderQuotedPost(post)}
                      <Button onClick={handleQuoteRepost} className="w-full">
                        Quote Repost
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                isLiked
                  ? 'text-social-like bg-social-like/10 scale-105'
                  : 'text-muted-foreground hover:text-social-like hover:bg-social-like/10 hover:scale-105'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-200 ${isLiked ? 'fill-current animate-pulse' : ''}`}
              />
              <span className="text-sm">{formatNumber(likesCount)}</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200 hover:scale-105"
                >
                  <Share className="w-4 h-4" />
                  <span className="text-sm">{formatNumber(post.sharesCount || 0)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onShare?.(post._id, 'whatsapp')}>
                  <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                  WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare?.(post._id, 'x')}>
                  <span className="w-4 h-4 mr-2 text-black font-bold text-xs flex items-center justify-center">
                    𝕏
                  </span>
                  X (Twitter)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare?.(post._id, 'threads')}>
                  <MessageSquare className="w-4 h-4 mr-2 text-black" />
                  Threads
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare?.(post._id, 'linkedin')}>
                  <span className="w-4 h-4 mr-2 text-blue-600 font-bold text-xs flex items-center justify-center">
                    in
                  </span>
                  LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare?.(post._id, 'facebook')}>
                  <span className="w-4 h-4 mr-2 text-blue-600 font-bold text-xs flex items-center justify-center">
                    f
                  </span>
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare?.(post._id, 'instagram')}>
                  <span className="w-4 h-4 mr-2 text-pink-600 font-bold text-xs flex items-center justify-center">
                    📷
                  </span>
                  Instagram
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onShare?.(post._id)}>
                  <Send className="w-4 h-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center space-x-1 text-xs text-muted-foreground ml-2">
              <Eye className="w-3 h-3" />
              <span>{formatNumber(post.viewsCount || 0)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
