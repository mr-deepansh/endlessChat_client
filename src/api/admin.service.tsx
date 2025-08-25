// 📁 PROJECT STRUCTURE
/*
admin-panel-microservice/
├── 🎯 FRONTEND (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                     # Reusable UI components
│   │   │   ├── forms/                  # Form components
│   │   │   ├── tables/                 # Data table components
│   │   │   ├── charts/                 # Analytics charts
│   │   │   └── layout/                 # Layout components
│   │   ├── pages/
│   │   │   ├── analytics/              # Analytics pages
│   │   │   ├── users/                  # User management
│   │   │   ├── content/                # Content management
│   │   │   ├── security/               # Security & moderation
│   │   │   ├── settings/               # System configuration
│   │   │   ├── monitoring/             # Performance monitoring
│   │   │   └── communication/          # Notifications & announcements
│   │   ├── services/
│   │   │   ├── api/                    # API service layer
│   │   │   ├── auth/                   # Authentication services
│   │   │   └── utils/                  # Utility services
│   │   ├── hooks/
│   │   │   ├── useAuth.ts              # Authentication hook
│   │   │   ├── useApi.ts               # API hooks
│   │   │   └── usePermissions.ts       # Permission management
│   │   ├── types/
│   │   │   ├── api.types.ts            # API types
│   │   │   ├── user.types.ts           # User types
│   │   │   └── admin.types.ts          # Admin types
│   │   ├── config/
│   │   │   ├── api-routes.ts           # Route definitions
│   │   │   ├── constants.ts            # App constants
│   │   │   └── permissions.ts          # Permission definitions
│   │   ├── store/
│   │   │   ├── slices/                 # Redux slices
│   │   │   └── store.ts                # Store configuration
│   │   └── utils/
│   │       ├── formatters.ts           # Data formatters
│   │       ├── validators.ts           # Form validators
│   │       └── helpers.ts              # Helper functions
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── 🚀 BACKEND (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── analytics.controller.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── content.controller.ts
│   │   │   ├── security.controller.ts
│   │   │   ├── system.controller.ts
│   │   │   └── monitoring.controller.ts
│   │   ├── services/
│   │   │   ├── analytics.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── content.service.ts
│   │   │   ├── security.service.ts
│   │   │   └── notification.service.ts
│   │   ├── models/
│   │   │   ├── User.model.ts
│   │   │   ├── Admin.model.ts
│   │   │   ├── Content.model.ts
│   │   │   └── AuditLog.model.ts
│   │   ├── routes/
│   │   │   ├── admin.routes.ts
│   │   │   ├── analytics.routes.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── content.routes.ts
│   │   │   └── security.routes.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── permissions.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── rate-limit.middleware.ts
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── env.ts
│   │   └── utils/
│   │       ├── logger.ts
│   │       ├── errors.ts
│   │       └── helpers.ts
│   ├── package.json
│   └── tsconfig.json
│
└── 🗄️ DATABASE
    ├── migrations/
    ├── seeders/
    └── backup/
*/

// =============================================================================
// 🎯 FRONTEND SERVICE LAYER (React Query + Axios)
// =============================================================================

// services/api/admin.service.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL, ADMIN_API_ROUTES, buildApiUrl } from '../../config/api-routes';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

class AdminApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token
    this.api.interceptors.request.use(
      config => {
        const token = localStorage.getItem('admin_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor - Handle errors globally
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => response,
      error => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('admin_token');
          window.location.href = '/admin/login';
        }

        if (error.response?.status === 403) {
          // Handle forbidden - show permission error
          console.error('Access denied:', error.response.data.message);
        }

        return Promise.reject(error);
      }
    );
  }

  // =============================================================================
  // 📊 ANALYTICS METHODS
  // =============================================================================
  async getAnalyticsOverview(params?: {
    startDate?: string;
    endDate?: string;
    granularity?: string;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/analytics/overview', { params });
    return response.data;
  }

  async getUserGrowthAnalytics(params?: {
    period?: string;
    segment?: string;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/analytics/users/growth', { params });
    return response.data;
  }

  async getUserRetentionMetrics(params?: {
    cohort?: string;
    period?: string;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/analytics/users/retention', { params });
    return response.data;
  }

  async exportReport(params: {
    type: string;
    format: 'csv' | 'xlsx' | 'pdf';
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> {
    const response = await this.api.get('/admin/reports/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  }

  // =============================================================================
  // 👥 USER MANAGEMENT METHODS
  // =============================================================================
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/users', { params });
    return response.data;
  }

  async getUserDetails(userId: string): Promise<ApiResponse> {
    const response = await this.api.get(buildApiUrl('/admin/users/:id', { id: userId }));
    return response.data;
  }

  async updateUser(
    userId: string,
    data: {
      name?: string;
      email?: string;
      role?: string;
      status?: string;
    }
  ): Promise<ApiResponse> {
    const response = await this.api.put(buildApiUrl('/admin/users/:id', { id: userId }), data);
    return response.data;
  }

  async suspendUser(
    userId: string,
    data: {
      reason: string;
      duration?: number;
    }
  ): Promise<ApiResponse> {
    const response = await this.api.patch(
      buildApiUrl('/admin/users/:id/suspend', { id: userId }),
      data
    );
    return response.data;
  }

  async activateUser(userId: string): Promise<ApiResponse> {
    const response = await this.api.patch(buildApiUrl('/admin/users/:id/activate', { id: userId }));
    return response.data;
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    const response = await this.api.delete(buildApiUrl('/admin/users/:id', { id: userId }));
    return response.data;
  }

  async getUserActivityLog(
    userId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      type?: string;
    }
  ): Promise<ApiResponse> {
    const response = await this.api.get(
      buildApiUrl('/admin/users/:id/activity-log', { id: userId }),
      { params }
    );
    return response.data;
  }

  async bulkUserActions(data: {
    userIds: string[];
    action: 'suspend' | 'activate' | 'delete' | 'update_role';
    params?: Record<string, any>;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/admin/users/bulk-actions', data);
    return response.data;
  }

  // =============================================================================
  // 🛡️ SECURITY & MODERATION METHODS
  // =============================================================================
  async getSuspiciousAccounts(params?: {
    severity?: string;
    status?: string;
    limit?: number;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/security/suspicious-accounts', { params });
    return response.data;
  }

  async getLoginAttempts(params?: {
    ip?: string;
    user_id?: string;
    time_range?: string;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/security/login-attempts', { params });
    return response.data;
  }

  async blockIpAddress(data: {
    ip: string;
    reason: string;
    duration?: number;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/admin/security/block-ip', data);
    return response.data;
  }

  async getReportedContent(params?: {
    status?: string;
    type?: string;
    severity?: string;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/moderation/reported-content', { params });
    return response.data;
  }

  async reviewContent(data: {
    contentId: string;
    action: 'approve' | 'reject' | 'escalate';
    reason?: string;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/admin/moderation/review-content', data);
    return response.data;
  }

  // =============================================================================
  // 🚨 CONTENT MANAGEMENT METHODS
  // =============================================================================
  async getPosts(params?: {
    status?: string;
    author?: string;
    category?: string;
    sort?: string;
    page?: number;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/content/posts', { params });
    return response.data;
  }

  async getReportedPosts(): Promise<ApiResponse> {
    const response = await this.api.get('/admin/content/posts/reported');
    return response.data;
  }

  async getTrendingPosts(params?: { timeframe?: string; limit?: number }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/content/posts/trending', { params });
    return response.data;
  }

  async deletePost(postId: string): Promise<ApiResponse> {
    const response = await this.api.delete(buildApiUrl('/admin/content/posts/:id', { id: postId }));
    return response.data;
  }

  async hidePost(postId: string, reason: string): Promise<ApiResponse> {
    const response = await this.api.patch(
      buildApiUrl('/admin/content/posts/:id/hide', { id: postId }),
      { reason }
    );
    return response.data;
  }

  async featurePost(postId: string): Promise<ApiResponse> {
    const response = await this.api.patch(
      buildApiUrl('/admin/content/posts/:id/feature', { id: postId })
    );
    return response.data;
  }

  // =============================================================================
  // 🎛️ SYSTEM CONFIGURATION METHODS
  // =============================================================================
  async getAppSettings(): Promise<ApiResponse> {
    const response = await this.api.get('/admin/config/app-settings');
    return response.data;
  }

  async updateAppSettings(settings: Record<string, any>): Promise<ApiResponse> {
    const response = await this.api.put('/admin/config/app-settings', { settings });
    return response.data;
  }

  async getFeatureFlags(): Promise<ApiResponse> {
    const response = await this.api.get('/admin/config/feature-flags');
    return response.data;
  }

  async toggleFeatureFlag(
    flag: string,
    data: {
      enabled: boolean;
      config?: Record<string, any>;
    }
  ): Promise<ApiResponse> {
    const response = await this.api.patch(
      buildApiUrl('/admin/config/feature-flags/:flag', { flag }),
      data
    );
    return response.data;
  }

  async enableMaintenanceMode(data: {
    message: string;
    estimated_duration?: number;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/admin/config/maintenance-mode/enable', data);
    return response.data;
  }

  async disableMaintenanceMode(): Promise<ApiResponse> {
    const response = await this.api.post('/admin/config/maintenance-mode/disable');
    return response.data;
  }

  // =============================================================================
  // 📢 COMMUNICATION METHODS
  // =============================================================================
  async getNotificationTemplates(): Promise<ApiResponse> {
    const response = await this.api.get('/admin/notifications/templates');
    return response.data;
  }

  async createNotificationTemplate(data: {
    name: string;
    subject: string;
    content: string;
    type: string;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/admin/notifications/templates', data);
    return response.data;
  }

  async sendBulkNotification(data: {
    recipients: string[] | 'all';
    template: string;
    schedule?: Date;
  }): Promise<ApiResponse> {
    const response = await this.api.post('/admin/notifications/send-bulk', data);
    return response.data;
  }

  async createAnnouncement(data: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    target_audience: string[];
  }): Promise<ApiResponse> {
    const response = await this.api.post('/admin/announcements/create', data);
    return response.data;
  }

  // =============================================================================
  // 📈 MONITORING METHODS
  // =============================================================================
  async getServerHealth(): Promise<ApiResponse> {
    const response = await this.api.get('/admin/monitoring/server-health');
    return response.data;
  }

  async getDatabaseStats(): Promise<ApiResponse> {
    const response = await this.api.get('/admin/monitoring/database-stats');
    return response.data;
  }

  async getApiPerformance(params?: {
    endpoint?: string;
    time_range?: string;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/monitoring/api-performance', { params });
    return response.data;
  }

  async getErrorLogs(params?: {
    level?: string;
    service?: string;
    time_range?: string;
  }): Promise<ApiResponse> {
    const response = await this.api.get('/admin/monitoring/error-logs', { params });
    return response.data;
  }
}

// Create singleton instance
export const adminApiService = new AdminApiService();
export default adminApiService;
