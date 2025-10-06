import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { UserPlus, Users, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import userService, { User } from '../../services/userService';
import { followService } from '../../services/followService';
import { toast } from '../../hooks/use-toast';

interface FeedUserSuggestionsProps {
  currentUserId?: string;
  onUserFollow?: (userId: string) => void;
  onDismiss?: () => void;
}

const FeedUserSuggestions: React.FC<FeedUserSuggestionsProps> = ({
  currentUserId,
  onUserFollow,
  onDismiss,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadSuggestedUsers();
  }, []);

  const loadSuggestedUsers = async () => {
    try {
      const response = await userService.getAllUsers(1, 5);
      const filteredUsers = response.users
        .filter(user => user._id !== currentUserId && user.isActive)
        .slice(0, 3);
      setUsers(filteredUsers);

      const states: Record<string, boolean> = {};
      filteredUsers.forEach(user => {
        states[user._id] = user.isFollowing || false;
      });
      setFollowingStates(states);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    setFollowLoading(prev => ({ ...prev, [userId]: true }));

    try {
      const isCurrentlyFollowing = followingStates[userId];
      const response = isCurrentlyFollowing
        ? await followService.unfollowUser(userId)
        : await followService.followUser(userId);

      if (response.success) {
        setFollowingStates(prev => ({
          ...prev,
          [userId]: !isCurrentlyFollowing,
        }));

        setUsers(prev =>
          prev.map(user =>
            user._id === userId
              ? {
                  ...user,
                  followersCount: response.data?.followersCount || user.followersCount,
                  isFollowing: !isCurrentlyFollowing,
                }
              : user
          )
        );

        onUserFollow?.(userId);

        toast({
          title: isCurrentlyFollowing ? 'Unfollowed' : 'Following',
          description: response.message,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update follow status',
        variant: 'destructive',
      });
    } finally {
      setFollowLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (loading || users.length === 0) {
    return null;
  }

  return (
    <Card className="border-none shadow-soft bg-gradient-card mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Suggested for you
          </CardTitle>
          {onDismiss && (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {users.map(user => (
            <div
              key={user._id}
              className="flex flex-col items-center p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <Link to={`/profile/${user._id}`}>
                <Avatar className="w-16 h-16 ring-2 ring-primary/20 hover:ring-primary/40 transition-smooth mb-3">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {user.firstName?.[0] || user.username?.[0] || 'U'}
                    {user.lastName?.[0] || ''}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="text-center mb-3">
                <Link to={`/profile/${user._id}`} className="group">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-smooth">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground">@{user.username}</p>
                </Link>

                <div className="flex items-center justify-center space-x-2 mt-2 text-xs text-muted-foreground">
                  <span>{user.followersCount} followers</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full">
                <Button
                  variant={followingStates[user._id] ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => handleFollow(user._id)}
                  disabled={followLoading[user._id]}
                  className="flex-1 text-xs"
                >
                  {followLoading[user._id] ? (
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : followingStates[user._id] ? (
                    'Following'
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3 mr-1" />
                      Follow
                    </>
                  )}
                </Button>

                <Link to={`/profile/${user._id}`}>
                  <Button variant="ghost" size="sm" className="text-xs px-2">
                    <Eye className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 text-center">
          <Link
            to="/discover"
            className="text-sm text-primary hover:text-primary/80 transition-smooth"
          >
            See all suggestions →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedUserSuggestions;
