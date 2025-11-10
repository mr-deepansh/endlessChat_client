import { useState, useCallback } from 'react';
import commentService from '@/services/commentService';
import { toast } from '@/hooks/use-toast';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export function useComments(postId: string, initialComments: Comment[] = []) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [loading, setLoading] = useState(false);

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await commentService.getComments(postId, { limit: 10 });
      setComments(data.comments);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load comments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const addComment = useCallback(
    async (content: string) => {
      try {
        const newComment = await commentService.addComment(postId, { content });
        setComments(prev => [...prev, newComment]);
        toast({ title: 'Success', description: 'Comment posted' });
        return newComment;
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to post comment',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [postId]
  );

  const likeComment = useCallback(async (commentId: string) => {
    try {
      const result = await commentService.toggleCommentLike(commentId);
      setComments(prev =>
        prev.map(c =>
          c._id === commentId ? { ...c, isLiked: result.isLiked, likesCount: result.likesCount } : c
        )
      );
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to like comment',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast({ title: 'Success', description: 'Comment deleted' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete comment',
        variant: 'destructive',
      });
      throw error;
    }
  }, []);

  return {
    comments,
    loading,
    loadComments,
    addComment,
    likeComment,
    deleteComment,
  };
}
