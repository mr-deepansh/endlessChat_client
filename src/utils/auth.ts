// src/utils/auth.ts
import { User } from '@/contexts/AuthContext';
import SecureStorage from './secureStorage';

/**
 * Safely get token from secure storage
 */
export const getStoredToken = (): string | null => {
  try {
    return SecureStorage.getAccessToken();
  } catch {
    return null;
  }
};

/**
 * Safely get user from sessionStorage (non-sensitive data)
 */
export const getStoredUser = (): User | null => {
  try {
    const userStr = sessionStorage.getItem('user_profile');
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    return isValidUser(user) ? user : null;
  } catch {
    return null;
  }
};

/**
 * Safely store auth data
 */
export const storeAuthData = (token: string, user: User): void => {
  try {
    SecureStorage.setAccessToken(token);
    // Store non-sensitive user profile data in sessionStorage
    const userProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatar: user.avatar,
    };
    sessionStorage.setItem('user_profile', JSON.stringify(userProfile));
  } catch (error) {}
};

/**
 * Safely clear auth data
 */
export const clearAuthData = (): void => {
  try {
    SecureStorage.clearTokens();
    sessionStorage.removeItem('user_profile');
  } catch (error) {}
};

/**
 * Validate user object structure
 */
export const isValidUser = (user: any): user is User => {
  return (
    user &&
    typeof user === 'object' &&
    typeof user._id === 'string' &&
    typeof user.username === 'string' &&
    typeof user.email === 'string'
  );
};

/**
 * Check if token is expired (basic JWT check)
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    return payload.exp < now;
  } catch {
    return true; // If we can't parse, assume expired
  }
};

/**
 * Get user role from user object
 */
export const getUserRole = (user: User | null): string => {
  return user?.role || 'user';
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (user: User | null): boolean => {
  const role = getUserRole(user);
  return role === 'admin' || role === 'super_admin';
};

/**
 * Check if user has super admin privileges
 */
export const isSuperAdmin = (user: User | null): boolean => {
  const role = getUserRole(user);
  return role === 'super_admin';
};

/**
 * Format user display name
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return 'Anonymous';
  return user.username || user.email || 'User';
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = (user: User | null): string => {
  if (!user) return 'A';

  const name = getUserDisplayName(user);
  const words = name.split(' ');

  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  return name.substring(0, 2).toUpperCase();
};

/**
 * Check if auth data exists and is valid
 */
export const hasValidAuthData = (): boolean => {
  const token = getStoredToken();
  const user = getStoredUser();

  return !!(token && user && !isTokenExpired(token));
};

/**
 * Debounce function for API calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Create a promise that resolves after a delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'An unexpected error occurred';
};

export default {
  getStoredToken,
  getStoredUser,
  storeAuthData,
  clearAuthData,
  isValidUser,
  isTokenExpired,
  getUserRole,
  isAdmin,
  isSuperAdmin,
  getUserDisplayName,
  getUserInitials,
  hasValidAuthData,
  debounce,
  delay,
  formatErrorMessage,
};
