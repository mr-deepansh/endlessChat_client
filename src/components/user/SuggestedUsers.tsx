import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { UserPlus, Users, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import userService, { User } from '../../services/userService';
import { followService } from '../../services/followService';
import { toast } from '../../hooks/use-toast';

interface SuggestedUsersProps {
  currentUserId?: string;
  onUserFollow?: (userId: string) => void;
  limit?: number;
}

const SuggestedUsers: React.FC<SuggestedUsersProps> = ({
  currentUserId,
  onUserFollow,
  limit = 5,
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
      const response = await userService.getAllUsers(1, limit);
      const filteredUsers = response.users.filter(
        user => user._id !== currentUserId && user.isActive
      );
      setUsers(filteredUsers);

      // Initialize following states
      const states: Record<string, boolean> = {};
      filteredUsers.forEach(user => {
        states[user._id] = user.isFollowing || false;
      });
      setFollowingStates(states);
    } catch (_error) {
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

        // Update user's followers count
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

  if (loading) {
    return (
      <Card className="border-none shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Suggested for you</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                </div>
                <div className="w-16 h-8 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <Card className="border-none shadow-soft bg-gradient-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Suggested for you
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user._id} className="flex items-center space-x-3">
              <Link to={`/profile/${user._id}`}>
                <Avatar className="w-10 h-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-smooth">
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback className="bg-gradient-primary text-white text-sm">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/profile/${user._id}`} className="group">
                  <p className="font-medium text-sm text-foreground group-hover:text-primary transition-smooth truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  {user.role === 'admin' && (
                    <Badge variant="secondary" className="text-xs bg-gradient-primary text-white">
                      Admin
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {user.followersCount} followers
                  </span>
                </div>
              </div>

              <Button
                variant={followingStates[user._id] ? 'outline' : 'default'}
                size="sm"
                onClick={() => handleFollow(user._id)}
                disabled={followLoading[user._id]}
                className="text-xs px-3 py-1"
              >
                {followLoading[user._id] ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : followingStates[user._id] ? (
                  'Following'
                ) : (
                  <>
                    <UserPlus className="w-3 h-3 mr-1" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
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

export default SuggestedUsers;
