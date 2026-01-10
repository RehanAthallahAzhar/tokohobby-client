import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    // Avoid circular dependency if possible, but Zustand read access is safe here
    // However, importing store directly is better. 
    // Wait, useAuthStore is a hook? Zustand stores can be used outside components
    // via useAuthStore.getState().

    // We need to make sure we import useAuthStore correctly. 
    // In previous file check: "export const useAuthStore = create(..."
    // So import { useAuthStore } from '../store/authStore' is likely correct if it was a named export?
    // Let's check authStore again. Yes "export const useAuthStore".
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken, login, logout } = useAuthStore.getState();

        if (!refreshToken) {
          // No refresh token, force logout
          logout();
          return Promise.reject(error);
        }

        // Call Refresh API
        // NOTE: We use a raw axios instance to avoid infinite loops if this call also 401s
        const refreshResponse = await axios.post('/api/v1/accounts/refresh', {
          refresh_token: refreshToken
        });

        const newAccessToken = refreshResponse.data.data.token;

        // Update Store manually (since we don't have a specific action for just updating token, 
        // we might need to add one or just update state directly via setState if possible, 
        // but Zustand getState() returns state, not setter. 
        // We can use useAuthStore.setState({ token: newAccessToken })
        useAuthStore.setState({ token: newAccessToken });

        // Update header for the failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed (token expired or invalid)
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;