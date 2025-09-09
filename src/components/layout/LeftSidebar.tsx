import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Search,
  Bell,
  MessageCircle,
  User,
  Bookmark,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface LeftSidebarProps {
  className?: string;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      name: 'Profile',
      icon: User,
      path: user?.username ? `/@${user.username}` : '/profile/me',
      tooltip: 'My Profile',
    },
    {
      name: 'Bookmarks',
      icon: Bookmark,
      path: '/bookmarks',
      tooltip: 'Saved Posts',
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
      tooltip: 'Settings',
    },
  ];

  const SidebarItem = ({ item }: { item: (typeof navigationItems)[0] }) => {
    const content = (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-primary/10 group ${
            isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:text-primary'
          } ${isCollapsed ? 'justify-center' : ''}`
        }
      >
        <item.icon className="w-6 h-6 flex-shrink-0" />
        {!isCollapsed && <span className="font-medium text-base">{item.name}</span>}
      </NavLink>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p>{item.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  return (
    <div
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-background/80 backdrop-blur-xl border-r border-border/50 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          {!isCollapsed && <h2 className="text-lg font-semibold text-foreground">Navigation</h2>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-border/50">
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center">
                    <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p>
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">@{user?.username}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-muted-foreground truncate">@{user?.username}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map(item => (
            <SidebarItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border/50">
          {!isCollapsed && (
            <div className="text-xs text-muted-foreground text-center">
              <p>© 2024 EndlessChat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
