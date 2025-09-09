import React from 'react';
import { NavLink } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNotifications } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

interface NotificationBellProps {
  className?: string;
  showBadge?: boolean;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = '',
  showBadge = true,
}) => {
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <NavLink
      to="/notifications"
      className={`relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 ${className}`}
    >
      <Bell className="w-4 h-4" />
      {showBadge && unreadCount > 0 && (
        <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}
    </NavLink>
  );
};

export default NotificationBell;
