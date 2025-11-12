import create from 'zustand';
import { signIn, signUp, signOut, getCurrentUser, supabase } from '../services/supabase';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { session } = await signIn(email, password);

      if (session?.user) {
        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: (session.user.user_metadata?.display_name as string) || 'User',
          },
          loading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message || 'Login failed', loading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    set({ loading: true, error: null });
    try {
      const { user } = await signUp(email, password, name);

      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email || '',
            name,
          },
          loading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message || 'Signup failed', loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await signOut();
      set({ user: null, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.message || 'Logout failed', loading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      const user = await getCurrentUser();

      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email || '',
            name: (user.user_metadata?.display_name as string) || 'User',
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  const store = useAuthStore.getState();

  if (session?.user) {
    store.checkAuth();
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null });
  }
});
