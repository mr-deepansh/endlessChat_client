import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart, MoreHorizontal, Reply, Flag, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface Comment {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUserId?: string;
  onAddComment?: (postId: string, content: string, parentId?: string) => void;
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

const CommentItem: React.FC<{
  comment: Comment;
  currentUserId?: string;
  onLike?: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
  isReply?: boolean;
}> = ({ comment, currentUserId, onLike, onDelete, onReply, isReply = false }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const isOwnComment = currentUserId === comment.author._id;

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => (newIsLiked ? prev + 1 : prev - 1));
    onLike?.(comment._id);
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply?.(comment._id, replyContent);
      setReplyContent('');
      setShowReplyBox(false);
    }
  };

  return (
    <div className={`${isReply ? 'ml-8' : ''}`}>
      <div className="flex space-x-3 py-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.author.avatar} alt={comment.author.username} />
          <AvatarFallback className="text-xs">
            {comment.author.firstName[0]}
            {comment.author.lastName[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {comment.author.firstName} {comment.author.lastName}
                </span>
                <span className="text-xs text-muted-foreground">@{comment.author.username}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!isOwnComment && (
                    <DropdownMenuItem>
                      <Flag className="w-3 h-3 mr-2" />
                      Report
                    </DropdownMenuItem>
                  )}
                  {isOwnComment && (
                    <DropdownMenuItem
                      onClick={() => onDelete?.(comment._id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm text-foreground">{comment.content}</p>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-6 px-2 ${
                isLiked ? 'text-social-like' : 'text-muted-foreground hover:text-social-like'
              }`}
            >
              <Heart className={`w-3 h-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount > 0 && likesCount}
            </Button>

            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="h-6 px-2 text-muted-foreground hover:text-foreground"
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
          </div>

          {showReplyBox && (
            <div className="flex space-x-2 mt-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">U</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  className="min-h-[60px] text-sm"
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={handleReply} disabled={!replyContent.trim()}>
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowReplyBox(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render replies */}
      {comment.replies &&
        comment.replies.map(reply => (
          <CommentItem
            key={reply._id}
            comment={reply}
            currentUserId={currentUserId}
            onLike={onLike}
            onDelete={onDelete}
            onReply={onReply}
            isReply={true}
          />
        ))}
    </div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments,
  currentUserId,
  onAddComment,
  onLikeComment,
  onDeleteComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment?.(postId, newComment);
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (commentId: string, content: string) => {
    onAddComment?.(postId, content, commentId);
  };

  return (
    <Card className="border-none shadow-soft bg-gradient-card backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Add Comment */}
          <div className="flex space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                className="min-h-[80px] border-none bg-muted/30 focus-visible:ring-0"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={!newComment.trim() || isSubmitting}
                  size="sm"
                  variant="gradient"
                >
                  {isSubmitting ? 'Posting...' : 'Comment'}
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-1">
            {comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map(comment => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  currentUserId={currentUserId}
                  onLike={onLikeComment}
                  onDelete={onDeleteComment}
                  onReply={handleReply}
                />
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
