import { api, withErrorHandling } from './api';

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
  updatedAt: string;
  postContent?: string;
  postImage?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    like: number;
    comment: number;
    follow: number;
    repost: number;
    mention: number;
    comment_like: number;
  };
}

export const notificationService = {
  // Get all notifications for current user
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
  }): Promise<Notification[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    return withErrorHandling(
      () => api.get<Notification[]>(`/notifications?${queryParams.toString()}`, {
        cache: {
          ttl: 30 * 1000, // 30 seconds
          tags: ['notifications']
        }
      }),
      'Failed to load notifications'
    );
  },

  // Get notification statistics
  getNotificationStats: async (): Promise<NotificationStats> => {
    return withErrorHandling(
      () => api.get<NotificationStats>('/notifications/stats', {
        cache: {
          ttl: 60 * 1000, // 1 minute
          tags: ['notifications', 'stats']
        }
      }),
      'Failed to load notification stats'
    );
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.patch<{ message: string }>(`/notifications/${notificationId}/read`),
      'Failed to mark notification as read'
    );
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.patch<{ message: string }>('/notifications/read-all'),
      'Failed to mark all notifications as read'
    );
  },

  // Delete notification
  deleteNotification: async (notificationId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.delete<{ message: string }>(`/notifications/${notificationId}`),
      'Failed to delete notification'
    );
  },

  // Delete all notifications
  deleteAllNotifications: async (): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.delete<{ message: string }>('/notifications'),
      'Failed to delete all notifications'
    );
  },

  // Create notification (usually called by backend, but useful for testing)
  createNotification: async (data: {
    type: Notification['type'];
    to: string;
    postId?: string;
    commentId?: string;
    message?: string;
  }): Promise<Notification> => {
    return withErrorHandling(
      () => api.post<Notification>('/notifications', data),
      'Failed to create notification'
    );
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => {
    return withErrorHandling(
      () => api.get<{ count: number }>('/notifications/unread-count', {
        cache: {
          ttl: 10 * 1000, // 10 seconds
          tags: ['notifications', 'unread']
        }
      }),
      'Failed to get unread count'
    );
  },

  // Update notification preferences
  updatePreferences: async (preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    types: {
      like: boolean;
      comment: boolean;
      follow: boolean;
      repost: boolean;
      mention: boolean;
    };
  }): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.put<{ message: string }>('/notifications/preferences', preferences),
      'Failed to update notification preferences'
    );
  },

  // Get notification preferences
  getPreferences: async (): Promise<{
    emailNotifications: boolean;
    pushNotifications: boolean;
    types: {
      like: boolean;
      comment: boolean;
      follow: boolean;
      repost: boolean;
      mention: boolean;
    };
  }> => {
    return withErrorHandling(
      () => api.get('/notifications/preferences', {
        cache: {
          ttl: 5 * 60 * 1000, // 5 minutes
          tags: ['notifications', 'preferences']
        }
      }),
      'Failed to get notification preferences'
    );
  }
};

export default notificationService;