import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationsStore } from '@/stores/notifications.store';

let socket: Socket | null = null;

export function useWebSocket() {
  const { token, user } = useAuthStore();
  const { addNotification } = useNotificationsStore();

  useEffect(() => {
    if (!token) return;

    const wsUrl = process.env.EXPO_PUBLIC_WS_URL;
    if (!wsUrl) return;

    socket = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('borrow:approved', (data) => {
      addNotification({ type: 'success', message: `Borrow approved: ${data.itemName}` });
    });

    socket.on('borrow:rejected', (data) => {
      addNotification({ type: 'error', message: `Borrow rejected: ${data.itemName}` });
    });

    socket.on('borrow:reminder', (data) => {
      addNotification({ type: 'warning', message: `Due today: ${data.itemName}` });
    });

    socket.on('borrow:request', (data) => {
      if (user?.role !== 'student') {
        addNotification({ type: 'info', message: `New borrow request from ${data.requesterName}` });
      }
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [token]);
}
