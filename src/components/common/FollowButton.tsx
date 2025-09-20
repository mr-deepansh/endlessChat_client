import { Loader2, UserMinus, UserPlus } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../hooks/use-toast';
import { followService } from '../../services/followService';
import { Button } from '../ui/button';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollowChange?: (isFollowing: boolean, followersCount?: number) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  isFollowing,
  onFollowChange,
  variant = 'default',
  size = 'default',
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const { user: currentUser, refreshUserAfterFollow } = useAuth();

  const handleFollow = async () => {
    if (loading) return; // Prevent multiple clicks
    
    setLoading(true);

    try {
      // Backend now handles toggle, so always use followUser
      const response = await followService.followUser(userId);

      if (response.success) {
        // Backend returns the new state in response.data.isFollowing
        const newFollowingState = response.data?.isFollowing ?? !isFollowing;
        
        // Refresh current user data to get updated following count
        await refreshUserAfterFollow();
        
        // Call the callback to update parent component
        onFollowChange?.(newFollowingState, response.data?.followersCount);

        toast({
          title: newFollowingState ? 'Following' : 'Unfollowed',
          description: response.message,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Follow action failed:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update follow status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : variant}
      size={size}
      onClick={handleFollow}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="w-4 h-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="w-4 h-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
};
