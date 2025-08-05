import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import NotFound from '@/pages/NotFound';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user' 
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <NotFound />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <NotFound />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;