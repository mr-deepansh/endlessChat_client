import { useEffect, useRef } from 'react';
import { toast } from './use-toast';

interface UseRealTimeUpdatesProps {
  onPostUpdate?: (data: any) => void;
  onFollowUpdate?: (data: any) => void;
  onNotification?: (data: any) => void;
}

export const useRealTimeUpdates = ({
  onPostUpdate,
  onFollowUpdate,
  onNotification,
}: UseRealTimeUpdatesProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Connect to WebSocket
    const wsUrl = `${process.env.VITE_API_BASE_URL?.replace('http', 'ws')}/ws?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case 'POST_LIKED':
          case 'POST_UNLIKED':
          case 'POST_REPOSTED':
          case 'POST_UNREPOSTED':
          case 'POST_BOOKMARKED':
          case 'POST_UNBOOKMARKED':
            onPostUpdate?.(data);
            break;

          case 'USER_FOLLOWED':
          case 'USER_UNFOLLOWED':
            onFollowUpdate?.(data);
            break;

          case 'NEW_NOTIFICATION':
            onNotification?.(data);
            toast({
              title: 'New Notification',
              description: data.message,
            });
            break;

          default:
            console.log('Unknown WebSocket message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = error => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          // Reconnect logic here
        }
      }, 3000);
    };

    return () => {
      ws.close();
    };
  }, [onPostUpdate, onFollowUpdate, onNotification]);

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
};
