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
    images?: (string | {url: string; publicId: string})[]; // matches backend response
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
    <Card className="mb-4 xl:mb-6 2xl:mb-8 hover:shadow-md transition-shadow">
      <CardContent className="p-4 xl:p-6 2xl:p-8">
        <div className="flex space-x-3 xl:space-x-4 2xl:space-x-6">
          <Avatar className="h-10 w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14">
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {post.author.firstName?.[0] || post.author.username?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/u/${post.author.username}`}
                    className="font-semibold text-sm cursor-pointer hover:underline"
                  >
                    {post.author.firstName} {post.author.lastName}
                  </Link>
                  <span className="text-muted-foreground text-sm">·</span>
                  <span className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <Link
                  to={`/u/${post.author.username}`}
                  className="text-muted-foreground text-xs cursor-pointer hover:underline"
                >
                  @{post.author.username}
                </Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(post._id, post.content)}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Edit post
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => onShare?.(post._id)}>
                    <Share className="w-4 h-4 mr-2" />
                    Share post
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleDeleteClick}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-2">
              <p className="text-foreground whitespace-pre-wrap break-words">
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
                <div className={`mt-3 rounded-lg overflow-hidden ${
                  post.images.length === 1 ? '' : 
                  post.images.length === 2 ? 'grid grid-cols-2 gap-1' :
                  'grid grid-cols-2 gap-1'
                }`}>
                  {post.images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={typeof image === 'string' ? image : image.url}
                      alt={`Post media ${index + 1}`}
                      className={`w-full object-cover ${
                        post.images.length === 1 ? 'max-h-96' : 'h-48'
                      } hover:scale-105 transition-transform cursor-pointer bg-gray-100`}
                      onClick={() => {
                        // TODO: Open image in modal
                        window.open(typeof image === 'string' ? image : image.url, '_blank');
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Prevent infinite loop
                        target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                        target.style.cursor = 'default';
                      }}
                    />
                  ))}
                  {post.images.length > 4 && (
                    <div className="relative">
                      <img
                        src={typeof post.images[3] === 'string' ? post.images[3] : post.images[3].url}
                        alt="Post media 4"
                        className="w-full h-48 object-cover bg-gray-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%239ca3af"%3EImage unavailable%3C/text%3E%3C/svg%3E';
                        }}
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
            </div>

            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare?.(post._id)}
                className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 flex-1 justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.commentsCount}</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRepostClick}
                    className={`flex items-center space-x-1 hover:text-green-500 hover:bg-green-50 flex-1 justify-center ${
                      post.isReposted ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                  >
                    <Repeat2 className="w-4 h-4" />
                    <span className="text-sm">{post.repostsCount}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={handleRepostClick}>
                    <Repeat2 className="w-4 h-4 mr-2" />
                    Repost
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onRepost?.(post._id, true, 'Quote text')}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Quote repost
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeClick}
                disabled={isLiking}
                className={`flex items-center space-x-1 hover:text-red-500 hover:bg-red-50 flex-1 justify-center ${
                  post.isLiked ? 'text-red-500' : 'text-muted-foreground'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{post.likesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareClick}
                className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 flex-1 justify-center"
              >
                <Share className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
