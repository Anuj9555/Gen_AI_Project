import { create } from 'zustand';
import { AuthSession, UserProfile } from '../types/user';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

interface AuthState {
  session: AuthSession | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    try {
      const stored = localStorage.getItem('wanderai_session');
      if (stored) {
        const session: AuthSession = JSON.parse(stored);
        set({ session, isAuthenticated: true });
        try {
          const profile = await userService.getProfile();
          set({ profile, isLoading: false });
        } catch {
          // If offline or profile fetch fails, maintain session
          set({
            profile: {
              id: session.user_id,
              user_id: session.user_id,
              email: session.email,
              full_name: session.full_name || session.email.split('@')[0],
            },
            isLoading: false,
          });
        }
      } else {
        set({ session: null, profile: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ session: null, profile: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, pass: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.login({ email, password: pass });
      localStorage.setItem('wanderai_session', JSON.stringify(session));
      set({ session, isAuthenticated: true });
      try {
        const profile = await userService.getProfile();
        set({ profile, isLoading: false });
      } catch {
        set({
          profile: {
            id: session.user_id,
            user_id: session.user_id,
            email: session.email,
            full_name: session.full_name || session.email.split('@')[0],
          },
          isLoading: false,
        });
      }
    } catch (err: any) {
      set({
        error: err.response?.data?.error?.message || err.message || 'Login failed',
        isLoading: false,
      });
      throw err;
    }
  },

  register: async (email: string, pass: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.register({ email, password: pass, full_name: name });
      localStorage.setItem('wanderai_session', JSON.stringify(session));
      set({
        session,
        isAuthenticated: true,
        profile: {
          id: session.user_id,
          user_id: session.user_id,
          email: session.email,
          full_name: name,
        },
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.error?.message || err.message || 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    await authService.logout();
    set({ session: null, profile: null, isAuthenticated: false, isLoading: false });
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    try {
      const updated = await userService.updateProfile(data);
      set({ profile: updated });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
}));
