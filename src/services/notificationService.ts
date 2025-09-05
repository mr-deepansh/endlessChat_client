import api from './api';

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
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (type) params.append('type', type);
    if (isRead !== undefined) params.append('isRead', isRead.toString());
    if (priority) params.append('priority', priority);

    const response = await api.get(`/notifications?${params}`);
    return response.data.data;
  }

  // Get unread count
  async getUnreadCount(): Promise<{ count: number }> {
    const response = await api.get('/notifications/unread-count');
    return response.data.data;
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    await api.patch(`/notifications/${notificationId}/read`);
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/mark-all-read');
  }

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<void> {
    await api.delete('/notifications/clear-all');
  }

  // Get notification statistics
  async getNotificationStats(): Promise<NotificationStats> {
    const response = await api.get('/notifications/stats');
    return response.data.data;
  }

  // Get notification preferences
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await api.get('/notifications/preferences');
    return response.data.data;
  }

  // Update notification preferences
  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const response = await api.put('/notifications/preferences', preferences);
    return response.data.data;
  }

  // Create test notification (for development)
  async createTestNotification(): Promise<Notification> {
    const response = await api.post('/notifications/test/create');
    return response.data.data;
  }

  // Create system notification (admin only)
  async createSystemNotification(data: {
    recipients: string[];
    title: string;
    message: string;
    data?: any;
  }): Promise<void> {
    await api.post('/notifications/system', data);
  }
}

export default new NotificationService();