export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  travel_preferences?: {
    default_budget?: number;
    preferred_currency?: string;
    preferred_travel_style?: string;
    preferred_pace?: string;
    interests?: string[];
  };
  created_at?: string;
  updated_at?: string;
}

export interface AuthSession {
  access_token: string;
  user_id: string;
  email: string;
  full_name?: string;
  refresh_token?: string;
}
