import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_ENDPOINTS } from '../config/api';
import api from '../api';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,

      login: async (username, password) => {
        try {
          const response = await api.post(API_ENDPOINTS.ACCOUNTS.LOGIN, {
            username,
            password,
          });

          const { token, refresh_token, ...userData } = response.data.data;
          set({ token: token, refreshToken: refresh_token, user: userData });

        } catch (error) {
          console.error("Login failed:", error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || error.message);
        }
      },

      register: async (formData) => {
        try {
          const response = await api.post(API_ENDPOINTS.ACCOUNTS.REGISTER, formData);
          return response.data;
        } catch (error) {
          console.error("Register failed:", error.response?.data?.error || error.message);
          throw new Error(error.response?.data?.error || error.message);
        }
      },

      logout: () => {
        set({ token: null, refreshToken: null, user: null });
        localStorage.removeItem('auth-storage'); // Optional cleaner
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);