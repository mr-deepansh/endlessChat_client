import { api } from './api';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalComments: number;
  newUsersToday: number;
  postsToday: number;
}

export interface AdminUser {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  lastActive: string;
}

export const adminService = {
  // Admin Stats
  getStats: async (): Promise<AdminStats> => {
    return api.get<AdminStats>('/admin/stats');
  },

  getLiveStats: async (): Promise<AdminStats> => {
    return api.get<AdminStats>('/admin/stats/live');
  },

  // User Management
  getAllUsers: async (): Promise<AdminUser[]> => {
    return api.get<AdminUser[]>('/admin/users');
  },

  getUserById: async (userId: string): Promise<AdminUser> => {
    return api.get<AdminUser>(`/admin/users/${userId}`);
  },

  updateUser: async (userId: string, data: Partial<AdminUser>): Promise<AdminUser> => {
    return api.put<AdminUser>(`/admin/users/${userId}`, data);
  },

  deleteUser: async (userId: string): Promise<{ message: string }> => {
    return api.delete<{ message: string }>(`/admin/users/${userId}`);
  },

  activateUser: async (userId: string): Promise<{ message: string }> => {
    return api.patch<{ message: string }>(`/admin/users/${userId}/activate`);
  },

  suspendUser: async (userId: string): Promise<{ message: string }> => {
    return api.patch<{ message: string }>(`/admin/users/${userId}/suspend`);
  },

  // Admin Management
  getAllAdmins: async (): Promise<AdminUser[]> => {
    return api.get<AdminUser[]>('/admin/admins');
  },

  getAdminById: async (adminId: string): Promise<AdminUser> => {
    return api.get<AdminUser>(`/admin/admins/${adminId}`);
  },
};