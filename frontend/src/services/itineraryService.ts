import { apiClient } from './api';
import { ApiResponse } from '../types/api';
import { FullItinerary, DayItinerary, Activity } from '../types/itinerary';

export const itineraryService = {
  async getItinerary(tripId: string): Promise<FullItinerary> {
    const res = await apiClient.get<ApiResponse<FullItinerary>>(`/itineraries/${tripId}`);
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Itinerary not found');
    }
    return res.data.data;
  },

  async regenerateDay(
    tripId: string,
    dayNumber: number,
    preferencesOverride?: string
  ): Promise<DayItinerary> {
    const res = await apiClient.post<ApiResponse<DayItinerary>>(
      `/itineraries/${tripId}/days/${dayNumber}/regenerate`,
      { day_number: dayNumber, preferences_override: preferencesOverride }
    );
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to regenerate day');
    }
    return res.data.data;
  },

  async addActivity(tripId: string, itineraryId: string, activity: Partial<Activity>): Promise<Activity> {
    const res = await apiClient.post<ApiResponse<Activity>>(
      `/itineraries/${tripId}/days/${itineraryId}/activities`,
      activity
    );
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to add activity');
    }
    return res.data.data;
  },

  async updateActivity(tripId: string, activityId: string, updates: Partial<Activity>): Promise<Activity> {
    const res = await apiClient.put<ApiResponse<Activity>>(
      `/itineraries/${tripId}/activities/${activityId}`,
      updates
    );
    if (!res.data.data) {
      throw new Error(res.data.error?.message || 'Failed to update activity');
    }
    return res.data.data;
  },

  async deleteActivity(tripId: string, activityId: string): Promise<void> {
    await apiClient.delete(`/itineraries/${tripId}/activities/${activityId}`);
  },
};
