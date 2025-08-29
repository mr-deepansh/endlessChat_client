import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { userService } from '../../services';
import { User } from '../../types/api';
import {
  Search,
  Home,
  User as UserIcon,
  Settings,
  LogOut,
  Bell,
  MessageCircle,
  Shield,
  Sun,
  Moon,
  Loader2,
  Menu,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';

const Navbar = () => {
  const { user, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
    }
  };

  const debouncedSearch = React.useCallback(
    debounceFunction(async (query: string) => {
      if (query.trim().length > 2) {
        setIsSearching(true);
        try {
          const response = await userService.searchUsers({ username: query.trim(), limit: 5 });
          if (response.success && response.data) {
            let users: any[] = [];

            // Handle different response formats
            if (Array.isArray(response.data)) {
              users = response.data;
            } else if (response.data.users && Array.isArray(response.data.users)) {
              users = response.data.users;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              users = response.data.data;
            } else {
              // If it's an object, try to extract user-like properties
              users = [response.data].filter(item => item && item._id);
            }

            setSearchResults(users.slice(0, 5));
            setShowSearchResults(users.length > 0);
          }
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
          setShowSearchResults(false);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500),
    []
  );

  function debounceFunction<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/feed' : '/'} className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl gradient-text hidden sm:block">EndlessChat</span>
          </Link>

          {/* Search Bar - Only show when user is logged in */}
          {user && !isLoading && (
            <div className="hidden min-[375px]:flex flex-1 max-w-xs mx-4 relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin" />
                )}
                <Input
                  type="text"
                  placeholder="Search users, posts..."
                  value={searchQuery}
                  onChange={e => handleSearchInput(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="pl-10 pr-10 bg-muted/50 border-none focus:bg-background transition-all w-full"
                />
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((result: User) => (
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
                        <p className="text-sm font-medium">
                          {result.firstName} {result.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">@{result.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation Links - Show when user is not logged in */}
          {!user && (
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/' ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/about' ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                About
              </Link>
              <Link
                to="/features"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/features' ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                Features
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/contact' ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                Contact
              </Link>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                {/* Main Navigation */}
                <div className="hidden min-[631px]:flex items-center space-x-1 lg:space-x-2">
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
                  {(user.role === 'admin' || user.role === 'super_admin') && (
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={user.role === 'super_admin' ? '/super-admin' : '/admin'}>
                        <Shield className="w-5 h-5" />
                      </Link>
                    </Button>
                  )}

                  {/* Theme Toggle */}
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </Button>
                </div>

                {/* Mobile Menu */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="min-[631px]:hidden">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-64 bg-background/80 backdrop-blur-xl border-l"
                  >
                    {/* Full Logo in Mobile Menu */}
                    <div className="flex items-center space-x-3 pb-6 border-b">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold text-lg">E</span>
                      </div>
                      <span className="font-bold text-2xl gradient-text">EndlessChat</span>
                    </div>

                    <div className="flex flex-col space-y-4 mt-6">
                      <div className="flex flex-col space-y-2">
                        <Button variant="ghost" asChild className="justify-start">
                          <Link to="/feed" onClick={() => setMobileMenuOpen(false)}>
                            <Home className="w-5 h-5 mr-3" />
                            Home
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start relative">
                          <Link to="/notifications" onClick={() => setMobileMenuOpen(false)}>
                            <Bell className="w-5 h-5 mr-3" />
                            Notifications
                            {notifications > 0 && (
                              <Badge className="ml-auto h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                                {notifications > 99 ? '99+' : notifications}
                              </Badge>
                            )}
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start">
                          <Link to="/messages" onClick={() => setMobileMenuOpen(false)}>
                            <MessageCircle className="w-5 h-5 mr-3" />
                            Messages
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start">
                          <Link
                            to={user.username ? `/@${user.username}` : '/profile/me'}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <UserIcon className="w-5 h-5 mr-3" />
                            Profile
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start">
                          <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                            <Settings className="w-5 h-5 mr-3" />
                            Settings
                          </Link>
                        </Button>
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                          <Button variant="ghost" asChild className="justify-start">
                            <Link
                              to={user.role === 'super_admin' ? '/super-admin' : '/admin'}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Shield className="w-5 h-5 mr-3" />
                              Admin Panel
                            </Link>
                          </Button>
                        )}

                        <Button variant="ghost" onClick={toggleTheme} className="justify-start">
                          {theme === 'light' ? (
                            <Moon className="w-5 h-5 mr-3" />
                          ) : (
                            <Sun className="w-5 h-5 mr-3" />
                          )}
                          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="justify-start text-red-600"
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hidden min-[631px]:flex"
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                          {user.firstName?.[0] || user.username?.[0] || 'U'}
                          {user.lastName?.[0] || ''}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <div className="flex items-center space-x-3 p-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {user.firstName?.[0] || user.username?.[0] || 'U'}
                          {user.lastName?.[0] || ''}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground mt-1">
                          @{user.username || 'username'}
                        </p>
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                          <Badge
                            variant="secondary"
                            className="text-xs mt-1 bg-primary/10 text-primary"
                          >
                            {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </Badge>
                        )}
                        <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                          <span>{user.followersCount || 0} followers</span>
                          <span>{user.followingCount || 0} following</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to={user.username ? `/@${user.username}` : '/profile/me'}
                        className="cursor-pointer"
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    {(user.role === 'admin' || user.role === 'super_admin') && (
                      <DropdownMenuItem asChild>
                        <Link
                          to={user.role === 'super_admin' ? '/super-admin' : '/admin'}
                          className="cursor-pointer"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          {user.role === 'super_admin' ? 'Super Admin Panel' : 'Admin Panel'}
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
              <div className="flex items-center space-x-2">
                {/* Theme Toggle for non-authenticated users */}
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-64 bg-background/80 backdrop-blur-xl border-l"
                  >
                    {/* Full Logo in Mobile Menu */}
                    <div className="flex items-center space-x-3 pb-6 border-b">
                      <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-bold text-lg">E</span>
                      </div>
                      <span className="font-bold text-2xl gradient-text">EndlessChat</span>
                    </div>

                    <div className="flex flex-col space-y-4 mt-6">
                      <Button variant="ghost" asChild className="justify-start">
                        <Link to="/">
                          <Home className="w-5 h-5 mr-3" />
                          Home
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link to="/about">About</Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link to="/features">Features</Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link to="/contact">Contact</Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link to="/privacy">Privacy</Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link to="/terms">Terms</Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start">
                        <Link to="/support">Support</Link>
                      </Button>
                      <div className="pt-4 border-t">
                        <Button variant="outline" asChild className="w-full mb-2">
                          <Link to="/login">Sign In</Link>
                        </Button>
                        <Button variant="gradient" asChild className="w-full">
                          <Link to="/register">Sign Up</Link>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="hidden lg:flex items-center space-x-2">
                  <Button variant="outline" asChild>
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button variant="gradient" asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
