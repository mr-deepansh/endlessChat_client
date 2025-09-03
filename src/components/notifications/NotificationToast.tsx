import React from 'react';
import { toast } from '../../hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Heart, MessageCircle, UserPlus, Repeat2, User } from 'lucide-react';
import type { Notification } from '../../contexts/NotificationContext';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="h-4 w-4 text-red-500 fill-current" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4 text-blue-500" />;
    case 'follow':
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case 'repost':
      return <Repeat2 className="h-4 w-4 text-purple-500" />;
    default:
      return <User className="h-4 w-4 text-muted-foreground" />;
  }
};

export const showNotificationToast = (notification: Notification) => {
  const message = `${notification.from.firstName} ${notification.from.lastName} ${notification.message}`;

  toast({
    title: 'New Notification',
    description: (
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={notification.from.avatar} />
          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
            {notification.from.firstName?.[0]}
            {notification.from.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm">{message}</p>
          <div className="flex items-center mt-1">
            {getNotificationIcon(notification.type)}
            <span className="text-xs text-muted-foreground ml-1">
              {new Date(notification.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    ),
    action: (
      <Button variant="outline" size="sm" onClick={() => (window.location.href = '/notifications')}>
        View
      </Button>
    ),
  });
};
