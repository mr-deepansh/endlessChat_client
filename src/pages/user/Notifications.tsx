import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import LeftSidebar from '../../components/layout/LeftSidebar';
import { usePageTitle } from '../../hooks/usePageTitle';
import { notificationService } from '../../services';
import type { Notification } from '../../services/notificationService';
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
  RefreshCw,
  MoreHorizontal,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Skeleton } from '../../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

const NotificationSkeleton = () => (
  <div className="flex items-start space-x-4 p-6 animate-pulse">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="flex-1 space-y-3">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
    <Skeleton className="h-8 w-8 rounded-full" />
  </div>
);

const getNotificationIcon = (type: string) => {
  const iconClass = 'h-5 w-5';
  switch (type) {
    case 'like':
      return <Heart className={`${iconClass} text-red-500 fill-current`} />;
    case 'comment':
      return <MessageCircle className={`${iconClass} text-blue-500`} />;
    case 'follow':
      return <UserPlus className={`${iconClass} text-green-500`} />;
    case 'unfollow':
      return <User className={`${iconClass} text-gray-500`} />;
    case 'repost':
      return <Repeat2 className={`${iconClass} text-purple-500`} />;
    case 'mention':
      return <User className={`${iconClass} text-orange-500`} />;
    case 'comment_like':
      return <Heart className={`${iconClass} text-red-500 fill-current`} />;
    default:
      return <Bell className={`${iconClass} text-muted-foreground`} />;
  }
};

const getNotificationMessage = (notification: Notification) => {
  // Debug log to check notification data
  console.log('Notification data:', {
    type: notification.type,
    from: notification.from,
    message: notification.message,
    postId: notification.postId,
  });

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
      return notification.message || 'interacted with your content';
  }
};

const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkRead, onDelete }) => {
  const _navigate = useNavigate();
  const timeAgo = getTimeAgo(notification.createdAt);
  const [isHovered, setIsHovered] = useState(false);

  const handleNotificationClick = () => {
    // Mark as read when clicked
    if (!notification.isRead) {
      onMarkRead(notification._id);
    }

    // Navigate based on notification type
    if (notification.type === 'follow' || notification.type === 'unfollow') {
      // Navigate to user profile
      navigate(`/u/${notification.from.username}`);
    } else {
      // Navigate to specific post
      const postId =
        notification.postId || notification.data?.postId?._id || notification.data?.postId;
      if (postId) {
        navigate(`/post/${postId}`);
      } else {
        navigate(`/u/${notification.from.username}`);
      }
    }
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/u/${notification.from.username}`);
  };

  return (
    <div
      className={`group relative flex items-start space-x-3 sm:space-x-4 p-3 sm:p-2 transition-all duration-200 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 ${
        !notification.isRead
          ? 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/30 dark:to-purple-950/30 border-l-2 sm:border-l-2 border-l-blue-500'
          : 'hover:bg-muted/30'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNotificationClick}
    >
      {/* Avatar with notification icon */}
      <div className="relative flex-shrink-0">
        <Avatar
          className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-background shadow-sm cursor-pointer hover:ring-primary/50 transition-all"
          onClick={handleUserClick}
        >
          <AvatarImage src={notification.from?.avatar?.url || notification.from?.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm sm:text-base">
            {notification.from?.firstName?.[0] || notification.from?.username?.[0] || 'U'}
            {notification.from?.lastName?.[0] || ''}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 bg-background rounded-full p-0.5 sm:p-1 shadow-sm border">
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <span
              className="font-semibold text-foreground text-sm sm:text-base hover:text-primary cursor-pointer transition-colors"
              onClick={handleUserClick}
            >
              {notification.from?.firstName || notification.from?.username || 'Unknown'}{' '}
              {notification.from?.lastName || ''}
            </span>
            <span className="text-muted-foreground text-xs sm:text-sm">
              {getNotificationMessage(notification)}
            </span>
          </div>
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <span className="text-xs text-muted-foreground font-medium">{timeAgo}</span>
            {!notification.isRead && (
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Post preview if available */}
        {notification.postContent && (
          <div
            className="bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl p-3 sm:p-4 border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group/preview"
            onClick={e => {
              e.stopPropagation();
              const postId =
                notification.postId || notification.data?.postId?._id || notification.data?.postId;
              if (postId) {
                navigate(`/post/${postId}`);
              }
            }}
          >
            <div className="flex items-start space-x-3 sm:space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-foreground/80 line-clamp-2 group-hover/preview:text-foreground transition-colors">
                  {notification.postContent}
                </p>
                {notification.postImage && (
                  <div className="mt-2 text-xs text-muted-foreground flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Photo attached</span>
                  </div>
                )}
              </div>
              {notification.postImage && (
                <div className="flex-shrink-0">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={notification.postImage}
                      alt="Post preview"
                      className="w-14 h-14 sm:w-18 sm:h-18 object-cover shadow-md border border-border/20 group-hover/preview:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/10 transition-colors duration-200"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className={`flex items-center space-x-1 transition-opacity duration-200 ${
          isHovered || !notification.isRead ? 'opacity-100' : 'opacity-60 sm:opacity-0'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              onMarkRead(notification._id);
            }}
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            title="Mark as read"
          >
            <Check className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-muted"
              onClick={e => e.stopPropagation()}
            >
              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 sm:w-48">
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onMarkRead(notification._id);
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              <span className="text-sm">Mark as read</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                navigate(`/u/${notification.from.username}`);
              }}
            >
              <User className="h-4 w-4 mr-2" />
              <span className="text-sm">View Profile</span>
            </DropdownMenuItem>
            {(notification.postId ||
              notification.data?.postId?._id ||
              notification.data?.postId) && (
              <DropdownMenuItem
                onClick={e => {
                  e.stopPropagation();
                  const postId =
                    notification.postId ||
                    notification.data?.postId?._id ||
                    notification.data?.postId;
                  navigate(`/post/${postId}`);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                <span className="text-sm">View Post</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                onDelete(notification._id);
              }}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="text-sm">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

function Notifications() {
  usePageTitle('Notifications');
  const _navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Load notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      console.log('Loading notifications...');
      const response = await notificationService.getNotifications();
      console.log('Notifications API response:', response);
      console.log('Sample notification data:', response.notifications?.[0]);
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (_error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => (n._id === id ? { ...n, isRead: true } : n)));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (_error) {}
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (_error) {}
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (_error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const refreshNotifications = async () => {
    try {
      setRefreshing(true);
      await loadNotifications();
    } finally {
      setRefreshing(false);
    }
  };

  const filteredNotifications = useMemo(() => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'interactions':
        return notifications.filter(n => ['like', 'comment', 'repost', 'mention'].includes(n.type));
      case 'follows':
        return notifications.filter(n => ['follow', 'unfollow'].includes(n.type));
      default:
        return notifications;
    }
  }, [notifications, activeTab]);

  const tabCounts = useMemo(() => {
    return {
      all: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      interactions: notifications.filter(n =>
        ['like', 'comment', 'repost', 'mention'].includes(n.type)
      ).length,
      follows: notifications.filter(n => ['follow', 'unfollow'].includes(n.type)).length,
    };
  }, [notifications]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-purple-950/30">
      <Navbar />
      <LeftSidebar />
      <div className="ml-60 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Header */}
          <div className="mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="relative">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg">
                    <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-2 border-background">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Notifications
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Stay updated with your latest activity
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshNotifications}
                  disabled={refreshing}
                  className="hover:bg-muted/80 dark:hover:bg-muted/60 border-border/50 hover:border-border transition-colors px-2 sm:px-3"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''} sm:mr-2`} />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>

                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-2 sm:px-3"
                  >
                    <CheckCheck className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Mark all read</span>
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="px-2">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setActiveTab('all')}>
                      <span className={activeTab === 'all' ? 'font-semibold' : ''}>All</span>
                      {tabCounts.all > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-4 w-auto min-w-[16px] px-1 text-xs flex items-center justify-center"
                        >
                          {tabCounts.all > 99 ? '99+' : tabCounts.all}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('unread')}>
                      <span className={activeTab === 'unread' ? 'font-semibold' : ''}>Unread</span>
                      {tabCounts.unread > 0 && (
                        <Badge className="ml-auto h-4 w-auto min-w-[16px] px-1 text-xs bg-red-500 flex items-center justify-center">
                          {tabCounts.unread > 99 ? '99+' : tabCounts.unread}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('interactions')}>
                      <span className={activeTab === 'interactions' ? 'font-semibold' : ''}>
                        Activity
                      </span>
                      {tabCounts.interactions > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-4 w-auto min-w-[16px] px-1 text-xs flex items-center justify-center"
                        >
                          {tabCounts.interactions > 99 ? '99+' : tabCounts.interactions}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab('follows')}>
                      <span className={activeTab === 'follows' ? 'font-semibold' : ''}>
                        Follows
                      </span>
                      {tabCounts.follows > 0 && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-4 w-auto min-w-[16px] px-1 text-xs flex items-center justify-center"
                        >
                          {tabCounts.follows > 99 ? '99+' : tabCounts.follows}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full">
            <div className="mt-0">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                {loading ? (
                  <CardContent className="p-0">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <NotificationSkeleton key={i} />
                    ))}
                  </CardContent>
                ) : filteredNotifications.length === 0 ? (
                  <CardContent className="p-16 text-center">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center">
                      <Bell className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">No notifications yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      {activeTab === 'all'
                        ? "You're all caught up! When you get new notifications, they'll appear here."
                        : `No ${activeTab} notifications found. Check back later for updates.`}
                    </p>
                  </CardContent>
                ) : (
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                      {filteredNotifications.map(notification => (
                        <NotificationItem
                          key={notification._id}
                          notification={notification}
                          onMarkRead={markAsRead}
                          onDelete={deleteNotification}
                        />
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
