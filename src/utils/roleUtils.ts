import { User } from '../types/api';

export const isSuperAdmin = (user: User | null): boolean => {
  return user?.role === 'super_admin';
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin' || user?.role === 'super_admin';
};

export const isUser = (user: User | null): boolean => {
  return user?.role === 'user';
};

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;

  // Super admin has all permissions
  if (user.role === 'super_admin') return true;

  // Admin permissions
  if (user.role === 'admin') {
    const adminPermissions = [
      'view_dashboard',
      'manage_users',
      'manage_content',
      'view_analytics',
      'manage_notifications',
    ];
    return adminPermissions.includes(permission);
  }

  // User permissions
  const userPermissions = [
    'create_post',
    'edit_own_post',
    'delete_own_post',
    'follow_users',
    'update_profile',
  ];

  return userPermissions.includes(permission);
};

export const getRoleDisplayName = (role: string): string => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'user':
      return 'User';
    default:
      return 'Unknown';
  }
};

export const canAccessAdminDashboard = (user: User | null): boolean => {
  return isAdmin(user);
};

export const canAccessSuperAdminDashboard = (user: User | null): boolean => {
  return isSuperAdmin(user);
};
