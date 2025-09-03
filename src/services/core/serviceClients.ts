import { apiClient } from './apiClient';
import { config } from '../../config/environment';

// Use single shared API client for all services to ensure consistent token management
export const authApi = apiClient;
export const usersApi = apiClient;
export const postsApi = apiClient;
export const blogsApi = apiClient;
export const notificationsApi = apiClient;
export const adminApi = apiClient;
export const socialApi = apiClient;
export const analyticsApi = apiClient;
export const mediaApi = apiClient;

// Export the main client as default
export default apiClient;
