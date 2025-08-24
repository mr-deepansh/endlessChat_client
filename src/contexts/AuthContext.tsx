import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { userService, type User, type LoginData, type RegisterData } from '@/services/userService';
import { cacheService } from '@/services/core/cache';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  registrationError: string | null;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateUser: (userData: User) => void;
  refreshUser: () => Promise<void>;
  clearRegistrationError: () => void;
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
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userData = await userService.getProfile();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      // Silent error handling - only clear auth on 401
      if (error.response?.status === 401 || error.response?.status === 404) {
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
      // Remove mailto: prefix if present
      const cleanIdentifier = identifier.startsWith('mailto:') ? identifier.replace('mailto:', '') : identifier;
      
      // Try different data formats that backend might expect
      const loginData = {
        identifier: cleanIdentifier,
        password: password,
        rememberMe: rememberMe
      };
      
      console.log('🔄 AuthContext: Calling login with:', loginData);
      
      const response = await userService.login(loginData);
      console.log('📊 AuthContext: Login response received:', response);
      console.log('📊 Full response structure:', JSON.stringify(response, null, 2));
      
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
      
      console.log('👤 Final user data being set:', userData);
      console.log('🔐 User role:', userData.role);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      const welcomeMessage = userData.role === 'admin' || userData.role === 'superadmin' 
        ? `Welcome back, ${userData.role}!` 
        : "Welcome back!";
      
      toast({
        title: welcomeMessage,
        description: userData.role === 'admin' || userData.role === 'superadmin'
          ? "Redirecting to admin dashboard..."
          : "You've been successfully logged in.",
      });
      
      return true;
    } catch (error: any) {
      console.error('❌ AuthContext: Login error:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error data:', error.response?.data);
      
      // Fallback authentication for development/demo
      if (import.meta.env.VITE_ENABLE_DEBUG === 'true' && 
          (identifier === 'admin@admin.com' || identifier === 'test@test.com')) {
        const mockUser = {
          _id: identifier === 'admin@admin.com' ? 'admin-123' : 'user-123',
          username: identifier === 'admin@admin.com' ? 'admin' : 'testuser',
          email: identifier,
          firstName: identifier === 'admin@admin.com' ? 'Admin' : 'Test',
          lastName: 'User',
          role: (identifier === 'admin@admin.com' ? 'admin' : 'user') as const,
          isActive: true,
          followersCount: 0,
          followingCount: 0,
          postsCount: 0,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face'
        };
        
        localStorage.setItem('token', `mock-${mockUser.role}-token`);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast({
          title: "Demo Login Successful!",
          description: "Using fallback authentication for development.",
        });
        
        return true;
      }
      
      toast({
        title: "Login failed",
        description: error.response?.data?.message || error.message || "Please check your credentials and ensure the backend is running.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    setRegistrationError(null);
    
    try {
      await userService.register(userData);
      
      // Auto-login after successful registration
      const loginSuccess = await login(userData.email, userData.password);
      
      // If email login fails, try with username
      if (!loginSuccess) {
        console.log('Email login failed, trying with username...');
        await login(userData.username, userData.password);
      }
      
      if (loginSuccess) {
        // Toast message will be handled by login function based on role
      } else {
        toast({
          title: "Registration successful!",
          description: "Please login with your new account.",
        });
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Handle specific error messages securely
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.response?.data?.error) {
        const serverError = error.response.data.error;
        if (serverError.includes('Email address is already registered')) {
          errorMessage = "This email address is already registered. Please use a different email or try logging in.";
        } else if (serverError.includes('Username already exists')) {
          errorMessage = "This username is already taken. Please choose a different username.";
        } else if (serverError.includes('Password')) {
          errorMessage = "Password does not meet security requirements.";
        }
      }
      
      setRegistrationError(errorMessage);
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return { success: false, error: errorMessage };
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

  const clearRegistrationError = (): void => {
    setRegistrationError(null);
  };

  const value = {
    user,
    isLoading,
    registrationError,
    login,
    register,
    logout,
    updateProfile,
    updateUser,
    refreshUser,
    clearRegistrationError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};