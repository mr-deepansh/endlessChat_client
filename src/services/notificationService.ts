import { api, withErrorHandling } from './api';
import { User } from './userService';

export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'repost' | 'mention';
  message: string;
  from: User;
  to: string;
  postId?: string;
  commentId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  hasMore: boolean;
  nextCursor?: string;
  unreadCount: number;
}

export const notificationService = {
  // Get notifications
  getNotifications: async (cursor?: string, limit: number = 20): Promise<NotificationsResponse> => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    params.append('limit', limit.toString());

    return withErrorHandling(
      () => api.get<NotificationsResponse>(`/notifications?${params.toString()}`),
      'Failed to load notifications'
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

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => {
    return withErrorHandling(
      () => api.get<{ count: number }>('/notifications/unread-count'),
      'Failed to get unread count'
    );
  },
};