import { apiClient } from './core/apiClient';

export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'unfollow' | 'repost' | 'mention' | 'system';
  message: string;
  from: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: any;
  };
  sender?: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: any;
  };
  recipient?: string;
  to?: string;
  postId?: string;
  postContent?: string;
  postImage?: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  data?: any;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  totalNotifications: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  unreadCount: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface NotificationPreferences {
  email: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    reposts: boolean;
    system: boolean;
  };
  push: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    reposts: boolean;
    system: boolean;
  };
  inApp: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    reposts: boolean;
    system: boolean;
  };
}

class NotificationService {
  async getNotifications(
    page = 1,
    limit = 20,
    type?: string,
    isRead?: boolean,
    priority?: string
  ): Promise<NotificationsResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (type) params.append('type', type);
      if (isRead !== undefined) params.append('isRead', isRead.toString());
      if (priority) params.append('priority', priority);

      const response = await apiClient.get(`/notifications?${params}`);
      const data = response.data || {};

      return {
        notifications: (data.notifications || []).map((notification: any) => ({
          ...notification,
          from: notification.sender ||
            notification.from || {
              _id: 'unknown',
              username: 'unknown',
              firstName: 'Unknown',
              lastName: 'User',
              avatar: null,
            },
          postId: notification.data?.postId?._id || notification.postId,
          postContent: notification.data?.postContent || notification.postContent,
          postImage: notification.data?.postImage || notification.postImage,
        })),
        totalNotifications: data.pagination?.totalCount || 0,
        totalPages: data.pagination?.totalPages || 0,
        currentPage: data.pagination?.currentPage || page,
        hasNextPage: data.pagination?.hasNext || false,
        hasPrevPage: data.pagination?.hasPrev || false,
        unreadCount: data.unreadCount || 0,
      };
    } catch (error) {
      return this.getEmptyResponse(page);
    }
  }

  async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      return { count: response.data.unreadCount || 0 };
    } catch (error) {
      return { count: 0 };
    }
  }

  async markAsRead(notificationId: string): Promise<{ success: boolean }> {
    try {
      await apiClient.patch(`/notifications/${notificationId}/read`);
      return { success: true };
    } catch (error) {
      throw new Error('Failed to mark notification as read');
    }
  }

  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiClient.patch('/notifications/mark-all-read');
      return { success: true, count: response.data.modifiedCount || 0 };
    } catch (error) {
      throw new Error('Failed to mark all notifications as read');
    }
  }

  async deleteNotification(notificationId: string): Promise<{ success: boolean }> {
    try {
      await apiClient.delete(`/notifications/${notificationId}`);
      return { success: true };
    } catch (error) {
      throw new Error('Failed to delete notification');
    }
  }

  async clearAllNotifications(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiClient.delete('/notifications/clear-all');
      return { success: true, count: response.data.deletedCount || 0 };
    } catch (error) {
      throw new Error('Failed to clear all notifications');
    }
  }

  private getEmptyResponse(page: number): NotificationsResponse {
    return {
      notifications: [],
      totalNotifications: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false,
      unreadCount: 0,
    };
  }

  // Get notification statistics
  async getNotificationStats(): Promise<NotificationStats> {
    const response = await apiClient.get('/notifications/stats');
    return response.data;
  }

  // Get notification preferences
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get('/notifications/preferences');
    return response.data;
  }

  // Update notification preferences
  async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const response = await apiClient.put('/notifications/preferences', preferences);
    return response.data;
  }

  // Create system notification (admin only)
  async createSystemNotification(data: {
    recipients: string[];
    title: string;
    message: string;
    data?: any;
  }): Promise<void> {
    await apiClient.post('/notifications/system', data);
  }
}

export default new NotificationService();
