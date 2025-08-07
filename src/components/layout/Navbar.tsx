import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { userService } from '@/services/userService';
import { socialService } from '@/services/socialService';
import { debounce } from '@/utils/debounce';
import {
  Search,
  Home,
  User,
  Settings,
  LogOut,
  Bell,
  MessageCircle,
  Plus,
  Shield,
  Sun,
  Moon,
  Loader2,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState(0);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
    }
  };

  const debouncedSearch = debounce(async (query: string) => {
    if (query.trim().length > 2) {
      setIsSearching(true);
      try {
        const results = await userService.searchUsers(query.trim());
        setSearchResults(results.slice(0, 5));
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, 300);

  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Simulate fetching notifications count
  useEffect(() => {
    if (user) {
      // This would be replaced with actual API call
      setNotifications(3); // Mock notification count
    }
  }, [user]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">E</span>
            </div>
            <span className="font-bold text-lg sm:text-xl gradient-text hidden xs:block">EndlessChat</span>
            <span className="font-bold text-lg sm:text-xl gradient-text xs:hidden">EC</span>
          </Link>

          {/* Search Bar - Hidden on mobile, shown on tablet+ */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8 relative">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
              )}
              <Input
                type="text"
                placeholder="Search users, posts..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="pl-10 pr-10 bg-muted/50 border-none focus:bg-background transition-smooth"
              />
            </form>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {searchResults.map((result: any) => (
                  <div
                    key={result._id}
                    className="flex items-center p-3 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => {
                      navigate(`/@${result.username}`);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                  >
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarImage src={result.avatar} alt={result.username} />
                      <AvatarFallback className="bg-gradient-primary text-white text-xs">
                        {result.firstName?.[0] || result.username?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{result.firstName} {result.lastName}</p>
                      <p className="text-xs text-muted-foreground">@{result.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link to="/search">
                <Search className="w-5 h-5" />
              </Link>
            </Button>
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                 {/* Mobile Navigation */}
                <div className="flex md:hidden items-center space-x-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/feed">
                      <Home className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild className="relative">
                    <Link to="/notifications">
                      <Bell className="w-5 h-5" />
                      {notifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                          {notifications > 9 ? '9+' : notifications}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                  {user.role === 'admin' && (
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/admin">
                        <Shield className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>

                 {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/feed">
                      <Home className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild className="relative">
                    <Link to="/notifications">
                      <Bell className="w-5 h-5" />
                      {notifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                          {notifications > 99 ? '99+' : notifications}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to="/messages">
                      <MessageCircle className="w-5 h-5" />
                    </Link>
                  </Button>
                  {user.role === 'admin' && (
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/admin">
                        <Shield className="w-5 h-5" />
                      </Link>
                    </Button>
                  )}
                  
                  {/* Theme Toggle */}
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'light' ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Sun className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {/* Create Post Button */}
                <Button variant="gradient" size="sm" asChild className="shadow-primary/20 hover:shadow-primary/40 transition-all">
                  <Link to="/create">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Post</span>
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold text-xs sm:text-sm">
                          {user.firstName?.[0] || user.username?.[0] || 'U'}{user.lastName?.[0] || ''}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 sm:w-64" align="end" forceMount>
                    <div className="flex items-center space-x-3 p-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {user.firstName?.[0] || user.username?.[0] || 'U'}{user.lastName?.[0] || ''}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">@{user.username || 'username'}</p>
                        <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                          <span>{user.followersCount || 0} followers</span>
                          <span>{user.followingCount || 0} following</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={user.username ? `/@${user.username}` : '/profile/me'} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Theme Toggle for non-authenticated users */}
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <span className="hidden sm:inline">Sign In</span>
                    <span className="sm:hidden">In</span>
                  </Link>
                </Button>
                <Button variant="gradient" size="sm" asChild>
                  <Link to="/register">
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden">Up</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;