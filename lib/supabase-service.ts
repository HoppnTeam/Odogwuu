import { supabase } from './supabase';
import type { Database } from './supabase';

// Type definitions from the database
type User = Database['public']['Tables']['users']['Row'];
type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type Dish = Database['public']['Tables']['dishes']['Row'];
type Order = Database['public']['Tables']['orders']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'];

// User Services
export const userService = {
  // Get current user profile
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        // If user doesn't exist in the users table, return null instead of throwing
        if (error.code === 'PGRST116') {
          console.log('User profile not found in database, creating default profile...');
          return null;
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Create or update user profile
  async upsertUser(userData: Partial<User>): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email!,
          ...userData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error upserting user:', error);
      return null;
    }
  },

  // Update user preferences
  async updatePreferences(preferences: {
    dietary_preferences?: string[];
    spice_tolerance?: number;
  }): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('users')
        .update({
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }
};

// Restaurant Services
export const restaurantService = {
  // Get all restaurants
  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_open', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting restaurants:', error);
      return [];
    }
  },

  // Get restaurants by cuisine type
  async getRestaurantsByCuisine(cuisineType: string): Promise<Restaurant[]> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('cuisine_type', cuisineType)
        .eq('is_open', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting restaurants by cuisine:', error);
      return [];
    }
  },

  // Get nearby restaurants
  async getNearbyRestaurants(lat: number, lng: number, radiusKm: number = 10): Promise<Restaurant[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_nearby_restaurants', {
          user_lat: lat,
          user_lng: lng,
          radius_km: radiusKm
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting nearby restaurants:', error);
      return [];
    }
  },

  // Get restaurant by ID
  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting restaurant by ID:', error);
      return null;
    }
  }
};

// Dish Services
export const dishService = {
  // Get all available dishes
  async getAllDishes(): Promise<Dish[]> {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select(`
          *,
          restaurants (
            id,
            name,
            address,
            pickup_time,
            is_open
          )
        `)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting dishes:', error);
      return [];
    }
  },

  // Get dishes by restaurant
  async getDishesByRestaurant(restaurantId: string): Promise<Dish[]> {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true)
        .order('category, name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting dishes by restaurant:', error);
      return [];
    }
  },

  // Get dishes by country
  async getDishesByCountry(country: string): Promise<Dish[]> {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select(`
          *,
          restaurants (
            id,
            name,
            address,
            pickup_time,
            is_open
          )
        `)
        .eq('country_origin', country)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting dishes by country:', error);
      return [];
    }
  },

  // Get dish by ID
  async getDishById(id: string): Promise<Dish | null> {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select(`
          *,
          restaurants (
            id,
            name,
            address,
            pickup_time,
            is_open,
            phone_number
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting dish by ID:', error);
      return null;
    }
  },

  // Search dishes
  async searchDishes(query: string): Promise<Dish[]> {
    try {
      const { data, error } = await supabase
        .from('dishes')
        .select(`
          *,
          restaurants (
            id,
            name,
            address,
            pickup_time,
            is_open
          )
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,country_origin.ilike.%${query}%`)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching dishes:', error);
      return [];
    }
  }
};

// Order Services
export const orderService = {
  // Create new order
  async createOrder(orderData: {
    restaurant_id: string;
    items: any[];
    total_amount: number;
    tax_amount: number;
    service_fee: number;
    pickup_location: string;
    payment_method: string;
    special_instructions?: string;
  }): Promise<Order | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          ...orderData,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  },

  // Get user orders
  async getUserOrders(): Promise<Order[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurants (
            id,
            name,
            address,
            phone_number
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  },

  // Get order by ID
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          restaurants (
            id,
            name,
            address,
            phone_number
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting order by ID:', error);
      return null;
    }
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }
};

// Review Services
export const reviewService = {
  // Create review
  async createReview(reviewData: {
    dish_id?: string;
    restaurant_id?: string;
    order_id: string;
    rating: number;
    comment?: string;
  }): Promise<Review | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          ...reviewData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      return null;
    }
  },

  // Get reviews for dish
  async getDishReviews(dishId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('dish_id', dishId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting dish reviews:', error);
      return [];
    }
  },

  // Get reviews for restaurant
  async getRestaurantReviews(restaurantId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting restaurant reviews:', error);
      return [];
    }
  }
};

// Utility function to calculate Minnesota tax
export const calculateMinnesotaTax = (subtotal: number, city: string = 'Minneapolis'): number => {
  const taxRates: { [key: string]: number } = {
    'Minneapolis': 0.0875,
    'St. Paul': 0.0875,
    'Bloomington': 0.08125,
    'default': 0.0875
  };

  const rate = taxRates[city] || taxRates.default;
  return Math.round(subtotal * rate * 100) / 100;
};

// Utility function to calculate service fee
export const calculateServiceFee = (subtotal: number, feePercentage: number = 0.05): number => {
  return Math.round(subtotal * feePercentage * 100) / 100;
}; 