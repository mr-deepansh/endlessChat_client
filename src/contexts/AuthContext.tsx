import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/ui/loading-screen';
import { toast } from '../hooks/use-toast';
import { authService } from '../services';
import { ChangePasswordRequest, LoginRequest, RegisterRequest, User } from '../types/api';
import Logger from '../utils/logger';
import { AuthPersistence } from '../utils/authPersistence';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registrationError: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: any) => Promise<void>;
  changePassword: (passwordData: ChangePasswordRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserStats: (stats: { followingCount?: number; followersCount?: number }) => void;
  refreshUserAfterFollow: () => Promise<void>;
  clearRegistrationError: () => void;
  checkPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const navigate = useNavigate();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for valid stored token first
        if (!AuthPersistence.hasValidToken()) {
          Logger.info('No valid authentication found, user not logged in');
          setUser(null);
          setIsLoading(false);
          return;
        }

        // Try to get current user - this will validate the session
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
          Logger.info('User session restored successfully');
        } else {
          // Clear invalid tokens
          AuthPersistence.clearTokens();
          setUser(null);
        }
      } catch (error: any) {
        Logger.error('Auth check failed', { error: error.message || 'Unknown error' });

        // Handle different error types
        if (error.code === 'RATE_LIMIT_ERROR') {
          Logger.warn('Rate limited during auth check, will retry later');
          // Don't clear user state on rate limit
        } else if (error.code === 'NETWORK_ERROR') {
          Logger.warn('Network error during auth check, keeping existing state');
          // Don't clear user state on network error
        } else if (error.response?.status === 401) {
          // Clear invalid authentication
          AuthPersistence.clearTokens();
          setUser(null);
        } else {
          // For other errors, keep existing state but log the error
          Logger.error('Unexpected error during auth check', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Auto-refresh user data periodically
  useEffect(() => {
    if (!isAuthenticated) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    refreshIntervalRef.current = setInterval(
      async () => {
        try {
          const response = await authService.getCurrentUser();
          if (response.data) {
            setUser(response.data);
          }
        } catch (error: any) {
          Logger.error('Failed to refresh user data', { error: error.message || 'Unknown error' });

          // Handle rate limiting gracefully - don't spam the server
          if (error.code === 'RATE_LIMIT_ERROR') {
            Logger.warn('Rate limited during user refresh, will retry later');
          } else if (error.code === 'NETWORK_ERROR') {
            Logger.warn('Network error during user refresh, stopping interval');
            // Stop interval on network errors
            setUser(null);
            if (refreshIntervalRef.current) {
              clearInterval(refreshIntervalRef.current);
              refreshIntervalRef.current = null;
            }
          } else if (error.response?.status === 401) {
            // User logged out, clear state and stop trying
            setUser(null);
            if (refreshIntervalRef.current) {
              clearInterval(refreshIntervalRef.current);
              refreshIntervalRef.current = null;
            }
          } else {
            // Stop interval on any other error to prevent spam
            if (refreshIntervalRef.current) {
              clearInterval(refreshIntervalRef.current);
              refreshIntervalRef.current = null;
            }
          }
        }
      },
      5 * 60 * 1000
    ); // Refresh every 5 minutes

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [isAuthenticated]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.data) {
        setUser(response.data);
      } else {
        throw new Error('Failed to get user data');
      }
    } catch (error: any) {
      Logger.error('Failed to refresh user', { error: error.message || 'Unknown error' });
      throw error;
    }
  }, []);

  const updateUserStats = useCallback(
    (stats: { followingCount?: number; followersCount?: number }) => {
      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          followingCount:
            stats.followingCount !== undefined ? stats.followingCount : prev.followingCount,
          followersCount:
            stats.followersCount !== undefined ? stats.followersCount : prev.followersCount,
        };
      });
    },
    []
  );

  const refreshUserAfterFollow = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error: any) {
      Logger.error('Failed to refresh user after follow', {
        error: error.message || 'Unknown error',
      });
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);

      const response = await authService.login({
        identifier: credentials.identifier,
        password: credentials.password,
        rememberMe: credentials.rememberMe
      });

      if (response.success && response.data?.user) {
        setUser(response.data.user);

        // Store tokens for persistence
        const token = response.data.token || response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        
        if (token) {
          AuthPersistence.setTokens(token, refreshToken);
        }

        toast({
          title: `Welcome back, ${response.data.user.firstName}! 👋`,
          description: "You're all set to explore and connect",
          duration: 4000,
        });

        // Always redirect to feed after login
        navigate('/feed');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast({
        title: "Couldn't sign you in",
        description: 'Please check your credentials and try again',
        variant: 'destructive',
        duration: 4000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);
      setRegistrationError(null);

      Logger.debug('Registering user', {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      const response = await authService.register(userData);

      Logger.debug('Registration completed successfully');

      if (response.success && (response.data?.user || response.user)) {
        const user = response.data?.user || response.user;
        setUser(user);

        // Store tokens for persistence
        const token = response.data?.token || response.data?.accessToken;
        const refreshToken = response.data?.refreshToken;
        
        if (token) {
          AuthPersistence.setTokens(token, refreshToken);
        }

        toast({
          title: `Welcome to EndlessChat, ${user.firstName}! 🎉`,
          description: 'Your account is ready. Start connecting!',
          duration: 5000,
        });

        // Small delay to ensure state is updated
        setTimeout(() => {
          navigate('/feed');
        }, 100);
      } else {
        Logger.error('Registration failed - invalid response');
        const errorMessage = response?.message || 'Registration failed - invalid response';
        setRegistrationError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Unable to create account. Please try again.';
      setRegistrationError(errorMessage);

      toast({
        title: "Couldn't create account",
        description: 'Something went wrong. Please try again',
        variant: 'destructive',
        duration: 4000,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearRegistrationError = () => {
    setRegistrationError(null);
  };

  const logout = async () => {
    try {
      // Clear interval immediately
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }

      // Clear user state immediately to stop intervals
      setUser(null);
      setIsLoading(false);

      // Clear all stored tokens
      AuthPersistence.clearTokens();

      await authService.logout();
    } catch (error: any) {
      Logger.error('Logout error', { error: error.message || 'Unknown error' });
    } finally {
      // Force page reload to clear any cached state
      window.location.href = '/';
    }
  };

  const updateProfile = async (userData: any) => {
    try {
      const response = await authService.updateProfile(userData);

      if (response.data) {
        setUser(response.data);

        toast({
          title: 'Profile updated',
          description: 'Your changes have been saved',
          duration: 3000,
        });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: "Couldn't save changes. Try again",
        variant: 'destructive',
        duration: 4000,
      });
      throw error;
    }
  };

  const changePassword = async (passwordData: ChangePasswordRequest) => {
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });

      toast({
        title: 'Password Changed Successfully',
        description: 'Logging out for security...',
      });

      // Immediate logout for security
      setTimeout(() => logout(), 1500);
    } catch (error: any) {
      toast({
        title: 'Password update failed',
        description: "Couldn't update password. Try again",
        variant: 'destructive',
        duration: 4000,
      });
      throw error;
    }
  };

  const checkPermission = (permission: string): boolean => {
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

  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }

    return user.role === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    registrationError,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    updateUserStats,
    refreshUserAfterFollow,
    clearRegistrationError,
    checkPermission,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };

  // Show loading screen during initial auth check
  if (isLoading) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

// Hook for role-based access control
export const useRoleAccess = () => {
  const { hasRole, checkPermission, isAdmin, isSuperAdmin } = useAuth();

  return {
    hasRole,
    checkPermission,
    isAdmin,
    isSuperAdmin,
    canAccessAdmin: () => hasRole(['admin', 'super_admin']),
    canAccessSuperAdmin: () => hasRole('super_admin'),
    canManageUsers: () => checkPermission('manage_users'),
    canManageContent: () => checkPermission('manage_content'),
    canViewAnalytics: () => checkPermission('view_analytics'),
  };
};
