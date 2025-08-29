import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  User,
  Heart,
  MessageCircle,
  UserPlus,
  Repeat2,
  Settings,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Skeleton } from '../components/ui/skeleton';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';

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
  <div className="flex items-center space-x-3 p-4 border-b border-border/50">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-1">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-2 w-1/2" />
    </div>
    <Skeleton className="h-2 w-16" />
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
}> = ({ notification, onMarkRead, onDelete }) => {
  const timeAgo = new Date(notification.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`flex items-center space-x-3 p-4 border-b border-border/50 hover:bg-muted/30 transition-colors ${
        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
      }`}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification.from.avatar} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
            {notification.from.firstName?.[0]}
            {notification.from.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-0.5">
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">
          <span className="font-medium">
            {notification.from.firstName} {notification.from.lastName}
          </span>
          <span className="text-muted-foreground ml-1">{getNotificationMessage(notification)}</span>
        </p>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>

      <div className="flex items-center space-x-1">
        {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMarkRead(notification._id)}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <Check className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

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
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      },
      to: user?._id || '',
      postId: '1',
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      postContent: 'Just launched my new project! Excited to share it with the community.',
      postImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop',
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
        avatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612c8e8?w=400&h=400&fit=crop&crop=face',
      },
      to: user?._id || '',
      isRead: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
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
        avatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      },
      to: user?._id || '',
      postId: '2',
      isRead: true,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      postContent: 'Beautiful sunset from my morning run! 🌅',
      postImage:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
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
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face',
      },
      to: user?._id || '',
      postId: '3',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      postContent: 'Hot take: TypeScript is not just JavaScript with types...',
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
        avatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      },
      to: user?._id || '',
      commentId: '1',
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
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
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      },
      to: user?._id || '',
      postId: '4',
      isRead: true,
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      postContent: 'Great discussion with @you about React best practices!',
    },
    // Add more mock notifications for enterprise scale
    ...Array.from({ length: 20 }, (_, i) => ({
      _id: `mock-${i + 7}`,
      type: ['like', 'comment', 'follow'][i % 3] as any,
      message: 'interacted with your content',
      from: {
        _id: `user-${i + 7}`,
        username: `user${i + 7}`,
        firstName: `User`,
        lastName: `${i + 7}`,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + i}?w=100&h=100&fit=crop&crop=face`,
      },
      to: user?._id || '',
      isRead: i % 3 === 0,
      createdAt: new Date(Date.now() - (i + 1) * 60 * 60 * 1000).toISOString(),
    })),
  ];

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
    toast({
      title: 'All notifications marked as read',
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
    toast({
      title: 'Notifications refreshed',
      description: 'Your notifications have been updated.',
    });
  };

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'follows':
        return notifications.filter(n => n.type === 'follow' || n.type === 'unfollow');
      case 'interactions':
        return notifications.filter(n => ['like', 'comment', 'repost', 'mention'].includes(n.type));
      default:
        return notifications;
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-primary" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold gradient-text">Notifications</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllRead} variant="outline" size="sm">
                <CheckCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {['all', 'unread', 'interactions', 'follows'].map(filter => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="capitalize"
            >
              {filter === 'interactions' ? 'Activity' : filter}
            </Button>
          ))}
        </div>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <div>
                {Array.from({ length: 8 }).map((_, i) => (
                  <NotificationSkeleton key={i} />
                ))}
              </div>
            ) : getFilteredNotifications().length === 0 ? (
              <div className="text-center py-16">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground text-sm">
                  {activeFilter === 'all'
                    ? "You're all caught up!"
                    : `No ${activeFilter} notifications.`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {getFilteredNotifications().map(notification => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Notifications;
