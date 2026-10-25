import { apiClient } from './api';
import { ApiResponse } from '../types/api';
import { Trip, TripCreateInput } from '../types/trip';
import { FullItinerary } from '../types/itinerary';

export const tripService = {
  async createTrip(data: TripCreateInput): Promise<Trip> {
    const res = await apiClient.post<ApiResponse<Trip>>('/trips', data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to create trip');
    }
    return res.data.data;
  },

  async getTrips(): Promise<Trip[]> {
    const res = await apiClient.get<ApiResponse<Trip[]>>('/trips');
    return res.data.data || [];
  },

  async getTrip(tripId: string): Promise<Trip> {
    const res = await apiClient.get<ApiResponse<Trip>>(`/trips/${tripId}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Trip not found');
    }
    return res.data.data;
  },

  async updateTrip(tripId: string, data: Partial<TripCreateInput>): Promise<Trip> {
    const res = await apiClient.put<ApiResponse<Trip>>(`/trips/${tripId}`, data);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to update trip');
    }
    return res.data.data;
  },

  async deleteTrip(tripId: string): Promise<void> {
    await apiClient.delete(`/trips/${tripId}`);
  },

  async generateItinerary(tripId: string): Promise<FullItinerary> {
    const res = await apiClient.post<ApiResponse<FullItinerary>>(`/trips/${tripId}/generate`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to generate itinerary');
    }
    return res.data.data;
  },

  async shareTrip(tripId: string, email: string, role: string = 'viewer'): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>(`/trips/${tripId}/share`, { email, role });
    return res.data.data;
  },
};
