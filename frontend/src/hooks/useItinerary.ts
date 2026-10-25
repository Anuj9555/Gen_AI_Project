import { useEffect } from 'react';
import { useTripStore } from '../store/tripStore';

export const useItinerary = (tripId?: string) => {
  const {
    currentTrip,
    currentItinerary,
    recommendations,
    isLoading,
    isGenerating,
    error,
    fetchTripDetails,
    generateItinerary,
    regenerateDay,
    addActivity,
    updateActivity,
    deleteActivity,
    fetchRecommendations,
  } = useTripStore();

  useEffect(() => {
    if (tripId) {
      fetchTripDetails(tripId);
    }
  }, [tripId, fetchTripDetails]);

  return {
    trip: currentTrip,
    itinerary: currentItinerary,
    recommendations,
    isLoading,
    isGenerating,
    error,
    generateItinerary: () => (tripId ? generateItinerary(tripId) : Promise.reject('No tripId')),
    regenerateDay: (dayNumber: number, override?: string) =>
      tripId ? regenerateDay(tripId, dayNumber, override) : Promise.reject('No tripId'),
    addActivity: (dayId: string, activity: any) =>
      tripId ? addActivity(tripId, dayId, activity) : Promise.reject('No tripId'),
    updateActivity: (activityId: string, updates: any) =>
      tripId ? updateActivity(tripId, activityId, updates) : Promise.reject('No tripId'),
    deleteActivity: (activityId: string) =>
      tripId ? deleteActivity(tripId, activityId) : Promise.reject('No tripId'),
    refreshRecommendations: (category?: string) =>
      tripId ? fetchRecommendations(tripId, category) : Promise.resolve(),
  };
};
