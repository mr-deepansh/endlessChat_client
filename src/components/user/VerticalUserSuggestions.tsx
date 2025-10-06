import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { UserPlus, Users, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import userService, { User } from '../../services/userService';
import { followService } from '../../services/followService';
import { toast } from '../../hooks/use-toast';

interface VerticalUserSuggestionsProps {
  currentUserId?: string;
  onUserFollow?: (userId: string) => void;
  limit?: number;
}

const VerticalUserSuggestions: React.FC<VerticalUserSuggestionsProps> = ({
  currentUserId,
  onUserFollow,
  limit = 4,
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
      const response = await userService.getAllUsers(1, limit + 2);
      const filteredUsers = response.users
        .filter(user => user._id !== currentUserId && user.isActive)
        .slice(0, limit);
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

  if (loading) {
    return (
      <Card className="border-none shadow-soft bg-gradient-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Who to follow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </div>
              <div className="w-20 h-8 bg-muted rounded animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return null;
  }

  return (
    <Card className="border-none shadow-soft bg-gradient-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Who to follow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map(user => (
          <div
            key={user._id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Link to={`/profile/${user._id}`}>
              <Avatar className="w-12 h-12 ring-2 ring-primary/20 hover:ring-primary/40 transition-smooth">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {user.firstName?.[0] || user.username?.[0] || 'U'}
                  {user.lastName?.[0] || ''}
                </AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              <Link to={`/profile/${user._id}`} className="group block">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-smooth truncate">
                  {user.firstName} {user.lastName}
                </h4>
                <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
              </Link>

              {user.bio && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{user.bio}</p>
              )}

              <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                <span>{user.followersCount} followers</span>
                <span>{user.postsCount || 0} posts</span>
              </div>

              <div className="flex items-center space-x-2 mt-3">
                <Button
                  variant={followingStates[user._id] ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => handleFollow(user._id)}
                  disabled={followLoading[user._id]}
                  className="text-xs px-3 py-1 h-7"
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
                  <Button variant="ghost" size="sm" className="text-xs px-3 py-1 h-7">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-3 border-t border-border/50">
          <Link
            to="/discover"
            className="text-sm text-primary hover:text-primary/80 transition-smooth block text-center"
          >
            Show more suggestions
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerticalUserSuggestions;
