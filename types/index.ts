export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone_number?: string;
  dietary_preferences: string[];
  spice_tolerance: number;
  created_at: string;
  updated_at: string;
  // Onboarding fields
  onboarding_completed?: boolean;
  onboarding_data?: OnboardingData;
}

// Onboarding Types
export interface OnboardingData {
  fullName?: string;
  dietaryPreferences?: string[];
  spiceLevel?: number;
  explorationStyle?: string;
  orderFrequency?: string;
  culturalInterests?: string[];
  supportPreferences?: string[];
}

export type DietaryPreference = 
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'nut-allergies'
  | 'halal'
  | 'kosher'
  | 'pescatarian'
  | 'dairy-free'
  | 'no-restrictions';

export type SpiceLevel = 1 | 2 | 3 | 4 | 5;

export type ExplorationStyle = 
  | 'gentle-explorer'
  | 'cultural-curious'
  | 'bold-adventurer'
  | 'specific-seeker';

export type OrderFrequency = 
  | 'daily'
  | '2-3-times-week'
  | 'weekly'
  | 'bi-weekly'
  | 'monthly';

// Onboarding Screen Props
export interface OnboardingScreenProps {
  onNext: (data?: Partial<OnboardingData>) => void;
  onBack: () => void;
  onSkip?: () => void;
  currentData?: Partial<OnboardingData>;
  screenNumber: number;
  totalScreens: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  cuisine_type: 'West African' | 'East African' | 'North African' | 'South African' | 'Central African';
  rating: number;
  pickup_time: string;
  address: string;
  latitude: number;
  longitude: number;
  is_open: boolean;
  opening_hours: string;
  phone_number: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export type DishSize = {
  label: string; // e.g., 'S', 'M', 'L'
  price: number;
  description?: string;
  is_available?: boolean;
};

export interface Dish {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  image_url: string;
  base_price: number;
  category: string;
  base_spice_level: number;
  country_origin: string;
  country_flag: string;
  origin_story: string;
  base_ingredients: string[];
  is_vegetarian: boolean;
  is_vegan: boolean;
  calories?: number;
  preparation_method?: string;
  cultural_significance?: string;
  health_benefits?: string;
  native_regions?: string[];
  taste_profile?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  sizes?: DishSize[];
}

export interface CartItem {
  id: string;
  dish_id: string;
  dish_name: string;
  restaurant_id: string;
  restaurant_name: string;
  image_url: string;
  base_price: number;
  quantity: number;
  special_instructions?: string;
  spice_level?: number;
  allergen_triggers?: string[];
  extras?: string[];
  preparation_notes?: string;
  total_price: number;
  selected_size?: DishSize;
}

export interface CartExtra {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: 'sauce' | 'side' | 'drink' | 'dessert' | 'other';
}

export interface AllergenInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface SpiceLevelInfo {
  level: number;
  name: string;
  description: string;
  icon: string;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  items: CartItem[];
  total_amount: number;
  tax_amount: number;
  service_fee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
  pickup_location: string;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  estimated_pickup_time?: string;
  actual_pickup_time?: string;
  special_instructions?: string;
  hp_order_id?: string; // HP order ID in format HP-YY-XXXXXXX
  created_at: string;
  updated_at: string;
}

export interface CountryInfo {
  name: string;
  flag: string;
  description: string;
}

export interface Review {
  id: string;
  user_id: string;
  dish_id?: string;
  restaurant_id?: string;
  order_id: string;
  rating: number;
  comment?: string;
  spice_level_rating?: number;
  authenticity_rating?: number;
  cultural_experience_rating?: number;
  overall_experience?: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithDetails extends Review {
  user: {
    full_name: string;
    avatar_url?: string;
  };
  dish?: {
    name: string;
    country_origin: string;
    country_flag: string;
  };
  vendor?: {
    name: string;
  };
}

export interface ReviewFormData {
  rating: number;
  comment?: string;
  spice_level_rating?: number;
  authenticity_rating?: number;
  cultural_experience_rating?: number;
  overall_experience?: number;
}

// Country Types
export interface Country {
  name: string;
  flag: string;
  description: string;
  cuisine_highlights: string[];
  cultural_significance: string;
}