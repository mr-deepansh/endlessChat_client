import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
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
import { useNotifications } from '../../contexts/NotificationContext';
import { userService } from '../../services';
import { useDebounce } from '../../hooks/useDebounce';
import NotificationBell from '../notifications/NotificationBell';
import type { User } from '../../types/api';
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
    }
  };

  const debouncedSearch = useDebounce(async (query: string) => {
    if (query.trim().length > 2) {
      setIsSearching(true);
      try {
        const response = await userService.searchUsers({ username: query.trim(), limit: 5 });
        if (response.success && response.data) {
          let users: User[] = [];

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
  }, 500);

  const handleSearchInput = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-16 xl:h-18 2xl:h-20">
          {/* Logo */}
          <Link to={user ? '/feed' : '/'} className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl gradient-text hidden sm:block">EndlessChatt</span>
          </Link>

          {/* Search Bar - Only show when user is logged in */}
          {user && !isLoading && (
            <div className="flex-1 max-w-xs lg:max-w-sm xl:max-w-md 2xl:max-w-lg mx-4 lg:mx-6 xl:mx-8 relative">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 animate-spin z-10" />
                )}
                <Input
                  type="text"
                  placeholder="Search users, posts..."
                  value={searchQuery}
                  onChange={e => handleSearchInput(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="pl-10 pr-10 bg-background/80 backdrop-blur-sm border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-full h-10 rounded-full shadow-sm hover:shadow-md"
                />
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                  {searchResults.map((result: User) => (
                    <div
                      key={result._id}
                      className="flex items-center p-3 hover:bg-primary/5 cursor-pointer transition-all duration-200 first:rounded-t-xl last:rounded-b-xl border-b border-border/30 last:border-b-0"
                      onClick={() => {
                        navigate(`/@${result.username}`);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <Avatar className="h-9 w-9 mr-3 ring-2 ring-primary/10">
                        <AvatarImage src={result.avatar} alt={result.username} />
                        <AvatarFallback className="bg-gradient-primary text-white text-xs">
                          {result.firstName?.[0] || result.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
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
                <nav className="hidden min-[631px]:flex items-center space-x-1 lg:space-x-2 xl:space-x-3 2xl:space-x-4">
                  <NavLink
                    to="/feed"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  >
                    <Home className="w-5 h-5" />
                  </NavLink>
                  <NotificationBell />
                  <NavLink
                    to="/messages"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </NavLink>
                  <NavLink
                    to="/discover"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                  >
                    <UserIcon className="w-5 h-5" />
                  </NavLink>
                  {(user.role === 'admin' || user.role === 'super_admin') && (
                    <NavLink
                      to={user.role === 'super_admin' ? '/super-admin' : '/admin'}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                    >
                      <Shield className="w-5 h-5" />
                    </NavLink>
                  )}

                  {/* Theme Toggle */}
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </Button>
                </nav>

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
                      <span className="font-bold text-2xl gradient-text">EndlessChatt</span>
                    </div>

                    <div className="flex flex-col space-y-4 mt-6">
                      {/* Mobile Search */}
                      <div className="mb-4">
                        <form onSubmit={handleSearch} className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 z-10" />
                          <Input
                            type="text"
                            placeholder="Search users, posts..."
                            value={searchQuery}
                            onChange={e => handleSearchInput(e.target.value)}
                            className="pl-10 bg-background/80 backdrop-blur-sm border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-full h-10 rounded-full"
                          />
                        </form>
                      </div>

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
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start">
                          <Link to="/messages" onClick={() => setMobileMenuOpen(false)}>
                            <MessageCircle className="w-5 h-5 mr-3" />
                            Messages
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start">
                          <Link to="/discover" onClick={() => setMobileMenuOpen(false)}>
                            <UserIcon className="w-5 h-5 mr-3" />
                            Discover
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
                      <span className="font-bold text-2xl gradient-text">EndlessChatt</span>
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
