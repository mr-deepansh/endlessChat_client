import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Bookmark,
  Flag,
  Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
  images?: string[];
}

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onRepost,
  onDelete,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isReposted, setIsReposted] = useState(post.isReposted || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount);

  const isOwnPost = currentUserId === post.author._id;

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);
    onLike?.(post._id);
  };

  const handleRepost = () => {
    const newIsReposted = !isReposted;
    setIsReposted(newIsReposted);
    setRepostsCount(prev => newIsReposted ? prev + 1 : prev - 1);
    onRepost?.(post._id);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Card className="border-none shadow-soft hover:shadow-primary/10 transition-smooth bg-gradient-card backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/20">
              <AvatarImage src={post.author.avatar} alt={post.author.username} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {post.author.firstName[0]}{post.author.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-foreground">
                  {post.author.firstName} {post.author.lastName}
                </span>
                <span className="text-muted-foreground text-sm">
                  @{post.author.username}
                </span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleBookmark}>
                <Bookmark className="w-4 h-4 mr-2" />
                {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
              </DropdownMenuItem>
              {!isOwnPost && (
                <DropdownMenuItem>
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
              )}
              {isOwnPost && (
                <DropdownMenuItem
                  onClick={() => onDelete?.(post._id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Post Content */}
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-48 object-cover hover:scale-105 transition-smooth cursor-pointer"
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post._id)}
              className="flex items-center space-x-2 text-social-comment hover:text-social-comment hover:bg-social-comment/10"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{post.commentsCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRepost}
              className={`flex items-center space-x-2 transition-smooth ${
                isReposted
                  ? 'text-social-repost bg-social-repost/10'
                  : 'text-muted-foreground hover:text-social-repost hover:bg-social-repost/10'
              }`}
            >
              <Repeat2 className="w-4 h-4" />
              <span className="text-sm">{repostsCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-smooth ${
                isLiked
                  ? 'text-social-like bg-social-like/10'
                  : 'text-muted-foreground hover:text-social-like hover:bg-social-like/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likesCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-accent hover:bg-accent/10"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;