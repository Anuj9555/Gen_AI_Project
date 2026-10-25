import { useEffect } from 'react';
import { useTripStore } from '../store/tripStore';

export const useTrips = (autoFetch: boolean = true) => {
  const { trips, isLoading, error, fetchTrips, createTrip, updateTrip, deleteTrip } = useTripStore();

  useEffect(() => {
    if (autoFetch) {
      fetchTrips();
    }
  }, [autoFetch, fetchTrips]);

  const upcomingTrips = trips.filter((t) => new Date(t.end_date) >= new Date());
  const pastTrips = trips.filter((t) => new Date(t.end_date) < new Date());
  const totalSpending = trips.reduce((sum, t) => sum + (t.total_estimated_cost || 0), 0);

  return {
    trips,
    upcomingTrips,
    pastTrips,
    totalSpending,
    isLoading,
    error,
    refreshTrips: fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };
};
