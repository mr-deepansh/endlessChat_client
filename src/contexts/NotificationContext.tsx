import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
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

    console.log('🔄 Loading notifications...');
    const response = await notificationService.getNotifications();

    if (response.success) {
      if (response.data.length > 0) {
        console.log('✅ Using API notifications:', response.data.length);
        setNotifications(response.data);
        setUnreadCount(response.data.filter(n => !n.isRead).length);
      } else {
        console.log('📦 API returned empty, using mock notifications');
        const mockNotifications = getMockNotifications();
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
      }
    } else {
      console.log('❌ API failed, using mock notifications');
      const mockNotifications = getMockNotifications();
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
    }
    setLoading(false);
  }, [isAuthenticated, user]);

  const markAsRead = useCallback(async (notificationId: string) => {
    // For mock notifications, just update locally
    if (notificationId.length < 10) {
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      return;
    }

    const result = await notificationService.markAsRead(notificationId);
    if (result.success) {
      setNotifications(prev =>
        prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const result = await notificationService.markAllAsRead();
    if (result.success) {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast({
        title: 'All notifications marked as read',
        description: "You're all caught up!",
      });
    } else {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  }, []);

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      // For mock notifications, just update locally
      if (notificationId.length < 10) {
        const deletedNotification = notifications.find(n => n._id === notificationId);
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        return;
      }

      const result = await notificationService.deleteNotification(notificationId);
      if (result.success) {
        const deletedNotification = notifications.find(n => n._id === notificationId);
        setNotifications(prev => prev.filter(n => n._id !== notificationId));
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      } else {
        toast({
          title: 'Error',
          description: result.message,
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

// Mock data function
const getMockNotifications = (): Notification[] => [
  {
    _id: '1',
    type: 'like',
    message: 'liked your post',
    from: {
      _id: '2',
      username: 'alex_dev',
      firstName: 'Alex',
      lastName: 'Johnson',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    },
    to: 'current-user',
    postId: '1',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    postContent:
      'Just shipped a new feature that improves user experience by 40%! 🚀 #webdev #react',
    postImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop',
  },
  {
    _id: '2',
    type: 'comment',
    message: 'commented on your post',
    from: {
      _id: '3',
      username: 'sarah_ui',
      firstName: 'Sarah',
      lastName: 'Chen',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612c8e8?w=400&h=400&fit=crop&crop=face',
    },
    to: 'current-user',
    postId: '1',
    isRead: false,
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    postContent: 'Amazing work on the new dashboard design! The user flow is so intuitive 🎨',
  },
  {
    _id: '3',
    type: 'follow',
    message: 'started following you',
    from: {
      _id: '4',
      username: 'mike_code',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    },
    to: 'current-user',
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    _id: '4',
    type: 'repost',
    message: 'reposted your post',
    from: {
      _id: '5',
      username: 'emma_tech',
      firstName: 'Emma',
      lastName: 'Wilson',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    },
    to: 'current-user',
    postId: '2',
    isRead: true,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    postContent: 'Beautiful sunset from my morning run! Nature is the best inspiration 🌅',
    postImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  },
  {
    _id: '5',
    type: 'like',
    message: 'liked your post',
    from: {
      _id: '6',
      username: 'david_pm',
      firstName: 'David',
      lastName: 'Kim',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    },
    to: 'current-user',
    postId: '3',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    postContent: 'Team collaboration is key to successful product launches! 🤝',
  },
  {
    _id: '6',
    type: 'mention',
    message: 'mentioned you in a post',
    from: {
      _id: '7',
      username: 'lisa_data',
      firstName: 'Lisa',
      lastName: 'Anderson',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    },
    to: 'current-user',
    postId: '4',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    postContent: 'Great insights on data visualization! Thanks for the collaboration @you 📊',
  },
  {
    _id: '7',
    type: 'follow',
    message: 'started following you',
    from: {
      _id: '8',
      username: 'james_startup',
      firstName: 'James',
      lastName: 'Thompson',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    },
    to: 'current-user',
    isRead: true,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: '8',
    type: 'comment_like',
    message: 'liked your comment',
    from: {
      _id: '9',
      username: 'anna_ux',
      firstName: 'Anna',
      lastName: 'Martinez',
      avatar:
        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face',
    },
    to: 'current-user',
    postId: '5',
    commentId: 'c1',
    isRead: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    postContent: 'User experience should always be the top priority in design decisions',
  },
];
