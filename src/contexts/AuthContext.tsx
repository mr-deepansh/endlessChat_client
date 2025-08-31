import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '../hooks/use-toast';
import { authService } from '../services/modules/auth.service';
import { userService } from '../services/modules/user.service';
import LoadingScreen from '../components/ui/loading-screen';
import {
  User,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '../types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registrationError: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: UpdateProfileRequest) => Promise<void>;
  changePassword: (passwordData: ChangePasswordRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
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

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isSuperAdmin = user?.role === 'super_admin';

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Auto-refresh user data periodically
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      async () => {
        try {
          const response = await authService.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      },
      5 * 60 * 1000
    ); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error('Failed to get user data');
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);

      const response = await authService.login(credentials);

      if (response.success && response.data) {
        setUser(response.data.user);

        toast({
          title: 'Welcome back!',
          description: `Hello ${response.data.user.firstName}, you're successfully logged in.`,
        });

        // Always redirect to feed after login
        navigate('/feed');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
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

      const response = await authService.register(userData);

      if (response.success && response.data) {
        setUser(response.data.user);

        toast({
          title: 'Welcome to EndlessChat!',
          description: 'Your account has been created successfully.',
        });

        navigate('/feed');
      } else {
        const errorMessage = response.message || 'Registration failed';
        setRegistrationError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Unable to create account. Please try again.';
      setRegistrationError(errorMessage);

      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
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
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);

      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });

      navigate('/login');
    }
  };

  const updateProfile = async (userData: UpdateProfileRequest) => {
    try {
      const response = await authService.updateProfile(userData);

      if (response.success && response.data) {
        setUser(response.data);

        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
        });
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const changePassword = async (passwordData: ChangePasswordRequest) => {
    try {
      const response = await authService.changePassword(passwordData);

      if (response.success) {
        toast({
          title: 'Password Changed',
          description: 'Your password has been changed successfully.',
        });
      } else {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      toast({
        title: 'Password Change Failed',
        description: error.message || 'Failed to change password. Please try again.',
        variant: 'destructive',
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
    clearRegistrationError,
    checkPermission,
    hasRole,
    isAdmin,
    isSuperAdmin,
  };

  // Show loading screen during initial auth check
  if (isLoading && !user) {
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
