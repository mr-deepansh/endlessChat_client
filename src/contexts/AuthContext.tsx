import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { userService, type User, type LoginData, type RegisterData } from '@/services/userService';
import { cacheService } from '@/services/core/cache';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

      console.log('🔍 Checking auth with token:', token ? 'exists' : 'missing');
      const userData = await userService.getProfile();
      console.log('✅ Auth check successful, user:', userData.username);
      setUser(userData);
    } catch (error: any) {
      console.error('❌ Auth check failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    try {
      // Try different login data formats based on backend requirements
      let loginData: LoginData;
      
      // First try with emailOrUsername field (common backend pattern)
      try {
        loginData = { emailOrUsername, password };
        const response = await userService.login(loginData);
        
        const token = (response as any)?.data?.accessToken || (response as any)?.accessToken || (response as any)?.token;
        const userData = (response as any)?.data?.user || (response as any)?.user;
        
        console.log('✅ Login successful, user:', userData?.username);
        localStorage.setItem('token', token);
        setUser(userData);
        
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
        
        return true;
      } catch (firstError: any) {
        console.log('🔄 First login attempt failed, trying fallback method');
        // If emailOrUsername field fails, try separate email/username fields
        const isEmail = emailOrUsername.includes('@');
        loginData = isEmail 
          ? { email: emailOrUsername, password }
          : { username: emailOrUsername, password };
        
        const response = await userService.login(loginData);
        
        const token = (response as any)?.data?.accessToken || (response as any)?.accessToken || (response as any)?.token;
        const userData = (response as any)?.data?.user || (response as any)?.user;
        
        console.log('✅ Login successful (fallback), user:', userData?.username);
        localStorage.setItem('token', token);
        setUser(userData);
        
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
        
        return true;
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Please check your credentials.",
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
      cacheService.clear(); // Clear all cache on logout
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
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await userService.getProfile();
      setUser(userData);
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