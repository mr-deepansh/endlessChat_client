import {
  Bell,
  Home,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Search,
  Settings,
  Shield,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useDebounce } from '../../hooks/useDebounce';
import { userService } from '../../services';
import type { User } from '../../types/api';
import NotificationBell from '../notifications/NotificationBell';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
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
        const response = await userService.searchUsers(query.trim(), 1, 5);
        if (response && response.users) {
          const users = response.users.slice(0, 5);
          setSearchResults(users);
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
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18 xl:h-20 2xl:h-24">
          {/* Logo */}
          <Link to={user ? '/feed' : '/'} className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl">E</span>
            </div>
            <span className="font-bold text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl gradient-text hidden sm:block">EndlessChatt</span>
          </Link>

          {/* Search Bar - Only show when user is logged in */}
          {user && !isLoading && (
            <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl mx-2 sm:mx-4 lg:mx-6 xl:mx-8 relative">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 z-10" />
                {isSearching && (
                  <Loader2 className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 animate-spin z-10" />
                )}
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => handleSearchInput(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="pl-10 sm:pl-12 lg:pl-14 pr-10 sm:pr-12 lg:pr-14 bg-background/80 backdrop-blur-sm border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-full h-9 sm:h-10 lg:h-12 xl:h-14 2xl:h-16 rounded-full shadow-sm hover:shadow-md text-sm sm:text-base lg:text-lg"
                />
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-50 max-h-60 sm:max-h-80 overflow-y-auto">
                  {searchResults.map((result: User) => (
                    <div
                      key={result.id || result._id}
                      className="flex items-center p-2 sm:p-3 hover:bg-primary/5 cursor-pointer transition-all duration-200 first:rounded-t-xl last:rounded-b-xl border-b border-border/30 last:border-b-0"
                      onClick={() => {
                        navigate(`/u/${result.username}`);
                        setShowSearchResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9 mr-2 sm:mr-3 ring-2 ring-primary/10">
                        <AvatarImage src={result.avatar} alt={result.username} />
                        <AvatarFallback className="bg-gradient-primary text-white text-xs sm:text-sm">
                          {result.firstName?.[0] || result.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-foreground">
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
            <div className="hidden lg:flex items-center space-x-4 lg:space-x-6 xl:space-x-8 flex-1 justify-center">
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
                className={`text-sm lg:text-base font-medium transition-colors ${
                  location.pathname === '/about' ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                About
              </Link>
              <Link
                to="/features"
                className={`text-sm lg:text-base font-medium transition-colors ${
                  location.pathname === '/features' ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                Features
              </Link>
              <Link
                to="/contact"
                className={`text-sm lg:text-base font-medium transition-colors ${
                  location.pathname === '/contact' ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                Contact
              </Link>
            </div>
          )}

          {/* Navigation Items */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-muted animate-pulse"></div>
              </div>
            ) : user ? (
              <>
                {/* Main Navigation */}
                <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 xl:space-x-3 2xl:space-x-4">
                  <NavLink
                    to="/feed"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 2xl:h-12 2xl:w-12"
                  >
                    <Home className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </NavLink>
                  <NotificationBell />
                  <NavLink
                    to="/messages"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 2xl:h-12 2xl:w-12"
                  >
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </NavLink>
                  <NavLink
                    to="/discover"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 2xl:h-12 2xl:w-12"
                  >
                    <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </NavLink>
                  {(user.role === 'admin' || user.role === 'super_admin') && (
                    <NavLink
                      to={user.role === 'super_admin' ? '/super-admin' : '/admin'}
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 2xl:h-12 2xl:w-12"
                    >
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </NavLink>
                  )}

                  {/* Theme Toggle */}
                  <Button
                    variant="ghost"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 2xl:h-12 2xl:w-12"
                    onClick={toggleTheme}
                  >
                    {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
                  </Button>
                </nav>

                {/* Mobile Menu */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 md:hidden">
                      <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-64 sm:w-72 bg-background/95 backdrop-blur-xl border-l"
                  >
                    {/* Full Logo in Mobile Menu */}
                    <div className="flex items-center space-x-3 pb-4 sm:pb-6 border-b">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg sm:text-xl">E</span>
                      </div>
                      <span className="font-bold text-xl sm:text-2xl gradient-text">EndlessChatt</span>
                    </div>

                    <div className="flex flex-col space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                      {/* Mobile Search */}
                      <div className="mb-3 sm:mb-4">
                        <form onSubmit={handleSearch} className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5 z-10" />
                          <Input
                            type="text"
                            placeholder="Search users, posts..."
                            value={searchQuery}
                            onChange={e => handleSearchInput(e.target.value)}
                            className="pl-10 sm:pl-12 bg-background/80 backdrop-blur-sm border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-full h-9 sm:h-10 rounded-full text-sm sm:text-base"
                          />
                        </form>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                          <Link to="/feed" onClick={() => setMobileMenuOpen(false)}>
                            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                            <span className="text-sm sm:text-base">Home</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start relative h-10 sm:h-11">
                          <Link to="/notifications" onClick={() => setMobileMenuOpen(false)}>
                            <Bell className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                            <span className="text-sm sm:text-base">Notifications</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                          <Link to="/messages" onClick={() => setMobileMenuOpen(false)}>
                            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                            <span className="text-sm sm:text-base">Messages</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                          <Link to="/discover" onClick={() => setMobileMenuOpen(false)}>
                            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                            <span className="text-sm sm:text-base">Discover</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                          <Link
                            to={user.username ? `/u/${user.username}` : '/profile/me'}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                            <span className="text-sm sm:text-base">Profile</span>
                          </Link>
                        </Button>
                        <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                          <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                            <span className="text-sm sm:text-base">Settings</span>
                          </Link>
                        </Button>
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                          <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                            <Link
                              to={user.role === 'super_admin' ? '/super-admin' : '/admin'}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                              <span className="text-sm sm:text-base">Admin Panel</span>
                            </Link>
                          </Button>
                        )}

                        <Button variant="ghost" onClick={toggleTheme} className="justify-start h-10 sm:h-11">
                          {theme === 'light' ? (
                            <Moon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                          ) : (
                            <Sun className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                          )}
                          <span className="text-sm sm:text-base">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        </Button>

                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          className="justify-start text-red-600 h-10 sm:h-11"
                        >
                          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                          <span className="text-sm sm:text-base">Logout</span>
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
                      className="inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 2xl:h-12 2xl:w-12 hidden md:flex"
                    >
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 2xl:h-12 2xl:w-12">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold text-xs sm:text-sm lg:text-base xl:text-lg">
                          {user.firstName?.[0] || user.username?.[0] || 'U'}
                          {user.lastName?.[0] || ''}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 sm:w-72 lg:w-80" align="end" forceMount>
                    <div className="flex items-center space-x-3 p-3 sm:p-4">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback className="bg-gradient-primary text-white text-sm sm:text-base">
                          {user.firstName?.[0] || user.username?.[0] || 'U'}
                          {user.lastName?.[0] || ''}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-medium leading-none">
                          {user.firstName && user.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user.username || 'User'}
                        </p>
                        <p className="text-xs sm:text-sm leading-none text-muted-foreground mt-1">
                          @{user.username || 'username'}
                        </p>
                        {(user.role === 'admin' || user.role === 'super_admin') && (
                          <Badge
                            variant="secondary"
                            className="text-xs sm:text-sm mt-1 bg-primary/10 text-primary"
                          >
                            {user.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </Badge>
                        )}
                        <div className="flex items-center space-x-3 mt-2 text-xs sm:text-sm text-muted-foreground">
                          <span>{user.followersCount || 0} followers</span>
                          <span>{user.followingCount || 0} following</span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to={user.username ? `/u/${user.username}` : '/profile/me'}
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
                <Button
                  variant="ghost"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 sm:h-9 sm:w-9 lg:hidden">
                      <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-64 sm:w-72 bg-background/95 backdrop-blur-xl border-l"
                  >
                    {/* Full Logo in Mobile Menu */}
                    <div className="flex items-center space-x-3 pb-4 sm:pb-6 border-b">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg sm:text-xl">E</span>
                      </div>
                      <span className="font-bold text-xl sm:text-2xl gradient-text">EndlessChatt</span>
                    </div>

                    <div className="flex flex-col space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                      <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                        <Link to="/">
                          <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                          <span className="text-sm sm:text-base">Home</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                        <Link to="/about">
                          <span className="text-sm sm:text-base">About</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                        <Link to="/features">
                          <span className="text-sm sm:text-base">Features</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                        <Link to="/contact">
                          <span className="text-sm sm:text-base">Contact</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                        <Link to="/privacy">
                          <span className="text-sm sm:text-base">Privacy</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                        <Link to="/terms">
                          <span className="text-sm sm:text-base">Terms</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" asChild className="justify-start h-10 sm:h-11">
                        <Link to="/support">
                          <span className="text-sm sm:text-base">Support</span>
                        </Link>
                      </Button>
                      <div className="pt-3 sm:pt-4 border-t space-y-2">
                        <Button variant="outline" asChild className="w-full h-10 sm:h-11">
                          <Link to="/login">
                            <span className="text-sm sm:text-base">Sign In</span>
                          </Link>
                        </Button>
                        <Button variant="gradient" asChild className="w-full h-10 sm:h-11">
                          <Link to="/register">
                            <span className="text-sm sm:text-base">Sign Up</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="hidden lg:flex items-center space-x-2">
                  <Button variant="outline" asChild>
                    <Link to="/login">
                      <span className="text-sm lg:text-base">Sign In</span>
                    </Link>
                  </Button>
                  <Button variant="gradient" asChild>
                    <Link to="/register">
                      <span className="text-sm lg:text-base">Sign Up</span>
                    </Link>
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
