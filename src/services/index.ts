// Core exports
export { apiClient } from './core/apiClient';
export * from './core/types';
export * from './core/utils';

// Service modules
export { authService } from './modules/auth.service';
export { profileService } from './modules/profile.service';
export { adminService } from './modules/admin.service';

// Legacy compatibility - gradually migrate to new services
export { userService } from './userService';
export { postService } from './postService';
export { commentService } from './commentService';
export { notificationService } from './notificationService';

// Service factory for dependency injection
export class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }

  has(name: string): boolean {
    return this.services.has(name);
  }
}

// Initialize services
const serviceFactory = ServiceFactory.getInstance();
serviceFactory.register('auth', authService);
serviceFactory.register('profile', profileService);
serviceFactory.register('admin', adminService);

export { serviceFactory };

// Default export for convenience
export default {
  auth: authService,
  profile: profileService,
  admin: adminService,
  factory: serviceFactory
};