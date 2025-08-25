// Environment configuration
export const ENV = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v2',

  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'EndlessChat',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  // Environment flags
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,

  // Feature flags
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_MOCK_API: import.meta.env.VITE_MOCK_API === 'true',

  // Logging configuration
  LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
} as const;

// Validation
if (!ENV.API_BASE_URL && ENV.IS_PRODUCTION) {
  throw new Error('VITE_API_BASE_URL is required in production');
}

export default ENV;
