import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, User, Heart, MessageCircle, Share, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { notificationService, Notification } from '@/services/notificationService';
import { useApi } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const NotificationSkeleton = () => (
  <div className="flex items-start space-x-4 p-4 border-b border-border">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
    <Skeleton className="h-8 w-8 rounded" />
  </div>
);

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="h-4 w-4 text-red-500" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case 'follow':
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case 'repost':
      return <Share className="h-4 w-4 text-purple-500" />;
    case 'mention':
      return <User className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ notification, onMarkRead, onDelete }) => {
  return (
    <div className={`flex items-start space-x-4 p-4 border-b border-border transition-colors hover:bg-muted/50 ${
      !notification.isRead ? 'bg-primary/5' : ''
    }`}>
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification.from.avatar} alt={notification.from.username} />
          <AvatarFallback>
            {notification.from.firstName?.[0]}{notification.from.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
          {getNotificationIcon(notification.type)}
        </div>
      </div>

      <div className="flex-1 space-y-1">
        <p className="text-sm text-foreground">
          <span className="font-medium">{notification.from.firstName} {notification.from.lastName}</span>
          {' '}
          <span className="text-muted-foreground">{notification.message}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        {!notification.isRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkRead(notification._id)}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(notification._id)}
          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { loading, execute } = useApi();

  const loadNotifications = async () => {
    const result = await execute(() => notificationService.getNotifications());
    if (result) {
      setNotifications(result.notifications);
      setUnreadCount(result.unreadCount);
    }
  };

  const handleMarkRead = async (notificationId: string) => {
    const result = await execute(() => notificationService.markAsRead(notificationId));
    if (result) {
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast({
        title: 'Notification marked as read',
        description: 'The notification has been marked as read.',
      });
    }
  };

  const handleMarkAllRead = async () => {
    const result = await execute(() => notificationService.markAllAsRead());
    if (result) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast({
        title: 'All notifications marked as read',
        description: 'All your notifications have been marked as read.',
      });
    }
  };

  const handleDelete = async (notificationId: string) => {
    const result = await execute(() => notificationService.deleteNotification(notificationId));
    if (result) {
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      const deletedNotification = notifications.find(n => n._id === notificationId);
      if (deletedNotification && !deletedNotification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      toast({
        title: 'Notification deleted',
        description: 'The notification has been deleted.',
      });
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-8 w-8 text-primary" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your latest activities
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllRead} variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button onClick={loadNotifications} variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-card border-none shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Activity</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {unreadCount} unread
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div>
              {Array.from({ length: 5 }).map((_, i) => (
                <NotificationSkeleton key={i} />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No notifications yet</h3>
              <p className="text-muted-foreground">
                When you get notifications, they'll show up here.
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
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
  );
}