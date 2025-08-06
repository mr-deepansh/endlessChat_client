import { api, withErrorHandling } from './api';

// Admin-related types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalComments: number;
  suspendedUsers: number;
  newUsersToday: number;
  postsToday: number;
  commentsToday: number;
}

export interface AdminUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  lastActive: string;
  avatar?: string;
  bio?: string;
  location?: string;
}

export interface AdminPost {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isReported: boolean;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Admin Service
export const adminService = {
  // Dashboard Stats
  getStats: async (): Promise<AdminStats> => {
    return withErrorHandling(
      () => api.get<AdminStats>('/admin/stats'),
      'Failed to load admin statistics'
    );
  },

  getLiveStats: async (): Promise<AdminStats> => {
    return withErrorHandling(
      () => api.get<AdminStats>('/admin/stats/live'),
      'Failed to load live admin statistics'
    );
  },

  getAllAdmins: async (): Promise<AdminUser[]> => {
    return withErrorHandling(
      () => api.get<AdminUser[]>('/admin/admins'),
      'Failed to load admins'
    );
  },

  getAdminById: async (adminId: string): Promise<AdminUser> => {
    return withErrorHandling(
      () => api.get<AdminUser>(`/admin/admins/${adminId}`),
      'Failed to load admin details'
    );
  },

  // User Management
  getUsers: async (params?: PaginationParams): Promise<PaginatedResponse<AdminUser>> => {
    return withErrorHandling(
      () => api.get<PaginatedResponse<AdminUser>>('/admin/users', { params }),
      'Failed to load users'
    );
  },

  getUserById: async (userId: string): Promise<AdminUser> => {
    return withErrorHandling(
      () => api.get<AdminUser>(`/admin/users/${userId}`),
      'Failed to load user details'
    );
  },

  activateUser: async (userId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.patch<{ message: string }>(`/admin/users/${userId}/activate`),
      'Failed to activate user'
    );
  },

  suspendUser: async (userId: string, reason?: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.patch<{ message: string }>(`/admin/users/${userId}/suspend`, { reason }),
      'Failed to suspend user'
    );
  },

  deleteUser: async (userId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.delete<{ message: string }>(`/admin/users/${userId}`),
      'Failed to delete user'
    );
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<AdminUser> => {
    return withErrorHandling(
      () => api.patch<AdminUser>(`/admin/users/${userId}/role`, { role }),
      'Failed to update user role'
    );
  },

  // Post Management
  getPosts: async (params?: PaginationParams): Promise<PaginatedResponse<AdminPost>> => {
    return withErrorHandling(
      () => api.get<PaginatedResponse<AdminPost>>('/admin/posts', { params }),
      'Failed to load posts'
    );
  },

  getReportedPosts: async (params?: PaginationParams): Promise<PaginatedResponse<AdminPost>> => {
    return withErrorHandling(
      () => api.get<PaginatedResponse<AdminPost>>('/admin/posts/reported', { params }),
      'Failed to load reported posts'
    );
  },

  deletePost: async (postId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.delete<{ message: string }>(`/admin/posts/${postId}`),
      'Failed to delete post'
    );
  },

  approvePost: async (postId: string): Promise<{ message: string }> => {
    return withErrorHandling(
      () => api.patch<{ message: string }>(`/admin/posts/${postId}/approve`),
      'Failed to approve post'
    );
  },

  // System Management
  getSystemInfo: async (): Promise<any> => {
    return withErrorHandling(
      () => api.get('/admin/system/info'),
      'Failed to load system information'
    );
  },

  exportUsers: async (format: 'csv' | 'json' = 'csv'): Promise<Blob> => {
    return withErrorHandling(
      () => api.get(`/admin/export/users?format=${format}`, { 
        responseType: 'blob' 
      }),
      'Failed to export users'
    );
  },

  exportPosts: async (format: 'csv' | 'json' = 'csv'): Promise<Blob> => {
    return withErrorHandling(
      () => api.get(`/admin/export/posts?format=${format}`, { 
        responseType: 'blob' 
      }),
      'Failed to export posts'
    );
  },

  // Analytics
  getUserGrowthAnalytics: async (period: '7d' | '30d' | '90d' | '1y'): Promise<any> => {
    return withErrorHandling(
      () => api.get(`/admin/analytics/user-growth?period=${period}`),
      'Failed to load user growth analytics'
    );
  },

  getEngagementAnalytics: async (period: '7d' | '30d' | '90d' | '1y'): Promise<any> => {
    return withErrorHandling(
      () => api.get(`/admin/analytics/engagement?period=${period}`),
      'Failed to load engagement analytics'
    );
  },
};

export default adminService;