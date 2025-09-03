export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v2',
  services: {
    auth:
      import.meta.env.VITE_AUTH_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api/v2',
    users:
      import.meta.env.VITE_USERS_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api/v2',
    posts:
      import.meta.env.VITE_POSTS_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api/v2',
    blogs:
      import.meta.env.VITE_BLOGS_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api/v2',
    notifications:
      import.meta.env.VITE_NOTIFICATIONS_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api/v2',
    admin:
      import.meta.env.VITE_ADMIN_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api/v2',
    social:
      import.meta.env.VITE_SOCIAL_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api/v2',
    analytics:
      import.meta.env.VITE_ANALYTICS_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api/v2',
    media:
      import.meta.env.VITE_MEDIA_API_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000/api/v2',
  },
  appName: import.meta.env.VITE_APP_NAME || 'EndlessChat',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  features: {
    enablePWA: import.meta.env.VITE_ENABLE_PWA === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    enableRealTime: import.meta.env.VITE_ENABLE_REAL_TIME === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  },

  ui: {
    defaultTheme: import.meta.env.VITE_DEFAULT_THEME || 'system',
    enableDarkMode: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
    enableAnimations: import.meta.env.VITE_ENABLE_ANIMATIONS === 'true',
  },

  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760'),
    allowedFileTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
    ],
    maxFilesPerPost: parseInt(import.meta.env.VITE_MAX_FILES_PER_POST || '5'),
  },

  performance: {
    requestTimeout: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '30000'),
    cacheDuration: parseInt(import.meta.env.VITE_CACHE_DURATION || '300000'),
  },
};

export default config;
