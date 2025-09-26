import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Search,
  Bell,
  MessageCircle,
  User,
  Bookmark,
  Settings,
  Plus,
  MoreHorizontal,
  LogOut,
  HelpCircle,
} from 'lucide-react';

interface LeftSidebarProps {
  className?: string;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCreatePost = () => {
    // Navigate to create post or open modal
    navigate('/create-post');
  };

  const navigationItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/feed',
      tooltip: 'Home Feed',
    },
    {
      name: 'Discover',
      icon: Search,
      path: '/discover',
      tooltip: 'Discover People',
    },
    {
      name: 'Notifications',
      icon: Bell,
      path: '/notifications',
      tooltip: 'Notifications',
    },
    {
      name: 'Messages',
      icon: MessageCircle,
      path: '/messages',
      tooltip: 'Messages',
    },
    {
      name: 'Bookmarks',
      icon: Bookmark,
      path: '/bookmarks',
      tooltip: 'Saved Posts',
    },
    {
      name: 'Profile',
      icon: User,
      path: user?.username ? `/u/${user.username}` : '/profile/me',
      tooltip: 'My Profile',
    },
  ];

  const SidebarItem = ({ item }: { item: (typeof navigationItems)[0] }) => {
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-3 rounded-lg transition-all duration-200 hover:bg-muted/50 group ${
            isActive ? 'bg-muted text-primary' : 'text-foreground hover:text-primary'
          }`
        }
      >
        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
        <span className="font-normal text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl hidden sm:inline">{item.name}</span>
        <span className="font-normal text-xs sm:hidden">{item.name.slice(0, 3)}</span>
      </NavLink>
    );
  };

  return (
    <div
      className={`fixed left-0 top-14 sm:top-16 lg:top-18 xl:top-20 2xl:top-24 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] lg:h-[calc(100vh-4.5rem)] xl:h-[calc(100vh-5rem)] 2xl:h-[calc(100vh-6rem)] w-56 sm:w-60 lg:w-64 xl:w-72 2xl:w-80 bg-card/95 backdrop-blur-xl border-r border-border/50 z-40 overflow-y-hidden ${className}`}
    >
      <div className="flex flex-col h-full px-3 sm:px-4 lg:px-5 xl:px-6 2xl:px-8 overflow-y-hidden">
        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 py-3 sm:py-4 lg:py-5 xl:py-6 2xl:py-8">
          {navigationItems.map(item => (
            <SidebarItem key={item.name} item={item} />
          ))}

          {/* Create Post Button */}
          <Button
            onClick={handleCreatePost}
            className="w-full h-9 sm:h-10 lg:h-11 xl:h-12 2xl:h-14 bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-full font-medium text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl mt-2 transition-all duration-200"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Create Post</span>
            <span className="sm:hidden">Post</span>
          </Button>
        </nav>

        {/* Bottom Section */}
        <div className="py-3 sm:py-4 lg:py-5 space-y-2 sm:space-y-3 border-t border-border/50">
          {/* User Profile */}
          <div
            className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-all duration-200"
            onClick={() => navigate(user?.username ? `/u/${user.username}` : '/profile/me')}
          >
            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 ring-1 ring-primary/20 hover:ring-primary/30 transition-all">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback className="bg-gradient-primary text-white text-xs sm:text-sm">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-normal text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">@{user?.username}</p>
            </div>
          </div>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full h-9 sm:h-10 lg:h-11 xl:h-12 2xl:h-14 bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-full font-medium text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl transition-all duration-200">
                <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">More</span>
                <span className="sm:hidden">•••</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 sm:w-48 lg:w-52">
              <DropdownMenuItem onClick={() => navigate('/help')} className="cursor-pointer">
                <HelpCircle className="w-4 h-4 mr-2 sm:mr-3" />
                <span className="text-sm sm:text-base">Help Center</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2 sm:mr-3" />
                <span className="text-sm sm:text-base">Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2 sm:mr-3" />
                <span className="text-sm sm:text-base">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
