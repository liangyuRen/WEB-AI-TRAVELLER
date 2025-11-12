import create from 'zustand';

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
      // TODO: Implement login with Supabase
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      // if (error) throw error;
      set({ user: { id: '1', email, name: 'User' }, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  signup: async (email: string, password: string, name: string) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implement signup with Supabase
      set({ user: { id: '1', email, name }, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      // TODO: Implement logout with Supabase
      set({ user: null, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  checkAuth: async () => {
    set({ loading: true });
    try {
      // TODO: Check if user is already logged in
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
