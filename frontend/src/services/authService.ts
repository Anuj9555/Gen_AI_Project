import { apiClient } from './api';
import { ApiResponse } from '../types/api';
import { AuthSession } from '../types/user';

export const authService = {
  async register(data: { email: string; password: string; full_name: string }): Promise<AuthSession> {
    const res = await apiClient.post<ApiResponse<AuthSession>>('/auth/register', data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Registration failed');
    }
    return res.data.data;
  },

  async login(data: { email: string; password: string }): Promise<AuthSession> {
    const res = await apiClient.post<ApiResponse<AuthSession>>('/auth/login', data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Login failed');
    }
    return res.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('wanderai_session');
    }
  },

  async refresh(): Promise<AuthSession> {
    const res = await apiClient.post<ApiResponse<AuthSession>>('/auth/refresh');
    if (!res.data.data) {
      throw new Error('Refresh failed');
    }
    return res.data.data;
  },
};
