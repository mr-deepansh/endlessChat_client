import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin, isSuperAdmin } from '@/utils/roleUtils';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  adminOnly = false,
  superAdminOnly = false,
  redirectTo,
}) => {
  let user, isLoading;

  try {
    const authContext = useAuth();
    user = authContext.user;
    isLoading = authContext.isLoading;
  } catch (error) {
    console.error('ProtectedRoute: AuthContext not available:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-destructive">Authentication system unavailable</p>
        </div>
      </div>
    );
  }

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to={redirectTo || '/login'} state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (adminOnly && !isAdmin(user)) {
    return <Navigate to="/feed" replace />;
  }
  
  // If super admin access is required but user is not super admin
  if (superAdminOnly && !isSuperAdmin(user)) {
    return <Navigate to="/feed" replace />;
  }

  // If user is logged in but trying to access auth pages (login/register)
  if (!requireAuth && user) {
    const from = location.state?.from?.pathname || '/feed';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
