import { apiClient } from './api';
import { ApiResponse } from '../types/api';
import { Recommendation } from '../types/itinerary';

export const recommendationService = {
  async getRecommendations(tripId: string, category?: string): Promise<Recommendation[]> {
    const params = category && category !== 'All' ? { category } : {};
    const res = await apiClient.get<ApiResponse<Recommendation[]>>(`/recommendations/${tripId}`, { params });
    return res.data.data || [];
  },
};
