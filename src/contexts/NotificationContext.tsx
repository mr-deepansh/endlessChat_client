import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { toast } from '../hooks/use-toast';
import { useNotificationSound } from '../hooks/useNotificationSound';
import { showNotificationToast } from '../components/notifications/NotificationToast';
import { useAuth } from './AuthContext';

export interface Notification {
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

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refreshing: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  getFilteredNotifications: (filter: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { playNotificationSound } = useNotificationSound();

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.notifications || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast({
        title: 'All notifications marked as read',
        description: "You're all caught up!",
      });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  }, []);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await notificationService.deleteNotification(notificationId);
        const deletedNotification = notifications.find(n => n._id === notificationId);
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } catch (error) {
        console.error('Failed to delete notification:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete notification',
          variant: 'destructive',
        });
      }
    },
    [notifications]
  );

  const refreshNotifications = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
    toast({
      title: 'Notifications refreshed',
      description: 'Your notifications have been updated.',
    });
  }, [loadNotifications]);

  const getFilteredNotifications = useCallback(
    (filter: string) => {
      switch (filter) {
        case 'unread':
          return notifications.filter(n => !n.isRead);
        case 'follows':
          return notifications.filter(n => n.type === 'follow' || n.type === 'unfollow');
        case 'interactions':
          return notifications.filter(n =>
            ['like', 'comment', 'repost', 'mention'].includes(n.type)
          );
        default:
          return notifications;
      }
    },
    [notifications]
  );

  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [loadNotifications, isAuthenticated, user]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    refreshing,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    getFilteredNotifications,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
