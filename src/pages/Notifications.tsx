import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Bell, Check, CheckCheck, Trash2, User, Heart, MessageCircle, Share, UserPlus, Repeat2, Eye, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'repost' | 'mention' | 'comment_like' | 'unfollow';
  message: string;
  from: {
    _id: string;
    avatar?: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  to: string;
  postId?: string;
  commentId?: string;
  isRead: boolean;
  createdAt: string;
  postContent?: string;
  postImage?: string;
}

const NotificationSkeleton = () => (
  <div className="flex items-start space-x-4 p-4 border-b border-border">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-16 w-16 rounded" />
  </div>
);

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="h-4 w-4 text-red-500 fill-current" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case 'follow':
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case 'unfollow':
      return <User className="h-4 w-4 text-gray-500" />;
    case 'repost':
      return <Repeat2 className="h-4 w-4 text-purple-500" />;
    case 'mention':
      return <User className="h-4 w-4 text-orange-500" />;
    case 'comment_like':
      return <Heart className="h-3 w-3 text-red-500 fill-current" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

const getNotificationMessage = (notification: Notification) => {
  switch (notification.type) {
    case 'like':
      return 'liked your post';
    case 'comment':
      return 'commented on your post';
    case 'follow':
      return 'started following you';
    case 'unfollow':
      return 'unfollowed you';
    case 'repost':
      return 'reposted your post';
    case 'mention':
      return 'mentioned you in a post';
    case 'comment_like':
      return 'liked your comment';
    default:
      return notification.message;
  }
};

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
}> = ({ notification, onMarkRead, onDelete, onFollow, onUnfollow }) => {
  const [isFollowing, setIsFollowing] = useState(notification.type === 'follow');

  const handleFollowToggle = () => {
    if (isFollowing) {
      onUnfollow(notification.from._id);
      setIsFollowing(false);
      toast({
        title: "Unfollowed",
        description: `You unfollowed ${notification.from.firstName} ${notification.from.lastName}`,
      });
    } else {
      onFollow(notification.from._id);
      setIsFollowing(true);
      toast({
        title: "Following",
        description: `You are now following ${notification.from.firstName} ${notification.from.lastName}`,
      });
    }
  };

  return (
    <div className={`flex items-start space-x-4 p-4 border-b border-border transition-all duration-200 hover:bg-muted/30 ${
      !notification.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : ''
    }`}>
      <div className="relative">
        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
          <AvatarImage src={notification.from.avatar} alt={notification.from.username} />
          <AvatarFallback className="bg-gradient-primary text-white">
            {notification.from.firstName?.[0]}{notification.from.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm">
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{notification.from.firstName} {notification.from.lastName}</span>
              {' '}
              <span className="text-muted-foreground">{getNotificationMessage(notification)}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </p>
            {notification.postContent && (
              <p className="text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded italic">
                "{notification.postContent.substring(0, 100)}..."
              </p>
            )}
          </div>

          {/* Post thumbnail or follow button */}
          <div className="ml-4 flex items-center space-x-2">
            {(notification.type === 'follow' || notification.type === 'unfollow') && (
              <Button
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                onClick={handleFollowToggle}
                className="text-xs px-3 py-1"
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            )}
            
            {notification.postImage && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <img 
                  src={notification.postImage} 
                  alt="Post" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {!notification.postImage && (notification.type === 'like' || notification.type === 'comment' || notification.type === 'repost') && (
              <div className="w-16 h-16 rounded-lg bg-gradient-primary/10 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkRead(notification._id)}
              className="h-7 px-2 text-xs hover:bg-primary/10 text-primary"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification._id)}
            className="h-7 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Mock notifications data (Instagram-like)
  const mockNotifications: Notification[] = [
    {
      _id: '1',
      type: 'like',
      message: 'liked your post',
      from: {
        _id: '2',
        username: 'johndev',
        firstName: 'John',
        lastName: 'Developer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
      },
      to: user?._id || '',
      postId: '1',
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      postContent: 'Just launched my new project! Excited to share it with the community.',
      postImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop'
    },
    {
      _id: '2',
      type: 'follow',
      message: 'started following you',
      from: {
        _id: '3',
        username: 'sarahdesign',
        firstName: 'Sarah',
        lastName: 'Designer',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c8e8?w=400&h=400&fit=crop&crop=face'
      },
      to: user?._id || '',
      isRead: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    },
    {
      _id: '3',
      type: 'comment',
      message: 'commented on your post',
      from: {
        _id: '4',
        username: 'mikecoding',
        firstName: 'Mike',
        lastName: 'Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
      },
      to: user?._id || '',
      postId: '2',
      isRead: true,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      postContent: 'Beautiful sunset from my morning run! 🌅',
      postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
    },
    {
      _id: '4',
      type: 'repost',
      message: 'reposted your post',
      from: {
        _id: '5',
        username: 'alextech',
        firstName: 'Alex',
        lastName: 'Tech',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face'
      },
      to: user?._id || '',
      postId: '3',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      postContent: 'Hot take: TypeScript is not just JavaScript with types...'
    },
    {
      _id: '5',
      type: 'comment_like',
      message: 'liked your comment',
      from: {
        _id: '6',
        username: 'emmaui',
        firstName: 'Emma',
        lastName: 'UI Designer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face'
      },
      to: user?._id || '',
      commentId: '1',
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: '6',
      type: 'mention',
      message: 'mentioned you in a post',
      from: {
        _id: '7',
        username: 'davidcode',
        firstName: 'David',
        lastName: 'Coder',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face'
      },
      to: user?._id || '',
      postId: '4',
      isRead: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      postContent: 'Great discussion with @you about React best practices!'
    }
  ];

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast({
      title: "All notifications marked as read",
      description: "You're all caught up!",
    });
  };

  const handleDelete = async (notificationId: string) => {
    const deletedNotification = notifications.find(n => n._id === notificationId);
    setNotifications(prev => prev.filter(n => n._id !== notificationId));
    if (deletedNotification && !deletedNotification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleFollow = async (userId: string) => {
    // Simulate follow API call
    console.log('Following user:', userId);
  };

  const handleUnfollow = async (userId: string) => {
    // Simulate unfollow API call
    console.log('Unfollowing user:', userId);
  };

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'follows':
        return notifications.filter(n => n.type === 'follow' || n.type === 'unfollow');
      case 'likes':
        return notifications.filter(n => n.type === 'like' || n.type === 'comment_like');
      case 'comments':
        return notifications.filter(n => n.type === 'comment' || n.type === 'mention');
      default:
        return notifications;
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-8 w-8 text-primary" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your activity</p>
            </div>
          </div>

          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllRead} variant="outline" size="sm">
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted/30">
            <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
            <TabsTrigger value="follows" className="text-sm">Follows</TabsTrigger>
            <TabsTrigger value="likes" className="text-sm">Likes</TabsTrigger>
            <TabsTrigger value="comments" className="text-sm">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card className="border-none shadow-soft bg-gradient-card backdrop-blur-sm">
              <CardContent className="p-0">
                {loading ? (
                  <div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <NotificationSkeleton key={i} />
                    ))}
                  </div>
                ) : getFilteredNotifications().length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No notifications</h3>
                    <p className="text-muted-foreground">
                      {activeTab === 'all' 
                        ? "When you get notifications, they'll show up here."
                        : `No ${activeTab} notifications yet.`
                      }
                    </p>
                  </div>
                ) : (
                  <div>
                    {getFilteredNotifications().map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                        onMarkRead={handleMarkRead}
                        onDelete={handleDelete}
                        onFollow={handleFollow}
                        onUnfollow={handleUnfollow}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default Notifications;