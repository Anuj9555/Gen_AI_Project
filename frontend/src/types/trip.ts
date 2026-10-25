export type TravelStyle =
  | 'Budget'
  | 'Balanced'
  | 'Luxury'
  | 'Adventure'
  | 'Relaxed'
  | 'Cultural'
  | 'Romantic'
  | 'Family';

export type PaceOption = 'Relaxed' | 'Balanced' | 'Packed';

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  group_size: number;
  travel_style: TravelStyle;
  pace: PaceOption;
  interests: string[];
  accommodation_preference?: string;
  transportation_preference?: string;
  food_preference?: string;
  special_requirements?: string;
  status: 'planned' | 'itinerary_ready' | 'in_progress' | 'completed';
  total_estimated_cost?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TripCreateInput {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  group_size: number;
  travel_style: string;
  pace: string;
  interests: string[];
  accommodation_preference?: string;
  transportation_preference?: string;
  food_preference?: string;
  special_requirements?: string;
}
