import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { apiClient } from '@/lib/api';
import type { AuthActions, AuthState, LoginCredentials, LoginResponse } from '@/types/auth';

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      // Start with loading true to initialize auth state
      // (see AuthProvider.tsx).
      isLoading: true,
      error: null,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Initialize auth state from localStorage
      initialize: () => {
        const { token } = get();
        
        if (token) {
          set({
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Token doesn't exist, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },
    }),
    {
      name: 'myflix_auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
