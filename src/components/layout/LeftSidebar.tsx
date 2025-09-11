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
          `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-muted/50 group ${
            isActive ? 'bg-muted text-primary' : 'text-foreground hover:text-primary'
          }`
        }
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <span className="font-normal text-sm">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <div
      className={`fixed left-0 top-12 h-[calc(100vh-3rem)] w-60 bg-card/95 backdrop-blur-xl border-r border-border/50 z-40 overflow-y-hidden ${className}`}
    >
      <div className="flex flex-col h-full px-4 overflow-y-hidden">
        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 py-4">
          {navigationItems.map(item => (
            <SidebarItem key={item.name} item={item} />
          ))}

          {/* Create Post Button */}
          <Button
            onClick={handleCreatePost}
            className="w-full h-10 bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-full font-medium text-sm mt-2 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        </nav>

        {/* Bottom Section */}
        <div className="py-4 space-y-3 border-t border-border/50">
          {/* User Profile */}
          <div
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted/30 cursor-pointer transition-all duration-200"
            onClick={() => navigate(user?.username ? `/u/${user.username}` : '/profile/me')}
          >
            <Avatar className="w-8 h-8 ring-1 ring-primary/20 hover:ring-primary/30 transition-all">
              <AvatarImage src={user?.avatar} alt={user?.username} />
              <AvatarFallback className="bg-gradient-primary text-white text-xs">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-normal text-foreground truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">@{user?.username}</p>
            </div>
          </div>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full h-10 bg-gradient-primary hover:bg-gradient-primary/90 text-white rounded-full font-medium text-sm transition-all duration-200">
                <MoreHorizontal className="w-4 h-4 mr-2" />
                More
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/help')} className="cursor-pointer">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help Center
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
