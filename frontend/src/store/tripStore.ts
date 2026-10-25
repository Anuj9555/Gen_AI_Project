import { create } from 'zustand';
import { Trip, TripCreateInput } from '../types/trip';
import { FullItinerary, DayItinerary, Activity, Recommendation } from '../types/itinerary';
import { tripService } from '../services/tripService';
import { itineraryService } from '../services/itineraryService';
import { recommendationService } from '../services/recommendationService';

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  currentItinerary: FullItinerary | null;
  recommendations: Recommendation[];
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;

  fetchTrips: () => Promise<void>;
  fetchTripDetails: (tripId: string) => Promise<void>;
  createTrip: (data: TripCreateInput) => Promise<Trip>;
  updateTrip: (tripId: string, data: Partial<TripCreateInput>) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
  generateItinerary: (tripId: string) => Promise<void>;
  regenerateDay: (tripId: string, dayNumber: number, override?: string) => Promise<void>;
  addActivity: (tripId: string, dayId: string, activity: Partial<Activity>) => Promise<void>;
  updateActivity: (tripId: string, activityId: string, updates: Partial<Activity>) => Promise<void>;
  deleteActivity: (tripId: string, activityId: string) => Promise<void>;
  fetchRecommendations: (tripId: string, category?: string) => Promise<void>;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  currentTrip: null,
  currentItinerary: null,
  recommendations: [],
  isLoading: false,
  isGenerating: false,
  error: null,

  fetchTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      const trips = await tripService.getTrips();
      set({ trips, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchTripDetails: async (tripId: string) => {
    set({ isLoading: true, error: null });
    try {
      const trip = await tripService.getTrip(tripId);
      set({ currentTrip: trip });
      try {
        const itinerary = await itineraryService.getItinerary(tripId);
        set({ currentItinerary: itinerary });
      } catch {
        set({ currentItinerary: null });
      }
      try {
        const recs = await recommendationService.getRecommendations(tripId);
        set({ recommendations: recs });
      } catch {
        set({ recommendations: [] });
      }
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createTrip: async (data: TripCreateInput) => {
    set({ isLoading: true, error: null });
    try {
      const newTrip = await tripService.createTrip(data);
      set((state) => ({ trips: [newTrip, ...state.trips], isLoading: false }));
      return newTrip;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateTrip: async (tripId: string, data: Partial<TripCreateInput>) => {
    try {
      const updated = await tripService.updateTrip(tripId, data);
      set((state) => ({
        trips: state.trips.map((t) => (t.id === tripId ? updated : t)),
        currentTrip: state.currentTrip?.id === tripId ? updated : state.currentTrip,
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteTrip: async (tripId: string) => {
    try {
      await tripService.deleteTrip(tripId);
      set((state) => ({
        trips: state.trips.filter((t) => t.id !== tripId),
        currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip,
        currentItinerary: state.currentTrip?.id === tripId ? null : state.currentItinerary,
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  generateItinerary: async (tripId: string) => {
    set({ isGenerating: true, error: null });
    try {
      const itinerary = await tripService.generateItinerary(tripId);
      const updatedTrip = await tripService.getTrip(tripId);
      set((state) => ({
        currentItinerary: itinerary,
        currentTrip: updatedTrip,
        trips: state.trips.map((t) => (t.id === tripId ? updatedTrip : t)),
        isGenerating: false,
      }));
      // Fetch fresh recommendations
      const recs = await recommendationService.getRecommendations(tripId);
      set({ recommendations: recs });
    } catch (err: any) {
      set({ error: err.message, isGenerating: false });
      throw err;
    }
  },

  regenerateDay: async (tripId: string, dayNumber: number, override?: string) => {
    set({ isGenerating: true });
    try {
      const freshDay = await itineraryService.regenerateDay(tripId, dayNumber, override);
      set((state) => {
        if (!state.currentItinerary) return { isGenerating: false };
        const updatedDays = state.currentItinerary.days.map((d) =>
          d.day_number === dayNumber ? freshDay : d
        );
        const newTotal = updatedDays.reduce((acc, curr) => acc + curr.estimated_daily_cost, 0);
        return {
          currentItinerary: {
            ...state.currentItinerary,
            days: updatedDays,
            total_estimated_cost: Math.round(newTotal),
          },
          isGenerating: false,
        };
      });
    } catch (err: any) {
      set({ error: err.message, isGenerating: false });
      throw err;
    }
  },

  addActivity: async (tripId: string, dayId: string, activity: Partial<Activity>) => {
    try {
      const newAct = await itineraryService.addActivity(tripId, dayId, activity);
      set((state) => {
        if (!state.currentItinerary) return {};
        const updatedDays = state.currentItinerary.days.map((d) => {
          if (d.id === dayId) {
            const acts = [...d.activities, newAct];
            const dailyCost = acts.reduce((acc, a) => acc + a.estimated_cost, 0);
            return { ...d, activities: acts, estimated_daily_cost: dailyCost };
          }
          return d;
        });
        return {
          currentItinerary: {
            ...state.currentItinerary,
            days: updatedDays,
          },
        };
      });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  updateActivity: async (tripId: string, activityId: string, updates: Partial<Activity>) => {
    try {
      const updated = await itineraryService.updateActivity(tripId, activityId, updates);
      set((state) => {
        if (!state.currentItinerary) return {};
        const updatedDays = state.currentItinerary.days.map((d) => {
          const actIndex = d.activities.findIndex((a) => a.id === activityId);
          if (actIndex !== -1) {
            const acts = [...d.activities];
            acts[actIndex] = updated;
            return { ...d, activities: acts };
          }
          return d;
        });
        return {
          currentItinerary: {
            ...state.currentItinerary,
            days: updatedDays,
          },
        };
      });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteActivity: async (tripId: string, activityId: string) => {
    try {
      await itineraryService.deleteActivity(tripId, activityId);
      set((state) => {
        if (!state.currentItinerary) return {};
        const updatedDays = state.currentItinerary.days.map((d) => ({
          ...d,
          activities: d.activities.filter((a) => a.id !== activityId),
        }));
        return {
          currentItinerary: {
            ...state.currentItinerary,
            days: updatedDays,
          },
        };
      });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  fetchRecommendations: async (tripId: string, category?: string) => {
    try {
      const recs = await recommendationService.getRecommendations(tripId, category);
      set({ recommendations: recs });
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
