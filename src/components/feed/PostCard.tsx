// src/components/posts/PostCard.tsx
import { formatDistanceToNow } from 'date-fns';
import {
  Bookmark,
  Heart,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share,
  Trash2,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, handleImageError, processImageArray } from '../../utils/imageUtils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

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
    images?: (string | { url: string; publicId: string })[]; // matches backend response
    // other optional fields allowed
    [key: string]: unknown;
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

              {(() => {
                const processedImages = processImageArray(post.images);
                return (
                  processedImages.length > 0 && (
                    <div
                      className={`mt-3 rounded-lg overflow-hidden ${
                        processedImages.length === 1
                          ? ''
                          : processedImages.length === 2
                            ? 'grid grid-cols-2 gap-1'
                            : 'grid grid-cols-2 gap-1'
                      }`}
                    >
                      {processedImages.slice(0, 4).map((image, index) => {
                        const imageUrl = getImageUrl(image);
                        return (
                          <img
                            key={index}
                            src={imageUrl}
                            alt={`Post media ${index + 1}`}
                            className={`w-full object-cover ${
                              processedImages.length === 1 ? 'max-h-96' : 'h-48'
                            } hover:scale-105 transition-transform cursor-pointer bg-gray-100`}
                            onClick={() => {
                              window.open(imageUrl, '_blank');
                            }}
                            onError={e => handleImageError(e, imageUrl)}
                          />
                        );
                      })}
                      {processedImages.length > 4 && (
                        <div className="relative">
                          <img
                            src={getImageUrl(processedImages[3])}
                            alt="Post media 4"
                            className="w-full h-48 object-cover bg-gray-100"
                            onError={e => handleImageError(e, getImageUrl(processedImages[3]))}
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              +{processedImages.length - 3}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                );
              })()}
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 flex-1 justify-center"
                  >
                    <Share className="w-4 h-4" />
                    <span className="text-sm">{(post.sharesCount as number) || 0}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={() => onShare?.(post._id, 'whatsapp')}>
                    <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                    WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare?.(post._id, 'x')}>
                    <span className="w-4 h-4 mr-2 text-black font-bold text-xs flex items-center justify-center">
                      𝕏
                    </span>
                    X (Twitter)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare?.(post._id, 'threads')}>
                    <MessageCircle className="w-4 h-4 mr-2 text-black" />
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
                  <DropdownMenuItem
                    onClick={async e => {
                      e.preventDefault();
                      e.stopPropagation();
                      await onShare?.(post._id);
                    }}
                    onSelect={e => e.preventDefault()}
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
