import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Heart,
  MoreHorizontal,
  Reply,
  Flag,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';
import commentService from '@/services/commentService';

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
  repliesCount?: number;
  isEdited?: boolean;
  editedAt?: string;
  isDeleted?: boolean;
  parentComment?: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  currentUserId?: string;
  onAddComment?: (postId: string, content: string, parentId?: string) => void;
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
}

const MAX_DEPTH = 5;

const CommentItem: React.FC<{
  comment: Comment;
  currentUserId?: string;
  onLike?: (commentId: string) => void;
  onDelete?: (commentId: string, hasReplies: boolean) => void;
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  depth?: number;
}> = ({ comment, currentUserId, onLike, onDelete, onReply, onEdit, depth = 0 }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likesCount, setLikesCount] = useState(comment.likesCount);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  const isOwnComment = currentUserId === comment.author._id;
  const isDeleted = comment.isDeleted || comment.content === 'This comment was deleted';
  const canReply = depth < MAX_DEPTH && !isDeleted;
  const hasReplies = (comment.replies?.length || 0) > 0;

  useEffect(() => {
    if (showReplyBox && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [showReplyBox]);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => (newIsLiked ? prev + 1 : prev - 1));
    onLike?.(comment._id);
  };

  const handleReply = async () => {
    if (!replyContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onReply?.(comment._id, replyContent);
      setReplyContent('');
      setShowReplyBox(false);
    } catch (error) {
      toast.error('Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onEdit?.(comment._id, editContent);
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update comment');
      setEditContent(comment.content);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete?.(comment._id, hasReplies);
    setShowDeleteDialog(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className={`${depth > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}
    >
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
                  {isOwnComment && !isDeleted && (
                    <>
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit2 className="w-3 h-3 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  ref={editInputRef}
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  maxLength={1000}
                  className="min-h-[60px] text-sm"
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    disabled={!editContent.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p
                  className={`text-sm ${isDeleted ? 'text-muted-foreground italic' : 'text-foreground'}`}
                >
                  {comment.content}
                </p>
                {comment.isEdited && !isDeleted && (
                  <span className="text-xs text-muted-foreground">(edited)</span>
                )}
              </>
            )}
          </div>

          {!isDeleted && (
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

              {canReply && (
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

              {hasReplies && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                  className="h-6 px-2 text-muted-foreground hover:text-foreground"
                >
                  {showReplies ? (
                    <ChevronUp className="w-3 h-3 mr-1" />
                  ) : (
                    <ChevronDown className="w-3 h-3 mr-1" />
                  )}
                  {comment.repliesCount || comment.replies?.length || 0}{' '}
                  {(comment.repliesCount || comment.replies?.length || 0) === 1
                    ? 'reply'
                    : 'replies'}
                </Button>
              )}
            </div>
          )}

          <AnimatePresence>
            {showReplyBox && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex space-x-2 mt-2"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
                  <AvatarFallback className="text-xs">
                    {currentUser.firstName?.[0] || currentUser.username?.[0] || 'U'}
                    {currentUser.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    ref={replyInputRef}
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    maxLength={1000}
                    className="min-h-[60px] text-sm"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleReply();
                      }
                    }}
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleReply}
                      disabled={!replyContent.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Posting...' : 'Reply'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowReplyBox(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Render replies */}
      <AnimatePresence>
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {comment.replies.map(reply => (
              <CommentItem
                key={reply._id}
                comment={reply}
                currentUserId={currentUserId}
                onLike={onLike}
                onDelete={onDelete}
                onReply={onReply}
                onEdit={onEdit}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
            <AlertDialogDescription>
              {hasReplies
                ? 'This comment has replies. It will be marked as deleted but replies will remain visible.'
                : 'This action cannot be undone. This will permanently delete your comment.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments: initialComments = [],
  currentUserId,
  onAddComment,
  onLikeComment,
  onDeleteComment,
}) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Get current user data
  const currentUser = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('📌 Current user from localStorage:', user);
      return user;
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    if (initialComments && initialComments.length > 0) {
      setComments(initialComments);
      setInitialLoad(true);
    } else if (postId && !initialLoad) {
      // Fetch comments if not provided
      const fetchInitialComments = async () => {
        console.log('🔄 [CommentSection] Fetching initial comments for postId:', postId);
        setLoading(true);
        try {
          const data = await commentService.getComments(postId, { page: 1, limit: 20 });
          console.log('✅ [CommentSection] Comments fetched:', data);
          setComments(data.comments);
          setHasMore(data.hasNextPage);
          setInitialLoad(true);
        } catch (error: any) {
          console.error('❌ [CommentSection] Failed to fetch comments:', {
            postId,
            error: error?.message || error,
            response: error?.response,
          });
          toast.error('Failed to load comments');
        } finally {
          setLoading(false);
        }
      };
      fetchInitialComments();
    }
  }, [postId, initialComments, initialLoad]);

  const loadMoreComments = async () => {
    if (!postId) {
      console.warn('⚠️ [CommentSection] No postId provided for loadMoreComments');
      return;
    }

    console.log('🔄 [CommentSection] Loading more comments, page:', page + 1);
    setLoading(true);
    try {
      const data = await commentService.getComments(postId, { page: page + 1, limit: 20 });
      console.log('✅ [CommentSection] More comments loaded:', data);
      setComments(prev => [...prev, ...data.comments]);
      setPage(page + 1);
      setHasMore(data.hasNextPage);
    } catch (error: any) {
      console.error('❌ [CommentSection] Load more error:', {
        postId,
        page: page + 1,
        error: error?.message || error,
      });
      toast.error('Failed to load more comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting || !postId) return;

    const optimisticComment: Comment = {
      _id: `temp-${Date.now()}`,
      content: newComment,
      author: {
        _id: currentUserId || currentUser._id || 'unknown',
        username: currentUser.username || 'You',
        firstName: currentUser.firstName || currentUser.fullName?.split(' ')[0] || 'You',
        lastName: currentUser.lastName || currentUser.fullName?.split(' ')[1] || '',
        avatar: currentUser.avatar,
      },
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
      replies: [],
      repliesCount: 0,
    };

    setComments(prev => [optimisticComment, ...prev]);
    const content = newComment;
    setNewComment('');
    setIsSubmitting(true);

    try {
      const newCommentData = await commentService.addComment(postId, { content });
      setComments(prev => prev.map(c => (c._id === optimisticComment._id ? newCommentData : c)));
      await onAddComment?.(postId, content);
      toast.success('Comment posted!');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Add comment error:', error);
      setComments(prev => prev.filter(c => c._id !== optimisticComment._id));
      setNewComment(content);
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentCommentId: string, content: string) => {
    if (!postId) return;

    const optimisticReply: Comment = {
      _id: `temp-${Date.now()}`,
      content,
      author: {
        _id: currentUserId || currentUser._id || 'unknown',
        username: currentUser.username || 'You',
        firstName: currentUser.firstName || currentUser.fullName?.split(' ')[0] || 'You',
        lastName: currentUser.lastName || currentUser.fullName?.split(' ')[1] || '',
        avatar: currentUser.avatar,
      },
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
      replies: [],
      repliesCount: 0,
      parentComment: parentCommentId,
    };

    setComments(prev => {
      const addReply = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment._id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), optimisticReply],
              repliesCount: (comment.repliesCount || 0) + 1,
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: addReply(comment.replies) };
          }
          return comment;
        });
      };
      return addReply(prev);
    });

    try {
      const newReply = await commentService.addComment(postId, {
        content,
        parentComment: parentCommentId,
      });
      setComments(prev => {
        const replaceReply = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment.replies?.some(r => r._id === optimisticReply._id)) {
              return {
                ...comment,
                replies: comment.replies.map(r => (r._id === optimisticReply._id ? newReply : r)),
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: replaceReply(comment.replies) };
            }
            return comment;
          });
        };
        return replaceReply(prev);
      });
      await onAddComment?.(postId, content, parentCommentId);
      toast.success('Reply posted!');
    } catch (error) {
      console.error('Reply error:', error);
      setComments(prev => {
        const removeReply = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment._id === parentCommentId) {
              return {
                ...comment,
                replies: (comment.replies || []).filter(r => r._id !== optimisticReply._id),
                repliesCount: Math.max(0, (comment.repliesCount || 0) - 1),
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: removeReply(comment.replies) };
            }
            return comment;
          });
        };
        return removeReply(prev);
      });
      toast.error('Failed to post reply');
      throw error;
    }
  };

  const handleLike = async (commentId: string) => {
    setComments(prev => {
      const updateLike = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment._id === commentId) {
            return {
              ...comment,
              isLiked: !comment.isLiked,
              likesCount: comment.isLiked
                ? Math.max(0, comment.likesCount - 1)
                : comment.likesCount + 1,
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: updateLike(comment.replies) };
          }
          return comment;
        });
      };
      return updateLike(prev);
    });

    try {
      await commentService.toggleCommentLike(commentId);
      await onLikeComment?.(commentId);
    } catch (error) {
      console.error('Like comment error:', error);
      setComments(prev => {
        const revertLike = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
            if (comment._id === commentId) {
              return {
                ...comment,
                isLiked: !comment.isLiked,
                likesCount: comment.isLiked
                  ? comment.likesCount + 1
                  : Math.max(0, comment.likesCount - 1),
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: revertLike(comment.replies) };
            }
            return comment;
          });
        };
        return revertLike(prev);
      });
      toast.error('Failed to like comment');
    }
  };

  const handleDelete = async (commentId: string, hasReplies: boolean) => {
    const previousComments = [...comments];

    setComments(prev => {
      const deleteComment = (comments: Comment[]): Comment[] => {
        return comments
          .map(comment => {
            if (comment._id === commentId) {
              return hasReplies
                ? { ...comment, content: 'This comment was deleted', isDeleted: true }
                : (null as any);
            }
            if (comment.replies && comment.replies.length > 0) {
              return { ...comment, replies: deleteComment(comment.replies).filter(Boolean) };
            }
            return comment;
          })
          .filter(Boolean);
      };
      return deleteComment(prev);
    });

    try {
      await commentService.deleteComment(commentId);
      await onDeleteComment?.(commentId);
      toast.success('Comment deleted');
    } catch (error) {
      console.error('Delete comment error:', error);
      setComments(previousComments);
      toast.error('Failed to delete comment');
    }
  };

  const handleEdit = async (commentId: string, newContent: string) => {
    const previousComments = [...comments];

    setComments(prev => {
      const updateComment = (comments: Comment[]): Comment[] => {
        return comments.map(comment => {
          if (comment._id === commentId) {
            return { ...comment, content: newContent, isEdited: true };
          }
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: updateComment(comment.replies) };
          }
          return comment;
        });
      };
      return updateComment(prev);
    });

    try {
      await commentService.updateComment(commentId, { content: newContent });
      toast.success('Comment updated');
    } catch (error) {
      console.error('Edit comment error:', error);
      setComments(previousComments);
      toast.error('Failed to update comment');
      throw error;
    }
  };

  return (
    <Card className="border-none shadow-soft bg-gradient-card backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Add Comment */}
          <div className="flex space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={currentUser.avatar || currentUser.profilePicture}
                alt={currentUser.username}
              />
              <AvatarFallback className="text-xs">
                {(
                  currentUser.firstName?.[0] ||
                  currentUser.fullName?.[0] ||
                  currentUser.username?.[0] ||
                  'U'
                ).toUpperCase()}
                {(currentUser.lastName?.[0] || '').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Textarea
                ref={inputRef}
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                maxLength={1000}
                className="min-h-[80px] border-none bg-muted/30 focus-visible:ring-0"
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{newComment.length}/1000</span>
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
              <>
                <AnimatePresence>
                  {comments.map(comment => (
                    <CommentItem
                      key={comment._id}
                      comment={comment}
                      currentUserId={currentUserId}
                      onLike={handleLike}
                      onDelete={handleDelete}
                      onReply={handleReply}
                      onEdit={handleEdit}
                      depth={0}
                    />
                  ))}
                </AnimatePresence>

                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button variant="ghost" size="sm" onClick={loadMoreComments} disabled={loading}>
                      {loading ? 'Loading...' : 'Load More Comments'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
