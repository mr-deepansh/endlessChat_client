import LoadingScreen from '../ui/loading-screen';
import { useAuth } from '../../contexts/AuthContext';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true = require auth, false = require no auth (login/register pages)
  adminOnly?: boolean;
  superAdminOnly?: boolean;
}

interface LocationState {
  from?: string;
  error?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  adminOnly = false,
  superAdminOnly = false,
}) => {
  const { isAuthenticated, isLoading, user, error } = useAuth();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Handle authentication errors
  if (error && requireAuth) {
    return <Navigate to="/login" state={{ from: location.pathname, error }} replace />;
  }

  // Routes that require NO authentication (login, register, etc.)
  if (!requireAuth) {
    if (isAuthenticated) {
      // User is already logged in, redirect to feed or previous route
      const redirectTo = state?.from || '/feed';
      return <Navigate to={redirectTo} replace />;
    }
    return <>{children}</>;
  }

  // Routes that require authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Admin only
  if (adminOnly && user?.role !== 'admin' && user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4 p-8">
          <div className="text-6xl">🚫</div>
          <div className="text-gray-600 dark:text-gray-400">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Access Denied
            </h2>
            <p className="text-lg">You don't have admin privileges to access this page.</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Super admin only
  if (superAdminOnly && user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4 p-8">
          <div className="text-6xl">⚡</div>
          <div className="text-gray-600 dark:text-gray-400">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Super Admin Only
            </h2>
            <p className="text-lg">This area is restricted to super administrators only.</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
