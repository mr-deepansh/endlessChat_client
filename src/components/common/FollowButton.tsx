import React, { useState } from 'react';
import { Button } from '../ui/button';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { followService } from '../../services/followService';
import { toast } from '../../hooks/use-toast';

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

  const handleFollow = async () => {
    setLoading(true);

    try {
      const response = isFollowing
        ? await followService.unfollowUser(userId)
        : await followService.followUser(userId);

      if (response.success) {
        onFollowChange?.(!isFollowing, response.data?.followersCount);

        toast({
          title: isFollowing ? 'Unfollowed' : 'Following',
          description: response.message,
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
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
