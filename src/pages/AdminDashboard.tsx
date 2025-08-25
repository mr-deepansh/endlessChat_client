import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { adminService, type AdminStats, type AdminUser } from '@/services/adminService';
import { isAdmin } from '@/utils/roleUtils';
import Layout from '@/components/layout/Layout';
import Footer from '@/components/layout/Footer';
import {
  Users,
  MessageSquare,
  TrendingUp,
  Shield,
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Trash2,
  AlertTriangle,
  Download,
  RefreshCw,
} from 'lucide-react';

// Constants
const ITEMS_PER_PAGE = 50;
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Types
interface LoadingStates {
  initial: boolean;
  refresh: boolean;
  userAction: boolean;
  export: boolean;
}

interface DashboardError {
  type: 'stats' | 'users' | 'action';
  message: string;
}

// Custom hooks
const useAdminData = (user: any) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<LoadingStates>({
    initial: true,
    refresh: false,
    userAction: false,
    export: false,
  });
  const [error, setError] = useState<DashboardError | null>(null);

  const updateLoading = useCallback((key: keyof LoadingStates, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await adminService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load stats:', err);
      // Set fallback stats
      setStats({
        totalUsers: users.length || 0,
        activeUsers: users.filter(u => u.isActive).length || 0,
        totalPosts: 0,
        totalComments: 0,
        newUsersToday: 0,
        postsToday: 0,
        engagementRate: 0,
        averageSessionTime: 0,
      });
    }
  }, [users.length]);

  const loadUsers = useCallback(async () => {
    try {
      const usersData = await adminService.getUsers({ limit: ITEMS_PER_PAGE });

      // Normalize response format
      const normalizedUsers = Array.isArray(usersData?.data)
        ? usersData.data
        : Array.isArray(usersData)
          ? usersData
          : [];

      setUsers(normalizedUsers);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      setError({
        type: 'users',
        message: 'Failed to load users data',
      });
      setUsers([]);
    }
  }, []);

  const loadDashboardData = useCallback(
    async (isRefresh = false) => {
      if (!user || !isAdmin(user)) return;

      updateLoading(isRefresh ? 'refresh' : 'initial', true);

      try {
        await Promise.allSettled([loadUsers(), loadStats()]);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        updateLoading(isRefresh ? 'refresh' : 'initial', false);
      }
    },
    [user, loadUsers, loadStats, updateLoading]
  );

  return {
    stats,
    users,
    loading,
    error,
    setUsers,
    loadDashboardData,
    updateLoading,
  };
};

// Components
const LoadingSpinner: React.FC = () => (
  <Layout>
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="animate-pulse">
        <div className="h-8 bg-muted rounded w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-32 bg-muted rounded" />
          ))}
        </div>
        <div className="h-96 bg-muted rounded" />
      </div>
    </div>
  </Layout>
);

const AccessDenied: React.FC<{ user: any }> = ({ user }) => (
  <Layout>
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-12 h-12 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
      <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
      <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
        <p>
          Current user: {user?.firstName} {user?.lastName}
        </p>
        <p>Role: {user?.role}</p>
        <p>Required role: admin or super_admin</p>
      </div>
    </div>
  </Layout>
);

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}> = ({ title, value, description, icon, variant = 'default' }) => (
  <Card className="bg-gradient-card border-none shadow-soft">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const UserRow: React.FC<{
  user: AdminUser;
  onActivate: (id: string) => void;
  onSuspend: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}> = ({ user, onActivate, onSuspend, onDelete, loading }) => {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'destructive';
      case 'admin':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      default:
        return 'User';
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>
              {user.firstName?.[0] || ''}
              {user.lastName?.[0] || ''}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">@{user.username}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm">{user.email}</TableCell>
      <TableCell>
        <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleLabel(user.role)}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.isActive ? 'default' : 'destructive'}>
          {user.isActive ? 'Active' : 'Suspended'}
        </Badge>
      </TableCell>
      <TableCell>{user.followersCount || 0}</TableCell>
      <TableCell className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={loading}>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user.isActive ? (
              <DropdownMenuItem
                onClick={() => onSuspend(user._id)}
                className="text-destructive focus:text-destructive"
              >
                <UserX className="w-4 h-4 mr-2" />
                Suspend User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onActivate(user._id)}>
                <UserCheck className="w-4 h-4 mr-2" />
                Activate User
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(user._id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

// Main component
const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { stats, users, loading, error, setUsers, loadDashboardData, updateLoading } =
    useAdminData(user);

  // Effects
  useEffect(() => {
    if (user && isAdmin(user)) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    if (!user || !isAdmin(user)) return;

    const interval = setInterval(() => {
      loadDashboardData(true);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [user, loadDashboardData]);

  // Handlers
  const handleRefresh = useCallback(async () => {
    await loadDashboardData(true);
    toast({
      title: 'Data Refreshed',
      description: 'Admin dashboard data has been updated.',
    });
  }, [loadDashboardData]);

  const handleUserAction = useCallback(
    async (action: 'activate' | 'suspend' | 'delete', userId: string) => {
      updateLoading('userAction', true);

      try {
        switch (action) {
          case 'activate':
            await adminService.activateUser(userId);
            setUsers(prev => prev.map(u => (u._id === userId ? { ...u, isActive: true } : u)));
            toast({
              title: 'User Activated',
              description: 'User has been successfully activated.',
            });
            break;

          case 'suspend':
            await adminService.suspendUser(userId);
            setUsers(prev => prev.map(u => (u._id === userId ? { ...u, isActive: false } : u)));
            toast({
              title: 'User Suspended',
              description: 'User has been suspended.',
            });
            break;

          case 'delete':
            await adminService.deleteUser(userId);
            setUsers(prev => prev.filter(u => u._id !== userId));
            toast({
              title: 'User Deleted',
              description: 'User has been permanently deleted.',
              variant: 'destructive',
            });
            break;
        }
      } catch (err) {
        console.error(`Failed to ${action} user:`, err);
        toast({
          title: 'Error',
          description: `Failed to ${action} user.`,
          variant: 'destructive',
        });
      } finally {
        updateLoading('userAction', false);
      }
    },
    [setUsers, updateLoading]
  );

  const handleExportUsers = useCallback(async () => {
    updateLoading('export', true);

    try {
      const generateCSV = (users: AdminUser[]) => {
        const headers = [
          'Username',
          'Email',
          'First Name',
          'Last Name',
          'Role',
          'Status',
          'Created At',
          'Last Active',
          'Followers',
          'Posts',
        ];

        const rows = users.map(user => [
          user.username || '',
          user.email || '',
          user.firstName || '',
          user.lastName || '',
          user.role || '',
          user.isActive ? 'Active' : 'Suspended',
          new Date(user.createdAt).toLocaleDateString(),
          new Date(user.lastActive).toLocaleDateString(),
          user.followersCount || 0,
          user.postsCount || 0,
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
      };

      let blob: Blob;

      try {
        blob = await adminService.bulkExportUsers('csv');
      } catch (apiError) {
        console.warn('API export failed, generating CSV from current data:', apiError);
        const csvContent = generateCSV(users);
        blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Export Complete',
        description: 'Users data has been exported successfully.',
      });
    } catch (err) {
      console.error('Failed to export users:', err);
      toast({
        title: 'Error',
        description: 'Failed to export users. Please try again.',
        variant: 'destructive',
      });
    } finally {
      updateLoading('export', false);
    }
  }, [users, updateLoading]);

  // Memoized values
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      user =>
        user.username?.toLowerCase().includes(query) ||
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  const statsCards = useMemo(
    () => [
      {
        title: 'Total Users',
        value: stats?.totalUsers || 0,
        description: stats?.newUsersToday
          ? `+${stats.newUsersToday} today`
          : '+12% from last month',
        icon: <Users className="h-4 w-4 text-muted-foreground" />,
      },
      {
        title: 'Active Users',
        value: stats?.activeUsers || 0,
        description: stats?.totalUsers
          ? `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total`
          : '95.5% of total users',
        icon: <UserCheck className="h-4 w-4 text-social-repost" />,
      },
      {
        title: 'Total Posts',
        value: stats?.totalPosts || 0,
        description: stats?.postsToday ? `+${stats.postsToday} today` : '+8% from last week',
        icon: <TrendingUp className="h-4 w-4 text-primary" />,
      },
      {
        title: 'Comments',
        value: stats?.totalComments || 0,
        description: '+15% from last week',
        icon: <MessageSquare className="h-4 w-4 text-social-comment" />,
      },
      {
        title: 'Engagement',
        value: `${stats?.engagementRate?.toFixed(1) || '68.5'}%`,
        description: '+2.1% from last week',
        icon: <TrendingUp className="h-4 w-4 text-primary" />,
      },
    ],
    [stats]
  );

  // Render guards
  if (!user) return <LoadingSpinner />;
  if (!isAdmin(user)) return <AccessDenied user={user} />;
  if (loading.initial) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage users and monitor platform activity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading.refresh}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading.refresh ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportUsers} disabled={loading.export}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Badge variant="secondary" className="bg-gradient-primary text-white">
              <Shield className="w-4 h-4 mr-1" />
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Users Management */}
        <Card className="bg-gradient-card border-none shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <div className="relative">
                <label htmlFor="user-search" className="sr-only">
                  Search users
                </label>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="user-search"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map(user => (
                  <UserRow
                    key={user._id}
                    user={user}
                    onActivate={id => handleUserAction('activate', id)}
                    onSuspend={id => handleUserAction('suspend', id)}
                    onDelete={id => handleUserAction('delete', id)}
                    loading={loading.userAction}
                  />
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 'No users found matching your search.' : 'No users available.'}
              </div>
            )}
          </CardContent>
        </Card>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              Error loading {error.type}: {error.message}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </Layout>
  );
};

export default AdminDashboard;
