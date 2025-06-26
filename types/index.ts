export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  cuisine_type: string;
  rating: number;
  pickup_time: string;
  address: string;
  latitude: number;
  longitude: number;
  is_open: boolean;
  opening_hours: string;
}

export interface Dish {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  category: string;
  spice_level: number; // 1-5
  country_origin: string;
  country_flag: string;
  origin_story: string;
  ingredients: string[];
  is_vegetarian: boolean;
  is_vegan: boolean;
  calories?: number;
  preparation_method?: string;
  cultural_significance?: string;
  health_benefits?: string;
  native_regions?: string[];
  taste_profile?: string;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  special_instructions?: string;
  customizations?: string[];
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  items: CartItem[];
  total_amount: number;
  tax_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'picked_up' | 'cancelled';
  pickup_location: string;
  payment_method: string;
  created_at: string;
  estimated_pickup_time?: string;
}

export interface CountryInfo {
  name: string;
  flag: string;
  description: string;
}