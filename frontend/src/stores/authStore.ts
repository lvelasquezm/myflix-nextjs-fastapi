import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { LOGIN_ERROR_MSG_BY_STATUS, LOGIN_FAILED_ERROR_MESSAGE } from '@/constants/error';
import { apiClient, CustomApiError } from '@/lib/api';
import type { AuthActions, AuthState, LoginCredentials, LoginResponse } from '@/types/auth';

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      // Start with false to initialize auth state (see AuthProvider.tsx).
      isAuthInitialized: false,
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
          let msg = '';
          if (error instanceof CustomApiError) {
            msg = LOGIN_ERROR_MSG_BY_STATUS[
              error.statusCode as keyof typeof LOGIN_ERROR_MSG_BY_STATUS
            ] || LOGIN_FAILED_ERROR_MESSAGE;
          } else {
            msg = (error as Error).message || LOGIN_FAILED_ERROR_MESSAGE;
          }

          set({
            isLoading: false,
            error: msg,
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
            isAuthInitialized: true,
          });
        } else {
          // Token doesn't exist, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isAuthInitialized: true,
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
