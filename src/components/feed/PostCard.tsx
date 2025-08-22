import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    _id: string;
    content: string;
    author: {
      _id: string;
      username: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
    likesCount: number;
    commentsCount: number;
    repostsCount: number;
    isLiked: boolean;
    isBookmarked: boolean;
    isReposted: boolean;
    createdAt: string;
    media?: string[];
  };
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onRepost?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onRepost,
  onBookmark
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [isReposting, setIsReposting] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      await onLike?.(post._id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRepost = async () => {
    if (isReposting) return;
    setIsReposting(true);
    try {
      await onRepost?.(post._id);
    } finally {
      setIsReposting(false);
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} alt={post.author.username} />
            <AvatarFallback className="bg-gradient-primary text-white">
              {post.author.firstName?.[0] || post.author.username?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-sm cursor-pointer hover:underline">
                    {post.author.firstName} {post.author.lastName}
                  </h3>
                  <span className="text-muted-foreground text-sm">·</span>
                  <span className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs cursor-pointer hover:underline">
                  @{post.author.username}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onBookmark?.(post._id)}>
                    <Bookmark className="w-4 h-4 mr-2" />
                    {post.isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="w-4 h-4 mr-2" />
                    Share post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="mt-2">
              <p className="text-foreground whitespace-pre-wrap break-words">
                {post.content.split(/(@\w+|#\w+)/g).map((part, index) => {
                  if (part.startsWith('@')) {
                    return (
                      <span key={index} className="text-primary cursor-pointer hover:underline">
                        {part}
                      </span>
                    );
                  } else if (part.startsWith('#')) {
                    return (
                      <span key={index} className="text-primary cursor-pointer hover:underline">
                        {part}
                      </span>
                    );
                  }
                  return part;
                })}
              </p>
              
              {post.media && post.media.length > 0 && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img
                    src={post.media[0]}
                    alt="Post media"
                    className="w-full max-h-96 object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onComment?.(post._id)}
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
                    className={`flex items-center space-x-1 hover:text-green-500 hover:bg-green-50 flex-1 justify-center ${
                      post.isReposted ? 'text-green-500' : 'text-muted-foreground'
                    }`}
                  >
                    <Repeat2 className="w-4 h-4" />
                    <span className="text-sm">{post.repostsCount}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                  <DropdownMenuItem onClick={handleRepost}>
                    <Repeat2 className="w-4 h-4 mr-2" />
                    Repost
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Quote repost')}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Quote repost
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
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