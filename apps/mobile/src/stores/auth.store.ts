import { create } from 'zustand';
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession, confirmSignUp } from 'aws-amplify/auth';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'faculty' | 'student';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  confirmCode: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      const session = await fetchAuthSession();
      const cognitoUser = await getCurrentUser();
      const token = session.tokens?.idToken?.toString() ?? null;
      const payload = session.tokens?.idToken?.payload;
      const role = (payload?.['custom:role'] as string) ?? 'student';

      set({
        user: {
          id: cognitoUser.userId,
          email: cognitoUser.signInDetails?.loginId ?? '',
          name: (payload?.name as string) ?? '',
          role: role as User['role'],
        },
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      router.replace('/(tabs)');
    } catch {
      set({ isLoading: false });
      router.replace('/(auth)/login');
    }
  },

  login: async (email, password) => {
    set({ error: null, isLoading: true });
    try {
      await signIn({ username: email, password });
      await useAuthStore.getState().initialize();
    } catch (err: any) {
      set({ error: err.message ?? 'Login failed', isLoading: false });
    }
  },

  register: async (email, password, name) => {
    set({ error: null, isLoading: true });
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email, name } },
      });
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message ?? 'Registration failed', isLoading: false });
    }
  },

  confirmCode: async (email, code) => {
    set({ error: null, isLoading: true });
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message ?? 'Confirmation failed', isLoading: false });
    }
  },

  logout: async () => {
    await signOut();
    set({ user: null, token: null, isAuthenticated: false });
    router.replace('/(auth)/login');
  },

  clearError: () => set({ error: null }),
}));
