export interface Activity {
  id?: string;
  itinerary_id?: string;
  time: string;
  title: string;
  description: string;
  activity_type: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  duration_minutes: number;
  estimated_cost: number;
}

export interface FoodRecommendation {
  name: string;
  cuisine: string;
  meal_type: string;
  description: string;
  price_level: string;
  estimated_cost: number;
  location: string;
}

export interface TransportOption {
  mode: string;
  description: string;
  estimated_cost: number;
}

export interface DayItinerary {
  id?: string;
  trip_id?: string;
  day_number: number;
  date: string;
  summary: string;
  activities: Activity[];
  food_recommendations: FoodRecommendation[];
  transportation: TransportOption[];
  estimated_daily_cost: number;
}

export interface FullItinerary {
  trip_id: string;
  destination: string;
  trip_summary: string;
  days: DayItinerary[];
  total_estimated_cost: number;
  travel_tips: string[];
  important_notes: string[];
}

export interface Recommendation {
  id?: string;
  trip_id?: string;
  category: 'Attractions' | 'Restaurants' | 'Hotels' | 'Transportation' | 'Experiences' | string;
  name: string;
  description: string;
  location: string;
  rating: number;
  estimated_cost: number;
  reason: string;
  source?: string;
}
