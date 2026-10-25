import { apiClient } from './api';
import { ApiResponse } from '../types/api';
import { UserProfile } from '../types/user';

export const userService = {
  async getProfile(): Promise<UserProfile> {
    const res = await apiClient.get<ApiResponse<UserProfile>>('/users/me');
    if (!res.data.data) {
      throw new Error('Profile not found');
    }
    return res.data.data;
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const res = await apiClient.put<ApiResponse<UserProfile>>('/users/me', data);
    if (!res.data.data) {
      throw new Error('Failed to update profile');
    }
    return res.data.data;
  },
};
