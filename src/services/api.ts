import { api, withErrorHandling } from './axiosInstance';
import type { ApiResponse, User, Post, Comment, Notification } from './types';

// Re-export for backward compatibility
export { api, withErrorHandling };
export type * from './types';

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

// Post Services
export const postService = {
  getAllPosts: (params?: { page?: number; limit?: number; sort?: 'recent' | 'popular' }) =>
    withErrorHandling(() => api.get<ApiResponse<Post[]>>('/posts', { params })),

  getPostById: (postId: string) =>
    withErrorHandling(() => api.get<ApiResponse<Post>>(`/posts/${postId}`)),

  createPost: (postData: { title: string; content: string }) =>
    withErrorHandling(() => api.post<ApiResponse<Post>>('/posts', postData)),

  updatePost: (postId: string, postData: { title?: string; content?: string }) =>
    withErrorHandling(() => api.put<ApiResponse<Post>>(`/posts/${postId}`, postData)),

  deletePost: (postId: string) => withErrorHandling(() => api.delete(`/posts/${postId}`)),

  likePost: (postId: string) => withErrorHandling(() => api.post(`/posts/${postId}/like`)),

  unlikePost: (postId: string) => withErrorHandling(() => api.delete(`/posts/${postId}/like`)),

  getPostComments: (postId: string, params?: { page?: number; limit?: number }) =>
    withErrorHandling(() =>
      api.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`, { params })
    ),

  addComment: (postId: string, commentData: { content: string }) =>
    withErrorHandling(() =>
      api.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, commentData)
    ),

  updateComment: (postId: string, commentId: string, commentData: { content: string }) =>
    withErrorHandling(() => api.put(`/posts/${postId}/comments/${commentId}`, commentData)),

  deleteComment: (postId: string, commentId: string) =>
    withErrorHandling(() => api.delete(`/posts/${postId}/comments/${commentId}`)),
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

  getFollowers: (userId: string, params?: { limit?: number; page?: number }) =>
    withErrorHandling(() => api.get<ApiResponse<User[]>>(`/users/followers/${userId}`, { params })),

  getFollowing: (userId: string, params?: { limit?: number; page?: number }) =>
    withErrorHandling(() => api.get<ApiResponse<User[]>>(`/users/following/${userId}`, { params })),

  getFeed: (params?: { limit?: number; page?: number; sort?: 'recent' | 'popular' }) =>
    withErrorHandling(() => api.get<ApiResponse<Post[]>>('/users/feed', { params })),
};

// Admin Services
export const adminService = {
  getStats: () => withErrorHandling(() => api.get<ApiResponse>('/admin/stats')),
  getLiveStats: () => withErrorHandling(() => api.get<ApiResponse>('/admin/stats/live')),
  getDashboard: () => withErrorHandling(() => api.get<ApiResponse>('/admin/dashboard')),

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

  getAllPosts: (params?: { page?: number; limit?: number; status?: string }) =>
    withErrorHandling(() => api.get<ApiResponse<Post[]>>('/admin/content/posts', { params })),

  togglePostVisibility: (postId: string, action: 'hide' | 'show', reason?: string) =>
    withErrorHandling(() =>
      api.patch(`/admin/content/posts/${postId}/toggle-visibility`, { action, reason })
    ),

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

  getAppSettings: () => withErrorHandling(() => api.get('/admin/config/app-settings')),
  updateAppSettings: (settings: { category: string; settings: Record<string, any> }) =>
    withErrorHandling(() => api.put('/admin/config/app-settings', settings)),

  getNotificationTemplates: (params?: { type?: string }) =>
    withErrorHandling(() => api.get('/admin/notifications/templates', { params })),

  sendBulkNotification: (notificationData: {
    recipients: string;
    template: string;
    channels: string[];
    priority: string;
    customMessage?: { title: string; content: string };
  }) => withErrorHandling(() => api.post('/admin/notifications/send-bulk', notificationData)),

  getAllAdmins: () => withErrorHandling(() => api.get<ApiResponse<User[]>>('/admin/admins')),
  getAdminById: (adminId: string) =>
    withErrorHandling(() => api.get<ApiResponse<User>>(`/admin/admins/${adminId}`)),

  getSessionAnalytics: (params?: { timeRange?: string }) =>
    withErrorHandling(() => api.get('/admin/sessions/analytics', { params })),
  getAdminSessions: (adminId: string) =>
    withErrorHandling(() => api.get(`/admin/sessions/${adminId}`)),
};

// Super Admin Services
export const superAdminService = {
  createAdmin: (adminData: {
    username: string;
    email: string;
    password: string;
    role: string;
    permissions: string[];
  }) =>
    withErrorHandling(() =>
      api.post<ApiResponse<User>>('/admin/super-admin/create-admin', adminData)
    ),

  deleteAdmin: (adminId: string, data: { confirmPassword: string; reason: string }) =>
    withErrorHandling(() => api.delete(`/admin/super-admin/delete-admin/${adminId}`, { data })),

  changeUserRole: (userId: string, roleData: { newRole: string; reason: string }) =>
    withErrorHandling(() => api.put(`/admin/super-admin/change-role/${userId}`, roleData)),

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

// Activity Services
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

// Notification Services
export const notificationService = {
  getNotifications: (params?: { page?: number; limit?: number; type?: string; read?: boolean }) =>
    withErrorHandling(() => api.get<ApiResponse<Notification[]>>('/notifications', { params })),

  markAsRead: (notificationId: string) =>
    withErrorHandling(() => api.patch(`/notifications/${notificationId}/read`)),

  markAllAsRead: () => withErrorHandling(() => api.patch('/notifications/mark-all-read')),

  deleteNotification: (notificationId: string) =>
    withErrorHandling(() => api.delete(`/notifications/${notificationId}`)),

  getUnreadCount: () => withErrorHandling(() => api.get('/notifications/unread-count')),
};

// Health Check
export const healthService = {
  checkVersion: () => withErrorHandling(() => api.get('/')),
};

export default api;
