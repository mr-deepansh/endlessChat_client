import React from 'react';
import Navbar from '../../components/layout/Navbar';
import { SuperAdminDashboard } from '../../components/super_admin';
import { useAuth, useRoleAccess } from '../../contexts/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';

const SuperAdminDashboardPage: React.FC = () => {
  usePageTitle('Super Admin Dashboard');
  const { user } = useAuth();
  const { canAccessSuperAdmin } = useRoleAccess();

  if (!canAccessSuperAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <SuperAdminDashboard />
      </div>
    </div>
  );
};

export default SuperAdminDashboardPage;
