import { api } from '../api/axiosInstance';

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

export const notificationService = {
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
  }): Promise<{ success: boolean; data: Notification[]; error?: string }> => {
    try {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }
      console.log('🔔 Fetching notifications from API...');
      const response = await api.get(`/notifications?${queryParams.toString()}`);
      console.log('✅ Notifications API success:', response.data);
      const notifications =
        response.data?.data?.notifications ||
        response.data?.notifications ||
        response.data?.data ||
        response.data ||
        [];
      return { success: true, data: notifications };
    } catch (error: any) {
      console.error('❌ Notifications API failed:', error.message);
      return { success: false, data: [], error: error.message };
    }
  },

  markAsRead: async (notificationId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return { success: true, message: 'Marked as read' };
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return { success: false, message: 'Failed to mark as read' };
    }
  },

  markAllAsRead: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.patch('/notifications/mark-all-read');
      return { success: true, message: 'All notifications marked as read' };
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return { success: false, message: 'Failed to mark all as read' };
    }
  },

  deleteNotification: async (
    notificationId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return { success: true, message: 'Notification deleted' };
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return { success: false, message: 'Failed to delete notification' };
    }
  },

  getUnreadCount: async (): Promise<{ count: number }> => {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.data?.data || response.data || { count: 0 };
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return { count: 0 };
    }
  },

  createSystemNotification: async (data: {
    type: string;
    message: string;
    recipients?: string[];
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/notifications/system', data);
      return { success: true, message: 'System notification created' };
    } catch (error) {
      console.error('Failed to create system notification:', error);
      return { success: false, message: 'Failed to create notification' };
    }
  },
};

export default notificationService;
