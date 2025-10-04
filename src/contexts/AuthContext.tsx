// src/contexts/AuthContext.tsx
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
import '../utils/cookieDebug';
import '../utils/authFix';
import '../utils/cookieTest';

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
  const initialCheckDone = useRef(false);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  // Enhanced cookie diagnostics
  const diagnoseCookies = () => {
    const cookies = document.cookie;
    console.log('🍪 Browser Cookies:', cookies);
    console.log('🍪 Has accessToken:', cookies.includes('accessToken'));
    console.log('🍪 Has refreshToken:', cookies.includes('refreshToken'));
    
    // Check User-Agent and other headers that might affect cookies
    console.log('🌐 Browser Info:', {
      userAgent: navigator.userAgent,
      cookieEnabled: navigator.cookieEnabled,
      origin: window.location.origin,
      protocol: window.location.protocol,
    });

    // Check if cookies are accessible
    if (!cookies) {
      console.warn(
        '⚠️ No cookies found in document.cookie - HttpOnly cookies are NOT visible here'
      );
      console.log('✅ This is NORMAL for HttpOnly cookies');
    }
    
    // Test manual cookie setting
    try {
      document.cookie = 'test=value; path=/; SameSite=None; Secure=false';
      const testCookie = document.cookie.includes('test=value');
      console.log('🧪 Cookie Test:', testCookie ? 'PASS' : 'FAIL');
      if (testCookie) {
        document.cookie = 'test=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      }
    } catch (error) {
      console.error('❌ Cookie Test Error:', error);
    }
    
    // Check localStorage tokens
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('💾 LocalStorage Tokens:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenLength: accessToken?.length || 0
    });
  };

  // Check for existing session on mount - ONLY ONCE
  useEffect(() => {
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;

    const checkAuth = async () => {
      try {
        diagnoseCookies();

        console.log('🔍 Checking authentication...');
        const response = await authService.getCurrentUser();

        console.log('✅ Auth check response:', {
          success: response.success,
          hasUser: !!response.data,
          userData: response.data
            ? {
                id: response.data._id,
                username: response.data.username,
                email: response.data.email,
              }
            : null,
        });

        if (response.data) {
          setUser(response.data);
          Logger.info('User authenticated successfully', {
            userId: response.data._id,
            username: response.data.username,
          });
        } else {
          setUser(null);
          Logger.info('No authenticated user found');
        }
      } catch (error: any) {
        console.error('❌ Auth check failed:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data,
        });

        Logger.error('Auth check failed', {
          error: error.message || 'Unknown error',
          code: error.code,
          status: error.response?.status,
        });

        // Don't set loading false yet - let error handling complete
        if (error.code === 'RATE_LIMIT_ERROR') {
          Logger.warn('Rate limited during auth check');
        } else if (error.code === 'NETWORK_ERROR') {
          Logger.warn('Network error during auth check');
        } else if (error.response?.status === 401) {
          Logger.info('User not authenticated (401)');
        }

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure app is fully mounted
    const timeoutId = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timeoutId);
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

    // Only set interval if we have a user
    refreshIntervalRef.current = setInterval(
      async () => {
        try {
          const response = await authService.getCurrentUser();
          if (response.data) {
            setUser(response.data);
          }
        } catch (error: any) {
          Logger.error('Failed to refresh user data', {
            error: error.message || 'Unknown error',
          });

          // Stop interval on auth errors
          if (error.code === 'NETWORK_ERROR' || error.response?.status === 401) {
            if (refreshIntervalRef.current) {
              clearInterval(refreshIntervalRef.current);
              refreshIntervalRef.current = null;
            }
            setUser(null);
          }
        }
      },
      5 * 60 * 1000 // 5 minutes
    );

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

      console.log('🔐 Attempting login...');
      const response = await authService.login(
        credentials.identifier,
        credentials.password,
        credentials.rememberMe
      );

      console.log('✅ Login response:', {
        success: response.success,
        hasUser: !!response.data?.user,
        message: response.message,
      });

      // Diagnose cookies after login
      setTimeout(() => {
        diagnoseCookies();
      }, 500);

      if (response.data?.user) {
        setUser(response.data.user);

        toast({
          title: `Welcome back, ${response.data.user.firstName}!`,
          description: "You're all set to explore and connect",
          duration: 4000,
        });

        navigate('/feed');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });

      toast({
        title: "Couldn't sign you in",
        description: error.message || 'Please check your credentials and try again',
        variant: 'destructive',
        duration: 4000,
      });
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
      });

      const response = await authService.register({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      // Diagnose cookies after registration
      setTimeout(() => {
        diagnoseCookies();
      }, 500);

      if (response?.data?.user || response?.user) {
        const user = response.data?.user || response.user;
        setUser(user);

        toast({
          title: `Welcome to EndlessChat, ${user.firstName}!`,
          description: 'Your account is ready. Start connecting!',
          duration: 5000,
        });

        setTimeout(() => {
          navigate('/feed');
        }, 100);
      } else {
        const errorMessage = response?.message || 'Registration failed';
        setRegistrationError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Unable to create account. Please try again.';
      setRegistrationError(errorMessage);

      toast({
        title: "Couldn't create account",
        description: errorMessage,
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
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }

      setUser(null);
      setIsLoading(false);

      await authService.logout();

      navigate('/', { replace: true });
    } catch (error: any) {
      Logger.error('Logout error', { error: error.message || 'Unknown error' });
      navigate('/', { replace: true });
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
    if (user.role === 'super_admin') return true;

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
  if (isLoading && !initialCheckDone.current) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

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
