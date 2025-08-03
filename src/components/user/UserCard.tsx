import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, UserCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  location?: string;
  isFollowing?: boolean;
}

interface UserCardProps {
  user: User;
  currentUserId?: string;
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  showFullProfile?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  currentUserId,
  onFollow,
  onUnfollow,
  showFullProfile = false,
}) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(user.followersCount);

  const isOwnProfile = currentUserId === user._id;

  const handleFollowToggle = () => {
    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    setFollowersCount(prev => newIsFollowing ? prev + 1 : prev - 1);

    if (newIsFollowing) {
      onFollow?.(user._id);
    } else {
      onUnfollow?.(user._id);
    }
  };

  return (
    <Card className="border-none shadow-soft hover:shadow-primary/10 transition-smooth bg-gradient-card backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Link to={`/profile/${user._id}`}>
            <Avatar className="w-16 h-16 ring-2 ring-primary/20 hover:ring-primary/40 transition-smooth">
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback className="bg-gradient-primary text-white text-lg">
                {user.firstName[0]}{user.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Link to={`/profile/${user._id}`} className="group">
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-smooth truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-muted-foreground text-sm">@{user.username}</p>
                </Link>

                <div className="flex items-center space-x-2 mt-2">
                  {user.role === 'admin' && (
                    <Badge variant="secondary" className="bg-gradient-primary text-white">
                      Admin
                    </Badge>
                  )}
                  {!user.isActive && (
                    <Badge variant="destructive">
                      Suspended
                    </Badge>
                  )}
                </div>
              </div>

              {!isOwnProfile && (
                <Button
                  variant={isFollowing ? "unfollow" : "follow"}
                  size="sm"
                  onClick={handleFollowToggle}
                  className="ml-4"
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 mr-1" />
                      Following
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-1" />
                      Follow
                    </>
                  )}
                </Button>
              )}
            </div>

            {user.bio && (
              <p className="text-foreground mt-3 leading-relaxed">
                {user.bio}
              </p>
            )}

            <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 mt-4">
              <Link 
                to={`/profile/${user._id}/following`}
                className="text-sm hover:text-primary transition-smooth"
              >
                <span className="font-semibold text-foreground">{user.followingCount}</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </Link>
              <Link 
                to={`/profile/${user._id}/followers`}
                className="text-sm hover:text-primary transition-smooth"
              >
                <span className="font-semibold text-foreground">{followersCount}</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </Link>
            </div>
          </div>
        </div>

        {showFullProfile && (
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{followersCount}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{user.followingCount}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserCard;