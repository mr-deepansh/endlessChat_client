// src/components/posts/PostCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Bookmark,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * NOTE / FIX:
 * Previously this component used a single `onInteraction(postId, action)` prop.
 * Your Feed.tsx passes separate handlers: onLike, onDelete, onRepost, onShare, onEdit.
 * That mismatch made `onInteraction` undefined => clicking delete only logged to console.
 *
 * FIX: Accept explicit handler props and call them directly.
 */

interface PostAuthor {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface PostCardProps {
  post: {
    _id: string;
    content: string;
    author: PostAuthor;
    likesCount: number;
    commentsCount: number;
    repostsCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
    isReposted: boolean;
    createdAt: string;
    images?: string[]; // matches Feed.tsx usage
    // other optional fields allowed
    [key: string]: any;
  };
  currentUserId?: string;
  onLike?: (postId: string) => void;
  onRepost?: (postId: string, withQuote?: boolean, quoteText?: string) => void;
  onShare?: (postId: string, platform?: string) => void;
  onEdit?: (postId: string, content: string) => void;
  onDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onRepost,
  onShare,
  onEdit,
  onDelete,
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);

  const handleLikeClick = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike?.(post._id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRepostClick = async () => {
    if (isReposting) return;
    setIsReposting(true);
    try {
      await onRepost?.(post._id);
    } finally {
      setIsReposting(false);
    }
  };

  const handleDeleteClick = () => {
    // Let parent confirm/delete (Feed.tsx already has confirm)
    onDelete?.(post._id);
  };

  const handleShareClick = () => {
    onShare?.(post._id);
  };

  return (
    <Card className="mb-3 sm:mb-4 lg:mb-6 xl:mb-8 2xl:mb-10 hover:shadow-md transition-all duration-300 bg-gradient-card backdrop-blur-sm border-border/50">
      <CardContent className="p-3 sm:p-4 lg:p-5 xl:p-6 2xl:p-8">
        <div className="flex space-x-2 sm:space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16 ring-2 ring-primary/10 flex-shrink-0">
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback className="bg-gradient-primary text-white text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl">
              {post.author.firstName?.[0] || post.author.username?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link
                    to={`/u/${post.author.username}`}
                    className="font-semibold text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl cursor-pointer hover:underline transition-colors"
                  >
                    {post.author.firstName} {post.author.lastName}
                  </Link>
                  <span className="text-muted-foreground text-xs sm:text-sm">·</span>
                  <span className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <Link
                  to={`/u/${post.author.username}`}
                  className="text-muted-foreground text-xs sm:text-sm cursor-pointer hover:underline transition-colors"
                >
                  @{post.author.username}
                </Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                    <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(post._id, post.content)}>
                    <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="text-xs sm:text-sm">Edit post</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onShare?.(post._id)}>
                    <Share className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="text-xs sm:text-sm">Share post</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleDeleteClick}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="text-xs sm:text-sm">Delete post</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-2 sm:mt-3 lg:mt-4">
              <p className="text-foreground whitespace-pre-wrap break-words text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-relaxed">
                {post.content.split(/(@\w+|#\w+)/g).map((part: string, index: number) => {
                  if (part.startsWith('@')) {
                    const username = part.substring(1);
                    return (
                      <Link
                        key={index}
                        to={`/u/${username}`}
                        className="text-primary cursor-pointer hover:underline"
                      >
                        {part}
                      </Link>
                    );
                  } else if (part.startsWith('#')) {
                    return (
                      <span key={index} className="text-primary cursor-pointer hover:underline">
                        {part}
                      </span>
                    );
                  }
                  return <span key={index}>{part}</span>;
                })}
              </p>

              {post.images && post.images.length > 0 && (
                <div className="mt-3 sm:mt-4 lg:mt-5 rounded-lg overflow-hidden">
                  <img
                    src={post.images[0]}
                    alt="Post media"
                    className="w-full max-h-64 sm:max-h-80 lg:max-h-96 xl:max-h-[28rem] 2xl:max-h-[32rem] object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 sm:mt-4 lg:mt-5 xl:mt-6 2xl:mt-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(post._id)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 flex-1 justify-center h-8 sm:h-9 lg:h-10 text-xs sm:text-sm lg:text-base"
              >
                <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span className="text-xs sm:text-sm lg:text-base">{post.commentsCount}</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRepostClick}
                    className={`flex items-center space-x-1 hover:text-green-500 hover:bg-green-50 flex-1 justify-center h-8 sm:h-9 lg:h-10 text-xs sm:text-sm lg:text-base ${
                      post.isReposted ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                  >
                    <Repeat2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span className="text-xs sm:text-sm lg:text-base">{post.repostsCount}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={handleRepostClick}>
                    <Repeat2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="text-xs sm:text-sm">Repost</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onRepost?.(post._id, true, 'Quote text')}>
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="text-xs sm:text-sm">Quote repost</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeClick}
                disabled={isLiking}
                className={`flex items-center space-x-1 hover:text-red-500 hover:bg-red-50 flex-1 justify-center h-8 sm:h-9 lg:h-10 text-xs sm:text-sm lg:text-base ${
                  post.isLiked ? 'text-red-500' : 'text-muted-foreground'
                }`}
              >
                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs sm:text-sm lg:text-base">{post.likesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareClick}
                className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 flex-1 justify-center h-8 sm:h-9 lg:h-10 text-xs sm:text-sm lg:text-base"
              >
                <Share className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span className="text-xs sm:text-sm lg:text-base hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
