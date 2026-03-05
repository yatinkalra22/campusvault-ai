import { create } from 'zustand';

interface AppNotification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  createdAt: number;
}

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id' | 'createdAt'>) => void;
  clearAll: () => void;
  markAllRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (n) =>
    set((state) => ({
      notifications: [
        { ...n, id: Date.now().toString(), createdAt: Date.now() },
        ...state.notifications,
      ].slice(0, 50), // Keep last 50
      unreadCount: state.unreadCount + 1,
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),
  markAllRead: () => set({ unreadCount: 0 }),
}));
