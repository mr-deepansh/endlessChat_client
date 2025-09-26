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
    avatar?: string;
  };
  to: string;
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
  // Get notifications
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

      // Ensure proper data structure
      const data = response.data || {};
      return {
        notifications: (data.notifications || []).map((notification: any) => ({
          ...notification,
          from: notification.from || {
            _id: 'unknown',
            username: 'unknown',
            firstName: 'Unknown',
            lastName: 'User',
            avatar: null,
          },
        })),
        totalNotifications: data.totalNotifications || 0,
        totalPages: data.totalPages || 0,
        currentPage: data.currentPage || page,
        hasNextPage: data.hasNextPage || false,
        hasPrevPage: data.hasPrevPage || false,
        unreadCount: data.unreadCount || 0,
      };
    } catch (error) {
      console.error('Failed to get notifications:', error);
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
  }

  // Get unread count
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`/notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await apiClient.patch('/notifications/mark-all-read');
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`/notifications/${notificationId}`);
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<void> {
    await apiClient.delete('/notifications/clear-all');
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

  // Create test notification (for development)
  async createTestNotification(): Promise<Notification> {
    const response = await apiClient.post('/notifications/test/create');
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
