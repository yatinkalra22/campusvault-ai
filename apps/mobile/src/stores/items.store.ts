import { create } from 'zustand';
import api from '@/services/api';

interface ItemsState {
  items: any[];
  isLoading: boolean;
  fetchItems: (filters?: Record<string, string>) => Promise<void>;
  getItem: (id: string) => Promise<any>;
}

export const useItemsStore = create<ItemsState>((set) => ({
  items: [],
  isLoading: false,

  fetchItems: async (filters) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/items', { params: filters });
      set({ items: Array.isArray(data) ? data : data.items ?? [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  getItem: async (id) => {
    const { data } = await api.get(`/items/${id}`);
    return data;
  },
}));
