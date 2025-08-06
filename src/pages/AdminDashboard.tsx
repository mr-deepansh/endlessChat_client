import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { AdminDashboardSkeleton } from '@/components/loaders/AdminDashboardSkeleton';
import { adminService, type AdminStats, type AdminUser } from '@/services/adminService';
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      return;
    }

    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats and users in parallel for better performance
      const [statsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers({ limit: 20 })
      ]);
      
      setStats(statsData);
      setUsers(usersData.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadAdminData();
      toast({
        title: "Data Refreshed",
        description: "Admin dashboard data has been updated.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await adminService.activateUser(userId);
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isActive: true } : u
      ));
      toast({
        title: "User Activated",
        description: "User has been successfully activated.",
      });
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      await adminService.suspendUser(userId);
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isActive: false } : u
      ));
      toast({
        title: "User Suspended",
        description: "User has been suspended.",
      });
    } catch (error) {
      console.error('Failed to suspend user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast({
        title: "User Deleted",
        description: "User has been permanently deleted.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleExportUsers = async () => {
    try {
      const blob = await adminService.exportUsers('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Users data has been exported successfully.",
      });
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <AdminDashboardSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage users and monitor platform activity</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportUsers}>
              <Download className="w-4 h-4 mr-2" />
              Export Users
            </Button>
            <Badge variant="secondary" className="bg-gradient-primary text-white">
              <Shield className="w-4 h-4 mr-1" />
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.newUsersToday ? `+${stats.newUsersToday} today` : '+12% from last month'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-social-repost" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalUsers ? `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total` : '95.5% of total users'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.postsToday ? `+${stats.postsToday} today` : '+8% from last week'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageSquare className="h-4 w-4 text-social-comment" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalComments?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.commentsToday ? `+${stats.commentsToday} today` : '+15% from last week'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspended</CardTitle>
                <UserX className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.suspendedUsers?.toLocaleString() || '0'}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalUsers ? `${((stats.suspendedUsers / stats.totalUsers) * 100).toFixed(1)}% of total` : '4.5% of total users'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management */}
        <Card className="bg-gradient-card border-none shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all platform users</CardDescription>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
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
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} alt={user.username} />
                          <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? 'default' : 'destructive'}>
                        {user.isActive ? 'Active' : 'Suspended'}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.followersCount}</TableCell>
                    <TableCell className="text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.isActive ? (
                            <DropdownMenuItem
                              onClick={() => handleSuspendUser(user._id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <UserX className="w-4 h-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleActivateUser(user._id)}>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;