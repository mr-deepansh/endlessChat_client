import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { userService, type User, type LoginData, type RegisterData } from '@/services/userService';
import { cacheService } from '@/services/core/cache';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateUser: (userData: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cachedUser = localStorage.getItem('user');
    try {
      const parsed = cachedUser ? JSON.parse(cachedUser) : null;
      // Validate that cached user has required fields
      if (parsed && parsed._id && parsed.username && parsed.email) {
        return parsed;
      }
      // Clear invalid cached data
      if (cachedUser) localStorage.removeItem('user');
      return null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const cachedUser = localStorage.getItem('user');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Always fetch fresh user data to ensure it's complete and up-to-date
      console.log('🔍 Fetching user profile from API...');
      const userData = await userService.getProfile();
      console.log('📊 API Response:', userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      console.error('Auth check failed:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string, rememberMe: boolean = false): Promise<boolean> => {
    try {
      const loginData: LoginData = { identifier, password, rememberMe };
      console.log('🔄 AuthContext: Calling login with:', loginData);
      
      const response = await userService.login(loginData);
      console.log('📊 AuthContext: Login response received:', response);
      
      const token = response.data?.accessToken || response.accessToken;
      const userData = response.data?.user || response.user;
      
      console.log('🔑 Token:', token ? 'exists' : 'missing');
      console.log('👤 User data:', userData);
      
      if (!token) {
        throw new Error('No access token received from server');
      }
      
      if (!userData) {
        throw new Error('No user data received from server');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      
      return true;
    } catch (error: any) {
      console.error('❌ AuthContext: Login error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      
      toast({
        title: "Login failed",
        description: error.response?.data?.message || error.message || "Please check your credentials.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      await userService.register(userData);
      
      toast({
        title: "Registration successful!",
        description: "Please login with your new account.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await userService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      cacheService.clear();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You've been successfully logged out.",
      });
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUser = (userData: User): void => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await userService.getProfile();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};