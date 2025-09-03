// Enterprise Service Configuration
// Handles millions of users with optimized settings

export interface ServiceConfig {
  // API Configuration
  api: {
    baseURL: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
    maxConcurrentRequests: number;
  };

  // Cache Configuration
  cache: {
    enabled: boolean;
    defaultTTL: number;
    maxSize: number;
    strategy: 'lru' | 'lfu' | 'fifo';
  };

  // Performance Configuration
  performance: {
    enableRequestQueue: boolean;
    enableBatching: boolean;
    batchSize: number;
    batchDelay: number;
    enableCompression: boolean;
  };

  // Real-time Configuration
  realtime: {
    enableWebSockets: boolean;
    reconnectAttempts: number;
    reconnectDelay: number;
    heartbeatInterval: number;
  };

  // Security Configuration
  security: {
    enableCSRF: boolean;
    enableRateLimit: boolean;
    rateLimitWindow: number;
    rateLimitMax: number;
    enableEncryption: boolean;
  };

  // Monitoring Configuration
  monitoring: {
    enableMetrics: boolean;
    enableLogging: boolean;
    logLevel: 'error' | 'warn' | 'info' | 'debug';
    enablePerformanceTracking: boolean;
  };

  // Feature Flags
  features: {
    enableOfflineMode: boolean;
    enablePushNotifications: boolean;
    enableRealTimeUpdates: boolean;
    enableAdvancedAnalytics: boolean;
    enableBulkOperations: boolean;
  };
}

// Production Configuration for Enterprise Scale
export const productionConfig: ServiceConfig = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.endlesschat.com/api/v1',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    maxConcurrentRequests: 10,
  },

  cache: {
    enabled: true,
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 1000,
    strategy: 'lru',
  },

  performance: {
    enableRequestQueue: true,
    enableBatching: true,
    batchSize: 50,
    batchDelay: 100,
    enableCompression: true,
  },

  realtime: {
    enableWebSockets: true,
    reconnectAttempts: 5,
    reconnectDelay: 2000,
    heartbeatInterval: 30000,
  },

  security: {
    enableCSRF: true,
    enableRateLimit: true,
    rateLimitWindow: 60000, // 1 minute
    rateLimitMax: 100,
    enableEncryption: true,
  },

  monitoring: {
    enableMetrics: true,
    enableLogging: true,
    logLevel: 'warn',
    enablePerformanceTracking: true,
  },

  features: {
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableRealTimeUpdates: true,
    enableAdvancedAnalytics: true,
    enableBulkOperations: true,
  },
};

// Development Configuration
export const developmentConfig: ServiceConfig = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    timeout: 10000,
    retryAttempts: 2,
    retryDelay: 500,
    maxConcurrentRequests: 5,
  },

  cache: {
    enabled: true,
    defaultTTL: 2 * 60 * 1000, // 2 minutes
    maxSize: 100,
    strategy: 'lru',
  },

  performance: {
    enableRequestQueue: false,
    enableBatching: false,
    batchSize: 10,
    batchDelay: 50,
    enableCompression: false,
  },

  realtime: {
    enableWebSockets: true,
    reconnectAttempts: 3,
    reconnectDelay: 1000,
    heartbeatInterval: 15000,
  },

  security: {
    enableCSRF: false,
    enableRateLimit: false,
    rateLimitWindow: 60000,
    rateLimitMax: 1000,
    enableEncryption: false,
  },

  monitoring: {
    enableMetrics: true,
    enableLogging: true,
    logLevel: 'debug',
    enablePerformanceTracking: true,
  },

  features: {
    enableOfflineMode: false,
    enablePushNotifications: false,
    enableRealTimeUpdates: true,
    enableAdvancedAnalytics: false,
    enableBulkOperations: true,
  },
};

// Get configuration based on environment
export const getServiceConfig = (): ServiceConfig => {
  const env = import.meta.env.MODE || 'development';

  switch (env) {
    case 'production':
      return productionConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

// Service endpoints configuration
export const serviceEndpoints = {
  // Authentication
  auth: {
    login: '/users/login',
    register: '/users/register',
    logout: '/users/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    changePassword: '/users/change-password',
  },

  // User Management
  users: {
    profile: '/users/profile/me',
    updateProfile: '/users/profile/me',
    uploadAvatar: '/users/upload-avatar',
    search: '/users/search',
    getById: '/users/:id',
    getAll: '/users',
    follow: '/users/follow/:id',
    unfollow: '/users/unfollow/:id',
    followers: '/users/followers/:id',
    following: '/users/following/:id',
    block: '/users/block/:id',
    unblock: '/users/unblock/:id',
    mute: '/users/mute/:id',
    unmute: '/users/unmute/:id',
  },

  // Feed & Posts
  feed: {
    timeline: '/feed/timeline',
    explore: '/feed/explore',
    trending: '/feed/trending',
    posts: '/posts',
    createPost: '/posts',
    getPost: '/posts/:id',
    updatePost: '/posts/:id',
    deletePost: '/posts/:id',
    likePost: '/posts/:id/like',
    unlikePost: '/posts/:id/like',
    repost: '/posts/:id/repost',
    share: '/posts/:id/share',
    bookmark: '/posts/:id/bookmark',
    comments: '/posts/:id/comments',
    search: '/posts/search',
  },

  // Notifications
  notifications: {
    getAll: '/notifications',
    getById: '/notifications/:id',
    markRead: '/notifications/:id/read',
    markAllRead: '/notifications/mark-all-read',
    delete: '/notifications/:id',
    deleteAll: '/notifications/delete-all',
    preferences: '/notifications/preferences',
    subscribe: '/notifications/subscribe',
    unsubscribe: '/notifications/unsubscribe',
  },

  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    stats: '/admin/stats',
    users: '/admin/users',
    posts: '/admin/content/posts',
    analytics: '/admin/analytics',
    security: '/admin/security',
    config: '/admin/config',
    monitoring: '/admin/monitoring',
  },

  // Super Admin
  superAdmin: {
    createAdmin: '/admin/super-admin/create-admin',
    deleteAdmin: '/admin/super-admin/delete-admin/:id',
    systemConfig: '/admin/super-admin/system-config',
    auditLogs: '/admin/super-admin/audit-logs',
    emergencyLockdown: '/admin/super-admin/emergency-lockdown',
    maintenance: '/admin/super-admin/maintenance',
  },

  // Social Features
  social: {
    recommendations: '/social/recommendations',
    activity: '/social/activity',
    relationships: '/social/relationships',
    insights: '/social/insights',
    verification: '/social/verification',
    reports: '/social/reports',
  },

  // Media & Files
  media: {
    upload: '/media/upload',
    process: '/media/process',
    delete: '/media/:id',
  },

  // Analytics
  analytics: {
    overview: '/analytics/overview',
    users: '/analytics/users',
    content: '/analytics/content',
    engagement: '/analytics/engagement',
    export: '/analytics/export',
  },

  // System
  system: {
    health: '/health',
    version: '/version',
    status: '/status',
  },
};

export default {
  getServiceConfig,
  serviceEndpoints,
  productionConfig,
  developmentConfig,
};
