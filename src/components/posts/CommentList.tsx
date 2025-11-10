import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface CommentUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

interface Comment {
  _id: string;
  content: string;
  author: CommentUser;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

interface CommentListProps {
  postId: string;
  comments: Comment[];
  currentUserId?: string;
  onAddComment: (content: string) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
  onDeleteComment: (commentId: string) => Promise<void>;
}

export default function CommentList({
  comments,
  currentUserId,
  onAddComment,
  onLikeComment,
  onDeleteComment,
}: CommentListProps) {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      {/* Add Comment */}
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            className="min-h-[60px] text-sm"
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button onClick={handleSubmit} disabled={!newComment.trim() || submitting} size="sm">
            {submitting ? 'Posting...' : 'Comment'}
          </Button>
        </div>
      </div>

      {/* Comments */}
      {comments.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm py-4">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
              onLike={onLikeComment}
              onDelete={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onLike,
  onDelete,
}: {
  comment: Comment;
  currentUserId?: string;
  onLike: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0);
  const isOwn = currentUserId === comment.author._id;

  const handleLike = async () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(prev => (newLiked ? prev + 1 : prev - 1));
    try {
      await onLike(comment._id);
    } catch {
      setIsLiked(!newLiked);
      setLikesCount(prev => (newLiked ? prev - 1 : prev + 1));
    }
  };

  return (
    <div className="flex gap-3">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.author?.avatar} />
        <AvatarFallback className="text-xs">
          {comment.author?.firstName?.[0] || comment.author?.fullName?.[0] || 'U'}
          {comment.author?.lastName?.[0] || comment.author?.fullName?.[1] || ''}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium">
                {comment.author?.fullName ||
                  `${comment.author?.firstName || ''} ${comment.author?.lastName || ''}`.trim() ||
                  'Unknown User'}
              </span>
              <span className="text-muted-foreground">
                @{comment.author?.username || 'unknown'}
              </span>
              <span className="text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            {isOwn && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onDelete(comment._id)}
                className="text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`h-6 px-2 mt-1 ${isLiked ? 'text-social-like' : 'text-muted-foreground'}`}
        >
          <Heart className={`w-3 h-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
          {likesCount > 0 && <span className="text-xs">{likesCount}</span>}
        </Button>
      </div>
    </div>
  );
}
