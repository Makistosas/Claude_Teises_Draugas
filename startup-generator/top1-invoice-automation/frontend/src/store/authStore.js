import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: async (email, password) => {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/auth/login', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const { access_token } = response.data;
        set({ token: access_token });

        // Fetch user info
        const userResponse = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        set({ user: userResponse.data });

        return response.data;
      },

      register: async (email, password, fullName) => {
        const response = await api.post('/auth/register', {
          email,
          password,
          full_name: fullName
        });
        return response.data;
      },

      logout: () => {
        set({ token: null, user: null });
      },

      refreshUser: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const response = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: response.data });
        } catch (error) {
          if (error.response?.status === 401) {
            set({ token: null, user: null });
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
  )
);
