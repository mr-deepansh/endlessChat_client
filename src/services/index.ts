// Central service exports (microservice modules only)
export { authService } from './modules/auth.service';
export { userService } from './modules/user.service';
export { adminService } from './modules/admin.service';
export { superAdminService } from './modules/superAdmin.service';
export { notificationService } from './modules/notification.service';
export { feedService } from './modules/feed.service';
export { socialService } from './modules/social.service';
export { blogService } from './modules/blog.service';

// Core factories/clients
export { serviceFactory } from './serviceFactory';
export { apiClient, createApiClient } from './core/apiClient';
export * as serviceClients from './core/serviceClients';

// Unified public types
export type * from '../types/api';
