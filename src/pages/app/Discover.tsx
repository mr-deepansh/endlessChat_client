import { Filter, Search, TrendingUp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import LeftSidebar from '../../components/layout/LeftSidebar';
import Navbar from '../../components/layout/Navbar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import UserCard from '../../components/user/UserCard';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../hooks/use-toast';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { usePageTitle } from '../../hooks/usePageTitle';
import userService, { User } from '../../services/userService';

const Discover: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  usePageTitle('Discover People');

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'verified' | 'active'>('all');

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);

  useEffect(() => {
    loadUsers();
  }, [activeFilter]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      searchUsers();
    } else {
      loadUsers();
    }
  }, [debouncedSearchQuery]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const filters: any = {};

      // Only use backend-supported filters
      if (activeFilter === 'active') {
        filters.isActive = true;
      }

      const response = await userService.getAllUsers(1, 20, filters);
      let filteredUsers = response.users.filter(u => {
        const userId = (u as any)._id || (u as any).id;
        const currentUserId = (user as any)?._id || (user as any)?.id;
        return userId && userId !== currentUserId;
      });

      // Handle 'verified' filter on frontend since backend doesn't support it
      if (activeFilter === 'verified') {
        filteredUsers = filteredUsers.filter(u => (u as any).isVerified === true);
      }

      setUsers(filteredUsers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      setSearchLoading(true);
      const response = await userService.searchUsers(debouncedSearchQuery, 1, 20);
      const filteredUsers = response.users.filter(u => {
        const userId = (u as any)._id || (u as any).id;
        const currentUserId = (user as any)?._id || (user as any)?.id;
        return userId && userId !== currentUserId;
      });
      setUsers(filteredUsers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search users',
        variant: 'destructive',
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFollowChange = (userId: string, isFollowing: boolean, followersCount?: number) => {
    setUsers(prevUsers =>
      prevUsers.map(u =>
        u._id === userId || u.id === userId
          ? {
              ...u,
              isFollowing,
              followersCount: followersCount !== undefined ? followersCount : u.followersCount,
            }
          : u
      )
    );
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <LeftSidebar />
      <div className="ml-60 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Search and Filters */}
          <Card className="border-none shadow-soft bg-gradient-card mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users by name or username..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <Button
                    variant={activeFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={activeFilter === 'verified' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('verified')}
                  >
                    Verified
                  </Button>
                  <Button
                    variant={activeFilter === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('active')}
                  >
                    Active
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users List */}
            <div className="lg:col-span-2">
              {loading || searchLoading ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="border-none shadow-soft bg-gradient-card">
                      <CardContent className="p-6">
                        <div className="animate-pulse">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 bg-muted rounded-full" />
                            <div className="flex-1">
                              <div className="h-5 bg-muted rounded mb-2" />
                              <div className="h-4 bg-muted rounded w-2/3 mb-2" />
                              <div className="h-4 bg-muted rounded w-1/2" />
                            </div>
                            <div className="w-20 h-8 bg-muted rounded" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : users.length > 0 ? (
                <div className="space-y-4">
                  {users.map(user => (
                    <UserCard
                      key={user._id || user.id}
                      user={user as any}
                      currentUserId={user?._id || user?.id || ''}
                      onFollowChange={handleFollowChange}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-none shadow-soft bg-gradient-card">
                  <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {searchQuery ? 'No users found' : 'No users available'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? `No users match "${searchQuery}". Try a different search term.`
                        : 'Check back later for new users to follow.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Stats */}
                <Card className="border-none shadow-soft bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Community Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Users</span>
                        <Badge variant="outline">{users.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Active Users</span>
                        <Badge variant="outline">{users.filter(u => u.isActive).length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Verified Users</span>
                        <Badge variant="outline">{users.filter(u => u.isVerified).length}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="border-none shadow-soft bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>• Follow users with similar interests</p>
                      <p>• Check their recent posts before following</p>
                      <p>• Engage with their content to build connections</p>
                      <p>• Use search to find specific people</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
