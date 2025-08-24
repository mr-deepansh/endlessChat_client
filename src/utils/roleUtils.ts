import { User } from '@/services/userService';
import { ROLES } from './constants';

export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.SUPER_ADMIN].includes(user.role as any);
};

export const isSuperAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return [ROLES.SUPERADMIN, ROLES.SUPER_ADMIN].includes(user.role as any);
};

export const hasAdminRights = (user: User | null): boolean => {
  return isAdmin(user);
};

export const getUserDisplayName = (user: User): string => {
  return user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.username || 'User';
};

export const getUserInitials = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`;
  }
  return user.username?.[0]?.toUpperCase() || 'U';
};