// Application Constants
export const APP_CONFIG = {
  NAME: 'EndlessChat',
  VERSION: '2.0.0',
  AUTHOR: 'Deepansh Gangwar',
  DESCRIPTION: 'Enterprise Social Media Platform'
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;

// UI Constants
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 500,
  ANIMATION_DURATION: 300,
  SKELETON_ITEMS: 5
} as const;

// Role Constants
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  SUPERADMIN: 'superadmin'
} as const;

// Route Constants
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  ADMIN: '/admin',
  PROFILE: '/profile/me'
} as const;