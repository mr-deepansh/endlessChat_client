// src/services/api.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v2';

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Error handler utility
export const withErrorHandling = async <T>(
  apiCall: () => Promise<AxiosResponse<T>>,
  errorMessage: string = 'An error occurred'
): Promise<AxiosResponse<T>> => {
  try {
    return await apiCall();
  } catch (error: any) {
    console.error(errorMessage, error);
    throw new Error(error.response?.data?.message || errorMessage);
  }
};

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin' | 'super_admin';
  bio?: string;
  avatar?: string;
  isActive: boolean;
  followers?: string[];
  following?: string[];
  followerCount?: number;
  followingCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  likes: string[];
  likeCount: number;
  comments: Comment[];
  commentCount: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  post: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication Services
export const authService = {
  register: (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role?: string;
  }) =>
    withErrorHandling(() =>
      api.post<ApiResponse<{ user: User; token: string }>>('/users/register', userData)
    ),

  login: (credentials: { identifier: string; password: string; rememberMe?: boolean }) =>
    withErrorHandling(() =>
      api.post<ApiResponse<{ user: User; token: string }>>('/users/login', credentials)
    ),

  logout: () => withErrorHandling(() => api.post('/users/logout')),

  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) => withErrorHandling(() => api.post('/users/change-password', passwordData)),

  getProfile: () => withErrorHandling(() => api.get<ApiResponse<User>>('/users/profile/me')),

  updateProfile: (profileData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    avatar?: string;
  }) => withErrorHandling(() => api.put<ApiResponse<User>>('/users/profile/me', profileData)),

  uploadAvatar: (avatarData: { avatarUrl: string }) =>
    withErrorHandling(() => api.post('/users/upload-avatar', avatarData)),
};

// User Services
export const userService = {
  getAllUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) => withErrorHandling(() => api.get<ApiResponse<User[]>>('/users', { params })),

  getUserById: (userId: string) =>
    withErrorHandling(() => api.get<ApiResponse<User>>(`/users/${userId}`)),

  searchUsers: (params: { username?: string; email?: string; firstName?: string }) =>
    withErrorHandling(() => api.get<ApiResponse<User[]>>('/users/search', { params })),

  followUser: (userId: string) => withErrorHandling(() => api.post(`/users/follow/${userId}`)),

  unfollowUser: (userId: string) => withErrorHandling(() => api.post(`/users/unfollow/${userId}`)),

  getFollowers: (
    userId: string,
    params?: {
      limit?: number;
      page?: number;
    }
  ) =>
    withErrorHandling(() => api.get<ApiResponse<User[]>>(`/users/followers/${userId}`, { params })),

  getFollowing: (
    userId: string,
    params?: {
      limit?: number;
      page?: number;
    }
  ) =>
    withErrorHandling(() => api.get<ApiResponse<User[]>>(`/users/following/${userId}`, { params })),

  getFeed: (params?: { limit?: number; page?: number; sort?: 'recent' | 'popular' }) =>
    withErrorHandling(() => api.get<ApiResponse<Post[]>>('/users/feed', { params })),
};

// Admin Services
export const adminService = {
  // Stats & Analytics
  getStats: () => withErrorHandling(() => api.get<ApiResponse>('/admin/stats')),
  getLiveStats: () => withErrorHandling(() => api.get<ApiResponse>('/admin/stats/live')),
  getDashboard: () => withErrorHandling(() => api.get<ApiResponse>('/admin/dashboard')),

  // User Management
  getAllUsers: () => withErrorHandling(() => api.get<ApiResponse<User[]>>('/admin/users')),
  getUserById: (userId: string) =>
    withErrorHandling(() => api.get<ApiResponse<User>>(`/admin/users/${userId}`)),
  updateUser: (userId: string, userData: Partial<User>) =>
    withErrorHandling(() => api.put(`/admin/users/${userId}`, userData)),
  deleteUser: (userId: string, reason: string) =>
    withErrorHandling(() => api.delete(`/admin/users/${userId}`, { data: { reason } })),
  suspendUser: (userId: string, reason: string) =>
    withErrorHandling(() => api.patch(`/admin/users/${userId}/suspend`, { reason })),
  activateUser: (userId: string) =>
    withErrorHandling(() => api.patch(`/admin/users/${userId}/activate`)),

  // Content Management
  getAllPosts: (params?: { page?: number; limit?: number; status?: string }) =>
    withErrorHandling(() => api.get<ApiResponse<Post[]>>('/admin/content/posts', { params })),

  togglePostVisibility: (postId: string, action: 'hide' | 'show', reason?: string) =>
    withErrorHandling(() =>
      api.patch(`/admin/content/posts/${postId}/toggle-visibility`, { action, reason })
    ),

  // Security & Moderation
  getSuspiciousAccounts: (params?: { page?: number; limit?: number; riskLevel?: string }) =>
    withErrorHandling(() => api.get('/admin/security/suspicious-accounts', { params })),

  getBlockedIPs: (params?: { page?: number; limit?: number }) =>
    withErrorHandling(() => api.get('/admin/security/blocked-ips', { params })),

  unblockIP: (ipId: string, reason: string) =>
    withErrorHandling(() =>
      api.delete(`/admin/security/blocked-ips/${ipId}`, { data: { reason } })
    ),

  getLoginAttempts: (params?: { status?: string; timeRange?: string }) =>
    withErrorHandling(() => api.get('/admin/security/login-attempts', { params })),

  getThreatDetection: () => withErrorHandling(() => api.get('/admin/security/threat-detection')),

  // Analytics
  getOverviewAnalytics: (params?: { timeRange?: string }) =>
    withErrorHandling(() => api.get('/admin/analytics/overview', { params })),

  getUserGrowthAnalytics: (params?: { period?: string; days?: number }) =>
    withErrorHandling(() => api.get('/admin/analytics/users/growth', { params })),

  getUserDemographics: () =>
    withErrorHandling(() => api.get('/admin/analytics/users/demographics')),

  getUserRetention: (params?: { period?: string; weeks?: number }) =>
    withErrorHandling(() => api.get('/admin/analytics/users/retention', { params })),

  getEngagementMetrics: (params?: { timeRange?: string; metric?: string }) =>
    withErrorHandling(() => api.get('/admin/analytics/engagement/metrics', { params })),

  // Configuration
  getAppSettings: () => withErrorHandling(() => api.get('/admin/config/app-settings')),
  updateAppSettings: (settings: { category: string; settings: Record<string, any> }) =>
    withErrorHandling(() => api.put('/admin/config/app-settings', settings)),

  // Notifications
  getNotificationTemplates: (params?: { type?: string }) =>
    withErrorHandling(() => api.get('/admin/notifications/templates', { params })),

  sendBulkNotification: (notificationData: {
    recipients: string;
    template: string;
    channels: string[];
    priority: string;
    customMessage?: {
      title: string;
      content: string;
    };
  }) => withErrorHandling(() => api.post('/admin/notifications/send-bulk', notificationData)),
};

// Super Admin Services
export const superAdminService = {
  createAdmin: (adminData: {
    username: string;
    email: string;
    password: string;
    role: string;
    permissions: string[];
  }) => withErrorHandling(() => api.post('/admin/super-admin/create-admin', adminData)),

  deleteAdmin: (
    adminId: string,
    data: {
      confirmPassword: string;
      reason: string;
    }
  ) => withErrorHandling(() => api.delete(`/admin/super-admin/delete-admin/${adminId}`, { data })),

  changeUserRole: (
    userId: string,
    roleData: {
      newRole: string;
      reason: string;
    }
  ) => withErrorHandling(() => api.put(`/admin/super-admin/change-role/${userId}`, roleData)),

  getSystemConfig: () => withErrorHandling(() => api.get('/admin/super-admin/system-config')),

  getAuditLogs: (params?: {
    page?: number;
    limit?: number;
    action?: string;
    criticality?: string;
  }) => withErrorHandling(() => api.get('/admin/super-admin/audit-logs', { params })),

  emergencyLockdown: (lockdownData: {
    reason: string;
    duration: string;
    confirmPassword: string;
  }) => withErrorHandling(() => api.post('/admin/super-admin/emergency-lockdown', lockdownData)),
};

// Activity & Location Services
export const activityService = {
  getActivityStats: (params?: { days?: number }) =>
    withErrorHandling(() => api.get('/auth/activity/stats', { params })),

  getActivityLogs: (params?: { page?: number; limit?: number }) =>
    withErrorHandling(() => api.get('/auth/activity', { params })),

  getLocationAnalytics: (params?: { days?: number }) =>
    withErrorHandling(() => api.get('/auth/activity/location-analytics', { params })),

  getLoginLocations: (params?: { limit?: number; days?: number }) =>
    withErrorHandling(() => api.get('/auth/activity/locations', { params })),
};

// Business Intelligence Services
export const biService = {
  getRevenueAnalytics: (params?: { period?: string }) =>
    withErrorHandling(() => api.get('/admin/bi/revenue-analytics', { params })),

  getUserLifetimeValue: (params?: { segment?: string }) =>
    withErrorHandling(() => api.get('/admin/bi/user-lifetime-value', { params })),
};

// Monitoring Services
export const monitoringService = {
  getDatabaseStats: () => withErrorHandling(() => api.get('/admin/monitoring/database-stats')),
};

// Automation Services
export const automationService = {
  getRules: (params?: { status?: string }) =>
    withErrorHandling(() => api.get('/admin/automation/rules', { params })),

  getExperiments: (params?: { status?: string }) =>
    withErrorHandling(() => api.get('/admin/experiments', { params })),

  createExperiment: (experimentData: {
    name: string;
    description: string;
    variants: Array<{ name: string; description: string }>;
    trafficSplit: number[];
    duration: number;
  }) => withErrorHandling(() => api.post('/admin/experiments', experimentData)),
};

// Health Check
export const healthService = {
  checkVersion: () => withErrorHandling(() => api.get('/')),
};

export default api;
