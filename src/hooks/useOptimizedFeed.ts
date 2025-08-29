import { useState, useCallback, useMemo } from 'react';
import { throttle } from '../utils/throttle';

interface FeedState {
  posts: any[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}

export const useOptimizedFeed = () => {
  const [feedState, setFeedState] = useState<FeedState>({
    posts: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
  });

  // Throttled scroll handler
  const throttledScrollHandler = useMemo(
    () =>
      throttle(() => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 1000 &&
          feedState.hasMore &&
          !feedState.loading
        ) {
          // Load more logic here
        }
      }, 200),
    [feedState.hasMore, feedState.loading]
  );

  // Optimized post interaction handler
  const handlePostInteraction = useCallback((postId: string, type: string, data: any) => {
    setFeedState(prev => ({
      ...prev,
      posts: prev.posts.map(post => {
        if (post._id !== postId) return post;

        switch (type) {
          case 'like':
            return {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
            };
          case 'bookmark':
            return { ...post, isBookmarked: !post.isBookmarked };
          default:
            return post;
        }
      }),
    }));
  }, []);

  return {
    feedState,
    setFeedState,
    throttledScrollHandler,
    handlePostInteraction,
  };
};
